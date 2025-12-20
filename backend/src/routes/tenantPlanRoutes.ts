import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as TenantPlanController from "../controllers/TenantPlanController";

const tenantPlanRoutes = Router();

tenantPlanRoutes.get(
  "/consumption",
  isAuth,
  TenantPlanController.getTenantConsumption
);

tenantPlanRoutes.get(
  "/info",
  isAuth,
  TenantPlanController.getTenantPlanInfo
);

export default tenantPlanRoutes;
