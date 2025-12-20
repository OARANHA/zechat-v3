/**
 * Rotas para gerenciar integrações ERP
 * Prefixo: /api/integrations/erp
 */

import { Router } from "express";
import * as ERPIntegrationController from "../controllers/ERPIntegrationController";
import isAuth from "../middleware/isAuth";

const erpIntegrationRoutes = Router();

/**
 * POST /api/integrations/erp/configure
 * Configurar uma integração ERP (criar ou atualizar)
 * Body: { providerType, apiKey, webhookSecret, webhookUrl }
 */
erpIntegrationRoutes.post(
  "/configure",
  isAuth,
  ERPIntegrationController.configureIntegration
);

/**
 * GET /api/integrations/erp
 * Buscar integração ERP do tenant
 */
erpIntegrationRoutes.get(
  "/",
  isAuth,
  ERPIntegrationController.getIntegration
);

/**
 * POST /api/integrations/erp/test
 * Testar conexão com ERP
 */
erpIntegrationRoutes.post(
  "/test",
  isAuth,
  ERPIntegrationController.testIntegration
);

/**
 * POST /api/integrations/erp/disable
 * Desativar integração ERP
 */
erpIntegrationRoutes.post(
  "/disable",
  isAuth,
  ERPIntegrationController.disableIntegration
);

export default erpIntegrationRoutes;
