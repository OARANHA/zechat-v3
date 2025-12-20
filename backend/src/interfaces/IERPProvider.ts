/**
 * Interface base para providers de ERP
 * Define contrato que todo ERP deve seguir
 */

export interface CreateInvoiceData {
  tenantId: number
  amount: number
  description: string
  webhookUrl: string
  recurring: boolean
  recurringInterval?: 'monthly' | 'yearly'
}

export interface InvoiceResponse {
  invoiceId: string
  status: 'pending' | 'paid' | 'failed'
  paymentUrl?: string
  externalId?: string
  createdAt: Date
}

export interface InvoiceStatus {
  invoiceId: string
  externalId?: string
  status: 'pending' | 'paid' | 'failed'
  paidAt?: Date
  amount: number | null
}

export interface CreateSaleData {
  tenantId: number
  externalSaleId: string
  items: {
    description: string
    quantity: number
    price: number
  }[]
  total: number
  customerPhone: string
  webhookUrl: string
}

export interface SaleResponse {
  saleId: string
  status: 'pending' | 'paid' | 'failed'
  paymentUrl?: string
  externalId?: string
  createdAt: Date
}

export interface SaleStatus {
  saleId: string
  externalId?: string
  status: 'pending' | 'paid' | 'failed'
  paidAt?: Date
  amount: number | null
}

export interface IERPProvider {
  name: string
  version: string
  apiKey: string
  webhookSecret: string

  // Cobrança de assinatura
  createInvoice(data: CreateInvoiceData): Promise<InvoiceResponse>
  getInvoiceStatus(invoiceId: string): Promise<InvoiceStatus>
  cancelInvoice(invoiceId: string): Promise<boolean>
  refund(invoiceId: string, amount?: number): Promise<boolean>

  // Vendas do cliente
  createSale(data: CreateSaleData): Promise<SaleResponse>
  getSaleStatus(saleId: string): Promise<SaleStatus>

  // Validação
  validateApiKey(): Promise<boolean>
  validateWebhookSecret(signature: string, payload: unknown): Promise<boolean>
}
