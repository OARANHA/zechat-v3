/**
 * Rotas para webhooks do ERP
 * Prefixo: /webhook/erp
 */

import { Router } from "express";
import * as ERPWebhookController from "../controllers/ERPWebhookController";

const erpWebhookRoutes = Router();

/**
 * POST /webhook/erp/payment
 * Receber eventos de pagamento do ERP
 * Headers: x-provider-id (ID da integração), x-webhook-signature (HMAC-SHA256)
 * Body: { eventType, invoiceId, status, amount, ... }
 */
erpWebhookRoutes.post(
  "/payment",
  ERPWebhookController.handleERPWebhook
);

/**
 * POST /webhook/erp/event
 * Endpoint genérico para qualquer evento do ERP
 */
erpWebhookRoutes.post(
  "/event",
  ERPWebhookController.handleERPWebhook
);

export default erpWebhookRoutes;
