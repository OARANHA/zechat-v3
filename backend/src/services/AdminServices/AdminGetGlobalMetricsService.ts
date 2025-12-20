import { Op } from "sequelize";
import Tenant from "../../models/Tenant";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import { logger } from "../../utils/logger";

export interface GlobalMetricsResponse {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalConnections: number;
  totalMessages: {
    thisMonth: number;
    allTime: number;
  };
  totalTickets: {
    open: number;
    closed: number;
    total: number;
  };
  estimatedRevenue: {
    monthly: number;
    estimatedYearly: number;
  };
  tenantsByStatus: {
    active: number;
    inactive: number;
  };
  metrics: {
    avgUsersPerTenant: number;
    avgConnectionsPerTenant: number;
    avgMessagesPerTenant: number;
  };
}

const AdminGetGlobalMetricsService =
  async (): Promise<GlobalMetricsResponse> => {
    try {
      // Total de tenants
      const totalTenants = await Tenant.count();
      const activeTenants = await Tenant.count({
        where: { status: "active" }
      });
      const inactiveTenants = totalTenants - activeTenants;

      // Total de usuários
      const totalUsers = await User.count({
        where: { status: "active" }
      });

      // Total de conexões
      const totalConnections = await Whatsapp.count({
        where: {
          isActive: true,
          isDeleted: false
        }
      });

      // Mensagens deste mês
      const now = new Date();
      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      );

      const messagesThisMonth = await Message.count({
        where: {
          createdAt: {
            [Op.gte]: firstDayOfMonth,
            [Op.lte]: lastDayOfMonth
          }
        }
      });

      // Total de mensagens (all time)
      const messagesAllTime = await Message.count();

      // Total de tickets
      const totalTickets = await Ticket.count();
      const openTickets = await Ticket.count({
        where: { status: ["open", "pending"] }
      });
      const closedTickets = await Ticket.count({
        where: { status: "closed" }
      });

      // Cálculos de receita estimada (baseado em plano médio de R$199/mês)
      const estimatedMonthlyRevenue = activeTenants * 199;
      const estimatedYearlyRevenue = estimatedMonthlyRevenue * 12;

      // Métricas médias
      const avgUsersPerTenant =
        activeTenants > 0 ? Math.round(totalUsers / activeTenants) : 0;
      const avgConnectionsPerTenant =
        activeTenants > 0 ? Math.round(totalConnections / activeTenants) : 0;
      const avgMessagesPerTenant =
        activeTenants > 0 ? Math.round(messagesThisMonth / activeTenants) : 0;

      return {
        totalTenants,
        activeTenants,
        totalUsers,
        totalConnections,
        totalMessages: {
          thisMonth: messagesThisMonth,
          allTime: messagesAllTime
        },
        totalTickets: {
          open: openTickets,
          closed: closedTickets,
          total: totalTickets
        },
        estimatedRevenue: {
          monthly: estimatedMonthlyRevenue,
          estimatedYearly: estimatedYearlyRevenue
        },
        tenantsByStatus: {
          active: activeTenants,
          inactive: inactiveTenants
        },
        metrics: {
          avgUsersPerTenant,
          avgConnectionsPerTenant,
          avgMessagesPerTenant
        }
      };
    } catch (error) {
      logger.error(`Erro ao obter métricas globais: ${error}`);
      throw error;
    }
  };

export default AdminGetGlobalMetricsService;

