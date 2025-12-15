import express from "express";
import isAuth from "../middleware/isAuth";
import * as TenantController from "../controllers/TenantController";

const tenantRoutes = express.Router();

// tenantRoutes.post("/tenants", isAuth, TenantController.store);
tenantRoutes.get(
  "/business-hours/",
  isAuth,
  TenantController.showBusinessHoursAndMessage
);
tenantRoutes.put(
  "/business-hours/",
  isAuth,
  TenantController.updateBusinessHours
);
tenantRoutes.put(
  "/message-business-hours/",
  isAuth,
  TenantController.updateMessageBusinessHours
);
// tenantRoutes.delete("/tenants/:tagId", isAuth, TenantController.remove);

export default tenantRoutes;
