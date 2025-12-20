/**
 * Controller para processar webhooks do ERP
 * Recebe eventos de pagamento, reembolso, e outras transações
 */

import { Request, Response } from "express";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";
import ERPProvider from "../models/ERPProvider";
import ERPWebhookLog from "../models/ERPWebhookLog";
import Subscription from "../models/Subscription";
import crypto from "crypto";

interface WebhookPayload {
  providerId?: number;
  eventType: string;
  externalId: string;
  invoiceId?: string;
  saleId?: string;
  status: string;
  amount?: number;
  [key: string]: any;
}

export const handleERPWebhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload: WebhookPayload = req.body;

  try {
    logger.info(`Webhook recebido do ERP: ${JSON.stringify(payload)}`);

    // 1. Extrair providerId do headers ou body
    const providerIdInput = payload.providerId || req.headers['x-provider-id'];
    const providerId = typeof providerIdInput === 'string' ? parseInt(providerIdInput) : providerIdInput;
    
    if (!providerId) {
      throw new AppError("providerId não fornecido no webhook");
    }

    // 2. Buscar integração ERP
    const erpIntegration = await ERPProvider.findByPk(providerId as number);
    if (!erpIntegration) {
      throw new AppError("Integração ERP não encontrada");
    }

    // 3. Validar webhook secret (HMAC)
    const webhookSignature = req.headers['x-webhook-signature'] as string;
    if (webhookSignature) {
      const isValid = validateWebhookSignature(
        JSON.stringify(payload),
        webhookSignature,
        erpIntegration.webhookSecret
      );

      if (!isValid) {
        logger.warn(`Webhook inválido para ERP ${providerId}: assinatura incorreta`);
        return res.status(401).json({ error: "Webhook signature inválida" });
      }
    }

    // 4. Salvar log do webhook
    const webhookLog = await ERPWebhookLog.create({
      erpProviderId: providerId,
      eventType: payload.eventType,
      externalId: payload.externalId || payload.invoiceId || payload.saleId,
      payload,
      processed: false
    });

    // 5. Processar evento baseado no tipo
    let processedSuccessfully = false;

    if (payload.eventType === 'payment' || payload.eventType === 'invoice_paid') {
      processedSuccessfully = await handlePaymentEvent(payload, erpIntegration.tenantId);
    } else if (payload.eventType === 'refund' || payload.eventType === 'invoice_refunded') {
      processedSuccessfully = await handleRefundEvent(payload, erpIntegration.tenantId);
    } else if (payload.eventType === 'failure' || payload.eventType === 'invoice_failed') {
      processedSuccessfully = await handleFailureEvent(payload, erpIntegration.tenantId);
    } else if (payload.eventType === 'sale' || payload.eventType === 'sale_created') {
      processedSuccessfully = await handleSaleEvent(payload, erpIntegration.tenantId);
    } else {
      logger.warn(`Evento desconhecido: ${payload.eventType}`);
    }

    // 6. Atualizar log como processado
    if (processedSuccessfully) {
      await webhookLog.update({
        processed: true,
        processedAt: new Date()
      });
    }

    return res.json({
      message: "Webhook recebido e processado",
      webhookLogId: webhookLog.id
    });
  } catch (error) {
    logger.error(`Erro ao processar webhook do ERP: ${error}`);

    // Salvar erro no log se possível
    const payloadProviderId = payload && payload.providerId ? 
      (typeof payload.providerId === 'string' ? parseInt(payload.providerId) : payload.providerId) : 
      null;
    if (payloadProviderId) {
      try {
        await ERPWebhookLog.create({
          erpProviderId: payloadProviderId as number,
          eventType: payload.eventType,
          externalId: payload.externalId || payload.invoiceId || payload.saleId,
          payload,
          processed: false,
          processingError: error.message
        });
      } catch (logError) {
        logger.error(`Erro ao salvar webhook log: ${logError}`);
      }
    }

    return res.status(400).json({
      error: error.message || "Erro ao processar webhook"
    });
  }
};

/**
 * Processar evento de pagamento recebido
 */
