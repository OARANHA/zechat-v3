/**
 * Controller para gerenciar assinaturas SaaS
 */

import { Request, Response } from "express";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";
import Subscription from "../models/Subscription";
import Plan from "../models/Plan";
import ERPProvider from "../models/ERPProvider";
import CreateSubscriptionService from "../services/SubscriptionServices/CreateSubscriptionService";
import { ERPProviderFactory } from "../providers/ERPProviderFactory";

interface CreateSubscriptionRequest {
  planId: number;
}

interface CancelSubscriptionRequest {
  reason?: string;
}

/**
 * POST /api/subscriptions
 * Criar uma nova assinatura
 */
export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { planId } = req.body as CreateSubscriptionRequest;
    const tenantId = Number(req.user.tenantId);

    if (!planId) {
      throw new AppError("planId é obrigatório");
    }

    if (!tenantId) {
      throw new AppError("TenantId não encontrado");
    }

    // Verificar se já tem assinatura ativa
    const existingSubscription = await Subscription.findOne({
      where: {
        tenantId,
        status: ['pending', 'active']
      }
    });

    if (existingSubscription) {
      throw new AppError(
        "Tenant já possui uma assinatura ativa. Cancele a atual antes de contratar uma nova."
      );
    }

    // Construir webhook URL
    const webhookUrl = `${process.env.BACKEND_URL}/webhook/erp/payment`;

    // Criar assinatura via service
    const subscription = await CreateSubscriptionService.execute({
      tenantId,
      planId,
      webhookUrl
    });

    // Buscar plano para detalhes
    const plan = await Plan.findByPk(planId);

    logger.info(`Assinatura criada para Tenant ${tenantId}: Plano ${plan?.name}`);

    return res.status(201).json({
      message: "Assinatura criada com sucesso",
      data: {
        subscriptionId: subscription.id,
        tenantId: subscription.tenantId,
        plan: {
          id: plan?.id,
          name: plan?.name,
          price: plan?.price
        },
        status: subscription.status,
        amount: subscription.amount,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        externalInvoiceId: subscription.externalInvoiceId,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    logger.error(`Erro ao criar assinatura: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao criar assinatura"
    });
  }
};

/**
 * GET /api/subscriptions
 * Listar assinaturas do tenant
 */
export const list = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tenantId = Number(req.user.tenantId);

    if (!tenantId) {
      throw new AppError("TenantId não encontrado");
    }

    const subscriptions = await Subscription.findAll({
      where: { tenantId },
      include: [
        {
          model: Plan,
          attributes: ['id', 'name', 'price', 'features']
        },
        {
          model: ERPProvider,
          attributes: ['id', 'providerType', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      data: subscriptions.map(sub => ({
        id: sub.id,
        plan: {
          id: sub.plan?.id,
          name: sub.plan?.name,
          price: sub.plan?.price
        },
        status: sub.status,
        amount: sub.amount,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        paidAt: sub.paidAt,
        canceledAt: sub.canceledAt,
        autoRenew: sub.autoRenew,
        erpProvider: {
          id: sub.erpProvider?.id,
          type: sub.erpProvider?.providerType,
          status: sub.erpProvider?.status
        },
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt
      }))
    });
  } catch (error) {
    logger.error(`Erro ao listar assinaturas: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao listar assinaturas"
    });
  }
};

/**
 * GET /api/subscriptions/:id
 * Obter detalhes de uma assinatura
 */
export const show = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const tenantId = Number(req.user.tenantId);

    if (!tenantId) {
      throw new AppError("TenantId não encontrado");
    }

    const subscription = await Subscription.findOne({
      where: { id, tenantId },
      include: [
        {
          model: Plan,
          attributes: ['id', 'name', 'price', 'features', 'limits']
        },
        {
          model: ERPProvider,
          attributes: ['id', 'providerType', 'status']
        }
      ]
    });

    if (!subscription) {
      throw new AppError("Assinatura não encontrada", 404);
    }

    return res.json({
      data: {
        id: subscription.id,
        tenantId: subscription.tenantId,
        plan: subscription.plan,
        status: subscription.status,
        amount: subscription.amount,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        paidAt: subscription.paidAt,
        canceledAt: subscription.canceledAt,
        autoRenew: subscription.autoRenew,
        externalInvoiceId: subscription.externalInvoiceId,
        erpProvider: subscription.erpProvider,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Erro ao buscar assinatura: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao buscar assinatura"
    });
  }
};

/**
 * POST /api/subscriptions/:id/cancel
 * Cancelar uma assinatura
 */
export const cancel = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { reason } = req.body as CancelSubscriptionRequest;
    const tenantId = Number(req.user.tenantId);

    if (!tenantId) {
      throw new AppError("TenantId não encontrado");
    }

    const subscription = await Subscription.findOne({
      where: { id, tenantId }
    });

    if (!subscription) {
      throw new AppError("Assinatura não encontrada", 404);
    }

    if (subscription.status === 'canceled') {
      throw new AppError("Assinatura já foi cancelada");
    }

    // Buscar integração ERP para cancelar fatura
    let erpIntegration: ERPProvider | null = null;
    if (subscription.erpProviderId) {
      erpIntegration = await ERPProvider.findByPk(subscription.erpProviderId);
    }

    if (erpIntegration && erpIntegration.status === 'active') {
      try {
        const provider = ERPProviderFactory.create(
          erpIntegration.providerType,
          erpIntegration.apiKey,
          erpIntegration.webhookSecret
        );

        // Cancelar fatura no ERP
        await provider.cancelInvoice(subscription.externalInvoiceId);

        logger.info(
          `Fatura cancelada no ERP: ${subscription.externalInvoiceId}`
        );
      } catch (error) {
        logger.warn(
          `Falha ao cancelar fatura no ERP: ${error}. Continuando com cancelamento local.`
        );
      }
    }

    // Cancelar assinatura localmente
    await subscription.update({
      status: 'canceled',
      canceledAt: new Date()
    });

    logger.info(
      `Assinatura cancelada: ${id} - Tenant ${tenantId} - Razão: ${reason || 'sem motivo'}`
    );

    return res.json({
      message: "Assinatura cancelada com sucesso",
      data: {
        id: subscription.id,
        status: subscription.status,
        canceledAt: subscription.canceledAt
      }
    });
  } catch (error) {
    logger.error(`Erro ao cancelar assinatura: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao cancelar assinatura"
    });
  }
};

/**
 * POST /api/subscriptions/:id/upgrade
 * Fazer upgrade/downgrade de plano (futuro)
 */
export const upgrade = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // TODO: Implementar upgrade de plano
    throw new AppError("Upgrade de plano ainda não implementado");
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao fazer upgrade"
    });
  }
};
