/**
 * Rotas para gerenciar assinaturas SaaS
 * Prefixo: /api/subscriptions
 */

import { Router } from "express";
import * as SubscriptionController from "../controllers/SubscriptionController";
import isAuth from "../middleware/isAuth";

const subscriptionRoutes = Router();

/**
 * POST /api/subscriptions
 * Criar uma nova assinatura (contratar plano)
 * Body: { planId }
 */
subscriptionRoutes.post(
  "/",
  isAuth,
  SubscriptionController.create
);

/**
 * GET /api/subscriptions
 * Listar todas as assinaturas do tenant
 */
subscriptionRoutes.get(
  "/",
  isAuth,
  SubscriptionController.list
);

/**
 * GET /api/subscriptions/:id
 * Obter detalhes de uma assinatura específica
 */
subscriptionRoutes.get(
  "/:id",
  isAuth,
  SubscriptionController.show
);

/**
 * POST /api/subscriptions/:id/cancel
 * Cancelar uma assinatura
 * Body: { reason?: string }
 */
subscriptionRoutes.post(
  "/:id/cancel",
  isAuth,
  SubscriptionController.cancel
);

/**
 * POST /api/subscriptions/:id/upgrade
 * Fazer upgrade/downgrade de plano (futuro)
 * Body: { newPlanId }
 */
subscriptionRoutes.post(
  "/:id/upgrade",
  isAuth,
  SubscriptionController.upgrade
);

export default subscriptionRoutes;
