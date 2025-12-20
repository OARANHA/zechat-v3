import { Router } from "express";
import * as TenantController from "../controllers/TenantController";
import * as BusinessHoursController from "../controllers/BusinessHoursController";
import { requireSuperAdmin, requireAdmin } from "../middleware/rbac";

const routes = Router();

/**
 * TENANT ROUTES - SUPER ADMIN ONLY
 */

// Listar todos os tenants
routes.get("/", requireSuperAdmin, TenantController.listTenants);

// Obter detalhes de um tenant
routes.get("/:tenantId", requireSuperAdmin, TenantController.getTenant);

// Criar novo tenant
routes.post("/", requireSuperAdmin, TenantController.createTenant);

// Atualizar tenant
routes.patch("/:tenantId", requireSuperAdmin, TenantController.updateTenant);

// Deletar tenant (soft delete)
routes.delete("/:tenantId", requireSuperAdmin, TenantController.deleteTenant);

// Suspender tenant
routes.post("/:tenantId/suspend", requireSuperAdmin, TenantController.suspendTenant);

// Reativar tenant
routes.post("/:tenantId/reactivate", requireSuperAdmin, TenantController.reactivateTenant);

/**
 * BUSINESS HOURS ROUTES - ADMIN DO TENANT (ou SUPER)
 */

// Exibir horários de atendimento e mensagem
routes.get("/:tenantId/business-hours", requireAdmin, BusinessHoursController.showBusinessHours);

// Atualizar horários de atendimento
routes.put("/:tenantId/business-hours", requireAdmin, BusinessHoursController.updateBusinessHours);

// Atualizar mensagem de horário de atendimento
routes.put("/:tenantId/message-business-hours", requireAdmin, BusinessHoursController.updateMessageBusinessHours);

export default routes;
