import express from "express";
import isAuth from "../middleware/isAuth";

import * as StatisticsController from "../controllers/StatisticsController";
import * as StatisticsPerUsersController from "../controllers/Statistics/StatisticsPerUsersController";
import * as DashController from "../controllers/Statistics/DashController";

const statisticsRoutes = express.Router();

/**
 * Rotas de estatísticas.
 *
 * IMPORTANTE:
 * - O prefixo completo vem de routes/index.ts:
 *     routes.use('/api/statistics', statisticsRoutes)
 *
 * - Caminhos finais expostos pela API:
 *     GET /api/statistics/dash-tickets-queues
 *     GET /api/statistics/contacts-report
 *     GET /api/statistics/statistics-per-users
 *     GET /api/statistics/statistics-tickets-times
 *     GET /api/statistics/statistics-tickets-channels
 *     GET /api/statistics/statistics-tickets-evolution-channels
 *     GET /api/statistics/statistics-tickets-evolution-by-period
 *     GET /api/statistics/statistics-tickets-per-users-detail
 *     GET /api/statistics/statistics-tickets-queue
 */

statisticsRoutes.get(
  "/dash-tickets-queues",
  isAuth,
  StatisticsController.DashTicketsQueues
);

statisticsRoutes.get(
  "/contacts-report",
  isAuth,
  StatisticsController.ContactsReport
);

statisticsRoutes.get(
  "/statistics-per-users",
  isAuth,
  StatisticsPerUsersController.index
);

statisticsRoutes.get(
  "/statistics-tickets-times",
  isAuth,
  DashController.getDashTicketsAndTimes
);

statisticsRoutes.get(
  "/statistics-tickets-channels",
  isAuth,
  DashController.getDashTicketsChannels
);

statisticsRoutes.get(
  "/statistics-tickets-evolution-channels",
  isAuth,
  DashController.getDashTicketsEvolutionChannels
);

statisticsRoutes.get(
  "/statistics-tickets-evolution-by-period",
  isAuth,
  DashController.getDashTicketsEvolutionByPeriod
);

statisticsRoutes.get(
  "/statistics-tickets-per-users-detail",
  isAuth,
  DashController.getDashTicketsPerUsersDetail
);

statisticsRoutes.get(
  "/statistics-tickets-queue",
  isAuth,
  DashController.getDashTicketsQueue
);

export default statisticsRoutes;
