/**
 * BusinessHoursController
 * Gerenciar horários de atendimento do tenant (ADMIN do tenant)
 */

import { Request, Response } from "express";
import ShowBusinessHoursAndMessageService from "../services/TenantServices/ShowBusinessHoursAndMessageService";
import UpdateBusinessHoursService from "../services/TenantServices/UpdateBusinessHoursService";
import UpdateMessageBusinessHoursService from "../services/TenantServices/UpdateMessageBusinessHoursService";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";

/**
 * Exibir horários de atendimento e mensagem
 */
export const showBusinessHours = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;
    
    // Verificar se o usuário tem permissão para acessar este tenant
    if (req.user.profile !== "super" && req.user.tenantId !== parseInt(tenantId)) {
      throw new AppError("Acesso negado a este tenant", 403);
    }

    const tenant = await ShowBusinessHoursAndMessageService({
      tenantId
    });

    console.log("Resultado do serviço ShowBusinessHoursAndMessageService:", JSON.stringify(tenant, null, 2));

    return res.json({
      message: "Horários de atendimento encontrados",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao buscar horários de atendimento: ${error}`);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao buscar horários de atendimento"
    });
  }
};

/**
 * Atualizar horários de atendimento
 */
export const updateBusinessHours = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;
    const { businessHours } = req.body;

    if (!businessHours || !Array.isArray(businessHours)) {
      throw new AppError("Horários de atendimento são obrigatórios e devem ser um array");
    }

    // Verificar se o usuário tem permissão para acessar este tenant
    if (req.user.profile !== "super" && req.user.tenantId !== parseInt(tenantId)) {
      throw new AppError("Acesso negado a este tenant", 403);
    }

    const tenant = await UpdateBusinessHoursService({
      businessHours,
      tenantId
    });

    logger.info(`Horários de atendimento atualizados para tenant ${tenantId}`);

    return res.json({
      message: "Horários de atendimento atualizados com sucesso",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao atualizar horários de atendimento: ${error}`);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao atualizar horários de atendimento"
    });
  }
};

/**
 * Atualizar mensagem de horário de atendimento
 */
export const updateMessageBusinessHours = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;
    const { messageBusinessHours } = req.body;

    if (!messageBusinessHours || typeof messageBusinessHours !== "string") {
      throw new AppError("Mensagem de horário de atendimento é obrigatória");
    }

    // Verificar se o usuário tem permissão para acessar este tenant
    if (req.user.profile !== "super" && req.user.tenantId !== parseInt(tenantId)) {
      throw new AppError("Acesso negado a este tenant", 403);
    }

    const tenant = await UpdateMessageBusinessHoursService({
      messageBusinessHours,
      tenantId
    });

    logger.info(`Mensagem de horário de atendimento atualizada para tenant ${tenantId}`);

    return res.json({
      message: "Mensagem de horário de atendimento atualizada com sucesso",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao atualizar mensagem de horário de atendimento: ${error}`);
    logger.error(`Detalhes do erro:`, {
      message: error.message,
      stack: error.stack,
      body: req.body,
      params: req.params
    });
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao atualizar mensagem de horário de atendimento"
    });
  }
};