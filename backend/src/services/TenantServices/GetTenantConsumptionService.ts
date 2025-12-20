import { Op } from "sequelize";
import Tenant from "../../models/Tenant";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import Message from "../../models/Message";
import AppError from "../../errors/AppError";
import { logger } from "../../utils/logger";

export interface ConsumptionResponse {
  tenantId: number;
  tenantName: string;
  plan: {
    maxUsers: number;
    maxConnections: number;
    maxMessagesPerMonth: number;
    maxStorageGB: number;
  };
  consumption: {
    users: {
      current: number;
      max: number;
      percentage: number;
      status: "ok" | "warning" | "critical";
    };
    connections: {
      current: number;
      max: number;
      percentage: number;
      status: "ok" | "warning" | "critical";
    };
    messages: {
      current: number;
      max: number;
      percentage: number;
      status: "ok" | "warning" | "critical";
    };
    storage: {
      current: number;
      max: number;
      percentage: number;
      status: "ok" | "warning" | "critical";
    };
  };
  alerts: string[];
  nextRenewalDate?: Date;
}

const GetTenantConsumptionService = async (
  tenantId: number
): Promise<ConsumptionResponse> => {
  try {
    // Buscar tenant
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      throw new AppError("Tenant não encontrado", 404);
    }

    // Contar usuários ativos
    const userCount = await User.count({
      where: {
        tenantId,
        status: "active"
      }
    });

    // Contar canais WhatsApp/Telegram/Instagram conectados
    const connectionCount = await Whatsapp.count({
      where: {
        tenantId,
        isActive: true,
        isDeleted: false
      }
    });

    // Contar mensagens do mês atual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const messageCount = await Message.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth,
          [Op.lte]: lastDayOfMonth
        }
      }
    });

    // Calculo de storage (simulado por enquanto)
    // TODO: Implementar cálculo real de storage baseado em media
    const storageUsedGB = 0.5;

    // Limites do tenant (baseado no modelo)
    const maxUsers = tenant.maxUsers || 10;
    const maxConnections = tenant.maxConnections || 5;
    const maxMessagesPerMonth = 10000; // Padrão
    const maxStorageGB = 2; // Padrão

    // Calcular percentuais
    const userPercentage = Math.round((userCount / maxUsers) * 100);
    const connectionPercentage = Math.round(
      (connectionCount / maxConnections) * 100
    );
    const messagePercentage = Math.round(
      (messageCount / maxMessagesPerMonth) * 100
    );
    const storagePercentage = Math.round((storageUsedGB / maxStorageGB) * 100);

    // Função auxiliar para determinar status
    const getStatus = (
      percentage: number
    ): "ok" | "warning" | "critical" => {
      if (percentage >= 100) return "critical";
      if (percentage >= 80) return "warning";
      return "ok";
    };

    // Gerar alertas
    const alerts: string[] = [];

    if (userPercentage >= 80) {
      alerts.push(
        `Você está usando ${userPercentage}% da quota de usuários`
      );
    }

    if (connectionPercentage >= 80) {
      alerts.push(
        `Você está usando ${connectionPercentage}% da quota de canais`
      );
    }

    if (messagePercentage >= 80) {
      alerts.push(
        `Você está usando ${messagePercentage}% da quota de mensagens`
      );
    }

    if (storagePercentage >= 80) {
      alerts.push(
        `Você está usando ${storagePercentage}% do espaço de armazenamento`
      );
    }

    if (userPercentage >= 100) {
      alerts.push("⚠️ LIMITE DE USUÁRIOS ATINGIDO!");
    }

    if (connectionPercentage >= 100) {
      alerts.push("⚠️ LIMITE DE CANAIS ATINGIDO!");
    }

    if (messagePercentage >= 100) {
      alerts.push("⚠️ LIMITE DE MENSAGENS ATINGIDO!");
    }

    if (storagePercentage >= 100) {
      alerts.push("⚠️ LIMITE DE ARMAZENAMENTO ATINGIDO!");
    }

    return {
      tenantId,
      tenantName: tenant.name,
      plan: {
        maxUsers,
        maxConnections,
        maxMessagesPerMonth,
        maxStorageGB
      },
      consumption: {
        users: {
          current: userCount,
          max: maxUsers,
          percentage: userPercentage,
          status: getStatus(userPercentage)
        },
        connections: {
          current: connectionCount,
          max: maxConnections,
          percentage: connectionPercentage,
          status: getStatus(connectionPercentage)
        },
        messages: {
          current: messageCount,
          max: maxMessagesPerMonth,
          percentage: messagePercentage,
          status: getStatus(messagePercentage)
        },
        storage: {
          current: storageUsedGB,
          max: maxStorageGB,
          percentage: storagePercentage,
          status: getStatus(storagePercentage)
        }
      },
      alerts
    };
  } catch (error) {
    logger.error(`Erro ao obter consumo do tenant: ${error}`);
    throw error;
  }
};

export default GetTenantConsumptionService;
