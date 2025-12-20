import { Request, Response } from "express";
import GetTenantConsumptionService from "../services/TenantServices/GetTenantConsumptionService";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";

export const getTenantConsumption = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tenantId = req.user?.tenantId as number;

    if (!tenantId) {
      throw new AppError("Tenant ID não encontrado", 400);
    }

    const consumption = await GetTenantConsumptionService(tenantId);

    return res.status(200).json(consumption);
  } catch (error) {
    logger.error(`Erro ao obter consumo do plano: ${error}`);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getTenantPlanInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tenantId = req.user?.tenantId as number;

    if (!tenantId) {
      throw new AppError("Tenant ID não encontrado", 400);
    }

    // TODO: Implementar busca de plano real (quando integrar com TenantPlan model)
    const planInfo = {
      planName: "Professional",
      price: 199.0,
      billingCycle: "monthly",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "active",
      autoRenew: true
    };

    return res.status(200).json(planInfo);
  } catch (error) {
    logger.error(`Erro ao obter informações do plano: ${error}`);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
