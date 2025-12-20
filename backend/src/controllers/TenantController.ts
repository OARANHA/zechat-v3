/**
 * TenantController
 * Gerenciar Tenants (empresas clientes) - SUPER ADMIN ONLY
 */

import { Request, Response } from "express";
import Tenant, { TenantStatus } from "../models/Tenant";
import User from "../models/User";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";

/**
 * Listar todos os Tenants (SUPER ADMIN)
 */
export const listTenants = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { status, search, limit = 10, offset = 0 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where[`$or`] = [
        { name: { $like: `%${search}%` } },
        { cnpj: { $like: `%${search}%` } },
        { email: { $like: `%${search}%` } }
      ];
    }

    const { count, rows } = await Tenant.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          as: "owner"
        }
      ],
      limit: parseInt(String(limit)),
      offset: parseInt(String(offset)),
      order: [["createdAt", "DESC"]]
    });

    return res.json({
      message: "Tenants listados com sucesso",
      data: rows,
      pagination: {
        total: count,
        limit: parseInt(String(limit)),
        offset: parseInt(String(offset))
      }
    });
  } catch (error) {
    logger.error(`Erro ao listar tenants: ${error}`);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao listar tenants"
    });
  }
};

/**
 * Obter detalhes de um Tenant
 */
export const getTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      throw new AppError("TenantId não fornecido");
    }

    const tenant = await Tenant.findByPk(parseInt(tenantId), {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "profile"],
          as: "owner"
        }
      ]
    });

    if (!tenant) {
      throw new AppError("Tenant não encontrado", 404);
    }

    return res.json({
      message: "Tenant encontrado",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao buscar tenant: ${error}`);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao buscar tenant"
    });
  }
};

/**
 * Criar novo Tenant
 */
export const createTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, cnpj, email, description, ownerId, maxUsers, maxConnections } = req.body;

    // Validar campos obrigatórios
    if (!name || !ownerId) {
      throw new AppError("Nome e ownerId são obrigatórios");
    }

    // Validar se o owner existe e é um Admin
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      throw new AppError("Owner (Admin) não encontrado", 404);
    }

    if (owner.profile !== "admin") {
      throw new AppError("Owner deve ser um Admin", 400);
    }

    // Verificar se já existe tenant com este owner
    const existingTenant = await Tenant.findOne({ where: { ownerId } });
    if (existingTenant) {
      throw new AppError("Este Admin já possui um Tenant associado", 400);
    }

    // Criar tenant
    const tenant = await Tenant.create({
      name,
      cnpj: cnpj || null,
      email: email || null,
      description: description || null,
      ownerId,
      maxUsers: maxUsers || 5,
      maxConnections: maxConnections || 1,
      status: "active"
    });

    // Associar owner ao tenant
    await owner.update({ tenantId: tenant.id });

    logger.info(`Tenant criado: ${tenant.id} - ${name}`);

    return res.status(201).json({
      message: "Tenant criado com sucesso",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao criar tenant: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao criar tenant"
    });
  }
};

/**
 * Atualizar Tenant
 */
export const updateTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;
    const { name, cnpj, email, description, status, maxUsers, maxConnections, trialEndsAt } = req.body;

    if (!tenantId) {
      throw new AppError("TenantId não fornecido");
    }

    const tenant = await Tenant.findByPk(parseInt(tenantId));
    if (!tenant) {
      throw new AppError("Tenant não encontrado", 404);
    }

    // Validar status se fornecido
    if (status) {
      const validStatuses: TenantStatus[] = ["active", "inactive", "suspended", "trial"];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Status inválido. Permitidos: ${validStatuses.join(", ")}`);
      }
    }

    // Atualizar campos
    const updateData: any = {};
    if (name) updateData.name = name;
    if (cnpj) updateData.cnpj = cnpj;
    if (email) updateData.email = email;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (maxUsers) updateData.max_users = maxUsers;
    if (maxConnections) updateData.max_connections = maxConnections;
    if (trialEndsAt) updateData.trialEndsAt = trialEndsAt;

    await tenant.update(updateData);

    logger.info(`Tenant atualizado: ${tenant.id}`);

    return res.json({
      message: "Tenant atualizado com sucesso",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao atualizar tenant: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao atualizar tenant"
    });
  }
};

/**
 * Deletar Tenant (soft delete via status)
 */
export const deleteTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      throw new AppError("TenantId não fornecido");
    }

    const tenant = await Tenant.findByPk(parseInt(tenantId));
    if (!tenant) {
      throw new AppError("Tenant não encontrado", 404);
    }

    // Soft delete: marcar como inativo
    await tenant.update({ status: "inactive" });

    logger.info(`Tenant deletado (soft): ${tenant.id}`);

    return res.json({
      message: "Tenant deletado com sucesso"
    });
  } catch (error) {
    logger.error(`Erro ao deletar tenant: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao deletar tenant"
    });
  }
};

/**
 * Suspender Tenant
 */
export const suspendTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;
    const { reason } = req.body;

    if (!tenantId) {
      throw new AppError("TenantId não fornecido");
    }

    const tenant = await Tenant.findByPk(parseInt(tenantId));
    if (!tenant) {
      throw new AppError("Tenant não encontrado", 404);
    }

    await tenant.update({
      status: "suspended",
      suspendedAt: new Date()
    });

    logger.info(`Tenant suspenso: ${tenant.id} - Motivo: ${reason}`);

    return res.json({
      message: "Tenant suspenso com sucesso",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao suspender tenant: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao suspender tenant"
    });
  }
};

/**
 * Reativar Tenant
 */
export const reactivateTenant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      throw new AppError("TenantId não fornecido");
    }

    const tenant = await Tenant.findByPk(parseInt(tenantId));
    if (!tenant) {
      throw new AppError("Tenant não encontrado", 404);
    }

    await tenant.update({
      status: "active",
      suspendedAt: null
    });

    logger.info(`Tenant reativado: ${tenant.id}`);

    return res.json({
      message: "Tenant reativado com sucesso",
      data: tenant
    });
  } catch (error) {
    logger.error(`Erro ao reativar tenant: ${error}`);
    return res.status(error.statusCode || 400).json({
      error: error.message || "Erro ao reativar tenant"
    });
  }
};
