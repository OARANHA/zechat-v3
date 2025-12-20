/**
 * VendaERP Provider Implementation
 * Integração com API do VENDAERP para cobrança e sincronização
 */

import axios, { AxiosInstance } from "axios";
import crypto from "crypto";
import {
  IERPProvider,
  CreateInvoiceData,
  InvoiceResponse,
  InvoiceStatus,
  CreateSaleData,
  SaleResponse,
  SaleStatus
} from "../interfaces/IERPProvider";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";

class VendaERPProvider implements IERPProvider {
  name = "VENDAERP";
  version = "1.0";
  apiKey: string;
  webhookSecret: string;
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor(apiKey: string, webhookSecret: string) {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
    this.baseURL = process.env.VENDAERP_API_URL || "https://api.vendaerp.com";
    
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 10000
    });
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await this.apiClient.get("/v1/auth/validate");
      return response.status === 200;
    } catch (error) {
      logger.error(`VENDAERP: Validação de API key falhou: ${error}`);
      return false;
    }
  }

  async validateWebhookSecret(signature: string, payload: unknown): Promise<boolean> {
    try {
      // Validar webhook secret usando HMAC-SHA256
      // Implementação: validar signature do payload contra este webhook secret
      const payloadString = JSON.stringify(payload);
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payloadString)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      logger.error(`VENDAERP: Erro ao validar webhook secret: ${error}`);
      return false;
    }
  }

  /**
   * Criar fatura de assinatura no VENDAERP
   * Pode ser recorrente (mensal/anual) ou única
   */
  async createInvoice(data: CreateInvoiceData): Promise<InvoiceResponse> {
    try {
      const payload = {
        cliente_id: data.tenantId,
        valor: data.amount,
        descricao: data.description,
        webhook_url: data.webhookUrl,
        recorrencia: data.recurring ? 
          (data.recurringInterval === 'yearly' ? 'anual' : 'mensal') : 
          'unica',
        status: 'pendente'
      };

      const response = await this.apiClient.post("/v1/invoices/create", payload);
      
      const invoice = response.data;

      return {
        invoiceId: invoice.id,
        status: invoice.status === 'pago' ? 'paid' : 'pending',
        paymentUrl: invoice.payment_link || undefined,
        externalId: invoice.id,
        createdAt: new Date(invoice.created_at)
      };
    } catch (error) {
      logger.error(`VENDAERP: Erro ao criar fatura: ${error}`);
      throw new AppError(
        `Falha ao criar fatura no VENDAERP: ${error?.response?.data?.message || error}`
      );
    }
  }

  /**
   * Consultar status de fatura no VENDAERP
   */
  async getInvoiceStatus(invoiceId: string): Promise<InvoiceStatus> {
    try {
      const response = await this.apiClient.get(`/v1/invoices/${invoiceId}`);
      const invoice = response.data;

      return {
        invoiceId: invoice.id,
        externalId: invoice.id,
        status: invoice.status === 'pago' ? 'paid' : 
                invoice.status === 'falho' ? 'failed' : 'pending',
        paidAt: invoice.paid_at ? new Date(invoice.paid_at) : undefined,
        amount: parseFloat(invoice.valor)
      };
    } catch (error) {
      logger.error(`VENDAERP: Erro ao consultar status: ${error}`);
      throw new AppError(
        `Falha ao consultar status no VENDAERP: ${error?.response?.data?.message || error}`
      );
    }
  }

  /**
   * Cancelar fatura no VENDAERP
   */
  async cancelInvoice(invoiceId: string): Promise<boolean> {
    try {
      await this.apiClient.post(`/v1/invoices/${invoiceId}/cancel`);
      return true;
    } catch (error) {
      logger.error(`VENDAERP: Erro ao cancelar fatura: ${error}`);
      throw new AppError(
        `Falha ao cancelar fatura no VENDAERP: ${error?.response?.data?.message || error}`
      );
    }
  }

  /**
   * Reembolsar valor (total ou parcial)
   */
  async refund(invoiceId: string, amount?: number): Promise<boolean> {
    try {
      const payload = amount ? { valor: amount } : {};
      await this.apiClient.post(`/v1/invoices/${invoiceId}/refund`, payload);
      return true;
    } catch (error) {
      logger.error(`VENDAERP: Erro ao reembolsar: ${error}`);
      throw new AppError(
        `Falha ao reembolsar no VENDAERP: ${error?.response?.data?.message || error}`
      );
    }
  }

  /**
   * Criar venda (para sincronização com ERP do tenant)
   */
  async createSale(data: CreateSaleData): Promise<SaleResponse> {
    try {
      const payload = {
        cliente_id: data.tenantId,
        ecommerce_sale_id: data.externalSaleId,
        itens: data.items.map(item => ({
          descricao: item.description,
          quantidade: item.quantity,
          preco: item.price
        })),
        total: data.total,
        webhook_url: data.webhookUrl,
        celular_cliente: data.customerPhone
      };

      const response = await this.apiClient.post("/v1/sales/create", payload);
      const sale = response.data;

      return {
        saleId: sale.id,
        status: sale.status === 'pago' ? 'paid' : 'pending',
        paymentUrl: sale.payment_link || undefined,
        externalId: sale.id,
        createdAt: new Date(sale.created_at)
      };
    } catch (error) {
      logger.error(`VENDAERP: Erro ao criar venda: ${error}`);
      throw new AppError(
        `Falha ao criar venda no VENDAERP: ${error?.response?.data?.message || error}`
      );
    }
  }

  /**
   * Consultar status de venda
   */
  async getSaleStatus(saleId: string): Promise<SaleStatus> {
    try {
      const response = await this.apiClient.get(`/v1/sales/${saleId}`);
      const sale = response.data;

      return {
        saleId: sale.id,
        externalId: sale.id,
        status: sale.status === 'pago' ? 'paid' : 
                sale.status === 'falho' ? 'failed' : 'pending',
        paidAt: sale.paid_at ? new Date(sale.paid_at) : undefined,
        amount: parseFloat(sale.total)
      };
    } catch (error) {
      logger.error(`VENDAERP: Erro ao consultar venda: ${error}`);
      throw new AppError(
        `Falha ao consultar venda no VENDAERP: ${error?.response?.data?.message || error}`
      );
    }
  }
}

export default VendaERPProvider;