async function handlePaymentEvent(
  payload: WebhookPayload,
  tenantId: number
): Promise<boolean> {
  try {
    const invoiceId = payload.invoiceId || payload.externalId;

    // Buscar assinatura com este ID externo
    const subscription = await Subscription.findOne({
      where: {
        externalInvoiceId: invoiceId,
        tenantId
      }
    });

    if (!subscription) {
      logger.warn(`Assinatura não encontrada para fatura: ${invoiceId}`);
      return false;
    }

    // Atualizar assinatura como paga
    await subscription.update({
      status: 'active',
      paidAt: new Date()
    });

    logger.info(
      `Pagamento processado: Subscription ${subscription.id} ativada - Tenant ${tenantId}`
    );

    // TODO: Aqui você poderia:
    // - Enviar email de confirmação
    // - Emitir evento via WebSocket
    // - Registrar receita no dashboard
    // - Atualizar limite de consumo do tenant

    return true;
  } catch (error) {
    logger.error(`Erro ao processar pagamento: ${error}`);
    return false;
  }
}

/**
 * Processar evento de reembolso
 */
async function handleRefundEvent(
  payload: WebhookPayload,
  tenantId: number
): Promise<boolean> {
  try {
    const invoiceId = payload.invoiceId || payload.externalId;
    const refundAmount = payload.amount || payload.refund_amount;

    const subscription = await Subscription.findOne({
      where: {
        externalInvoiceId: invoiceId,
        tenantId
      }
    });

    if (!subscription) {
      logger.warn(`Assinatura não encontrada para reembolso: ${invoiceId}`);
      return false;
    }

    // Se foi reembolsado totalmente, cancelar assinatura
    if (refundAmount >= subscription.amount) {
      await subscription.update({
        status: 'canceled',
        canceledAt: new Date()
      });

      logger.info(
        `Reembolso total processado: Subscription ${subscription.id} cancelada - Tenant ${tenantId}`
      );
    } else {
      // Reembolso parcial (apenas registra)
      logger.info(
        `Reembolso parcial de R$ ${refundAmount} processado para Subscription ${subscription.id}`
      );
    }

    return true;
  } catch (error) {
    logger.error(`Erro ao processar reembolso: ${error}`);
    return false;
  }
}

/**
 * Processar evento de falha de pagamento
 */
async function handleFailureEvent(
  payload: WebhookPayload,
  tenantId: number
): Promise<boolean> {
  try {
    const invoiceId = payload.invoiceId || payload.externalId;

    const subscription = await Subscription.findOne({
      where: {
        externalInvoiceId: invoiceId,
        tenantId
      }
    });

    if (!subscription) {
      logger.warn(`Assinatura não encontrada para falha: ${invoiceId}`);
      return false;
    }

    // Manter status como pending mas registrar tentativa falha
    logger.warn(
      `Falha no pagamento: Subscription ${subscription.id} - Tenant ${tenantId} - Razão: ${payload.reason || 'desconhecida'}`
    );

    // TODO: Enviar notificação ao tenant sobre falha

    return true;
  } catch (error) {
    logger.error(`Erro ao processar falha de pagamento: ${error}`);
    return false;
  }
}

/**
 * Processar evento de venda do cliente via ERP
 */
async function handleSaleEvent(
  payload: WebhookPayload,
  tenantId: number
): Promise<boolean> {
  try {
    const saleId = payload.saleId || payload.externalId;
    const saleAmount = payload.total || payload.amount;

    logger.info(
      `Venda recebida do ERP: Tenant ${tenantId}, Sale ${saleId}, R$ ${saleAmount}`
    );

    // TODO: Aqui você criaria:
    // - Registro de venda no SaaS
    // - Fatura para o cliente final
    // - Link de pagamento
    // - Notificação no WhatsApp

    return true;
  } catch (error) {
    logger.error(`Erro ao processar venda: ${error}`);
    return false;
  }
}

/**
 * Validar assinatura HMAC do webhook
 */
function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    logger.error(`Erro ao validar webhook signature: ${error}`);
    return false;
  }
}
