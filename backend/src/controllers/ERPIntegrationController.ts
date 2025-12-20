/**
 * Controller para gerenciar integrações ERP
 * Endpoints: configurar, ativar, desativar, validar
 */

import { Request, Response } from "express";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";
import ERPProvider from "../models/ERPProvider";
import { ERPProviderFactory } from "../providers/ERPProviderFactory";

export const configureIntegration = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { providerType, apiKey, webhookSecret, webhookUrl } = req.body;

    // Validações
    if (!providerType || !apiKey || !webhookSecret || !webhookUrl) {
      throw new AppError("Campos obrigatórios: providerType, apiKey, webhookSecret, webhookUrl");
    }

    const tenantId = req.user.tenantId || 1; // Default para super admin
    if (!tenantId) {
      throw new AppError("TenantId não encontrado", 400);
    }

    // Tentar validar o provider
    const provider = ERPProviderFactory.create(providerType, apiKey, webhookSecret);
    const isValid = await provider.validateApiKey();

    if (!isValid) {
      throw new AppError("API Key inválida ou não autorizada");
    }

    // Verificar se já existe integração para este tenant
    const existingIntegration = await ERPProvider.findOne({
      where: { tenantId }
    });

    let integration: ERPProvider;

    if (existingIntegration) {
      // Atualizar integração existente
      await existingIntegration.update({
        providerType,
        apiKey,
        webhookSecret,
        webhookUrl,
        status: 'active',
        errorMessage: null
      });
      integration = existingIntegration;
    } else {
      // Criar nova integração
      integration = await ERPProvider.create({
        tenantId,
        providerType,
        apiKey,
        webhookSecret,
        webhookUrl,
        status: 'active'
      });
    }

    logger.info(`Integração ERP configurada para Tenant ${tenantId}: ${providerType}`);

    return res.json({
      id: integration.id,
      providerType: integration.providerType,
      status: integration.status,
      webhookUrl: integration.webhookUrl
    });
  } catch (error) {
    logger.error(`Erro ao configurar integração ERP: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao configurar integração"
    });
  }
};

export const getIntegration = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tenantId = req.user.tenantId || 1; // Default para super admin
    if (!tenantId) {
      throw new AppError("TenantId não encontrado", 400);
    }

    logger.info(`Buscando integração para tenantId: ${tenantId}`);

    const integration = await ERPProvider.findOne({
      where: { tenantId }
    });

    if (!integration) {
      return res.status(404).json({
        message: "Nenhuma integração ERP configurada"
      });
    }

    return res.json({
      id: integration.id,
      providerType: integration.providerType,
      status: integration.status,
      webhookUrl: integration.webhookUrl,
      lastSync: integration.lastSync,
      createdAt: integration.createdAt
    });
  } catch (error) {
    logger.error(`Erro ao buscar integração ERP: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao buscar integração"
    });
  }
};

export const testIntegration = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new AppError("TenantId não encontrado");
    }

    const integration = await ERPProvider.findOne({
      where: { tenantId, status: 'active' }
    });

    if (!integration) {
      throw new AppError("Nenhuma integração ERP ativa encontrada");
    }

    const provider = ERPProviderFactory.create(
      integration.providerType,
      integration.apiKey,
      integration.webhookSecret
    );

    const isValid = await provider.validateApiKey();

    if (isValid) {
      // Atualizar lastSync
      await integration.update({ lastSync: new Date() });

      return res.json({
        message: "Conexão com ERP validada com sucesso",
        data: {
          providerType: integration.providerType,
          status: "connected"
        }
      });
    } else {
      throw new AppError("Falha ao validar conexão com ERP");
    }
  } catch (error) {
    logger.error(`Erro ao testar integração ERP: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao testar integração"
    });
  }
};

export const disableIntegration = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new AppError("TenantId não encontrado");
    }

    const integration = await ERPProvider.findOne({
      where: { tenantId }
    });

    if (!integration) {
      throw new AppError("Nenhuma integração ERP encontrada");
    }

    await integration.update({ status: 'inactive' });

    logger.info(`Integração ERP desativada para Tenant ${tenantId}`);

    return res.json({
      message: "Integração ERP desativada com sucesso"
    });
  } catch (error) {
    logger.error(`Erro ao desativar integração ERP: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao desativar integração"
    });
  }
};
