/**
 * Service para criar e gerenciar assinaturas
 * Integra com o provider ERP configurado
 */

import { logger } from "../../utils/logger";
import AppError from "../../errors/AppError";
import Subscription from "../../models/Subscription";
import ERPProvider from "../../models/ERPProvider";
import Plan from "../../models/Plan";
import { ERPProviderFactory } from "../../providers/ERPProviderFactory";
import { CreateInvoiceData } from "../../interfaces/IERPProvider";

interface CreateSubscriptionData {
  tenantId: number;
  planId: number;
  webhookUrl: string;
}

class CreateSubscriptionService {
  async execute({
    tenantId,
    planId,
    webhookUrl
  }: CreateSubscriptionData): Promise<Subscription> {
    try {
      // 1. Buscar plano
      const plan = await Plan.findByPk(planId);
      if (!plan) {
        throw new AppError("Plano não encontrado");
      }

      // 2. Buscar integração ERP do tenant
      const erpIntegration = await ERPProvider.findOne({
        where: { tenantId, status: 'active' }
      });

      if (!erpIntegration) {
        throw new AppError(
          "Nenhuma integração ERP ativa encontrada. Configure uma integração antes de contratar um plano."
        );
      }

      // 3. Instanciar provider e criar fatura
      const provider = ERPProviderFactory.create(
        erpIntegration.providerType,
        erpIntegration.apiKey,
        erpIntegration.webhookSecret
      );

      const invoiceData: CreateInvoiceData = {
        tenantId,
        amount: plan.price,
        description: `Assinatura SaaS - Plano ${plan.name}`,
        webhookUrl,
        recurring: true,
        recurringInterval: 'monthly'
      };

      const invoiceResponse = await provider.createInvoice(invoiceData);

      // 4. Calcular períodos
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

      // 5. Verificar se já existe assinatura
      const existingSubscription = await Subscription.findOne({
        where: { tenantId, planId }
      });

      let subscription: Subscription;

      if (existingSubscription) {
        // Atualizar assinatura existente
        await existingSubscription.update({
          erpProviderId: erpIntegration.id,
          externalInvoiceId: invoiceResponse.externalId,
          status: invoiceResponse.status,
          amount: plan.price,
          currentPeriodStart,
          currentPeriodEnd,
          paidAt: invoiceResponse.status === 'paid' ? new Date() : null
        });
        subscription = existingSubscription;
      } else {
        // Criar nova assinatura
        subscription = await Subscription.create({
          tenantId,
          planId,
          erpProviderId: erpIntegration.id,
          externalInvoiceId: invoiceResponse.externalId,
          status: invoiceResponse.status,
          amount: plan.price,
          currentPeriodStart,
          currentPeriodEnd,
          autoRenew: true,
          paidAt: invoiceResponse.status === 'paid' ? new Date() : null
        });
      }

      logger.info(
        `Assinatura criada para Tenant ${tenantId} - Plano ${plan.name} via ${erpIntegration.providerType}`
      );

      return subscription;
    } catch (error) {
      logger.error(`Erro ao criar assinatura: ${error}`);
      throw error;
    }
  }
}

export default new CreateSubscriptionService();
