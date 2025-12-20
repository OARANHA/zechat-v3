import { QueryTypes } from "sequelize";
import AppError from "../../errors/AppError";
import sequelize from "../../database";

interface Day {
  day: string | number;
  label: string;
  type: string;
  hr1: string;
  hr2: string;
  hr3: string;
  hr4: string;
}

interface Request {
  businessHours: Day[];
  tenantId: number | string;
}

const UpdateBusinessHoursService = async ({
  businessHours,
  tenantId
}: Request): Promise<any> => {
  // Use raw sequelize query to update the business hours
  await (sequelize as any).query(
    `UPDATE "Tenants" SET "businessHours" = :businessHours WHERE id = :tenantId`,
    {
      replacements: { businessHours, tenantId },
      type: QueryTypes.UPDATE
    }
  );

  // Use raw sequelize query to get the updated tenant
  const [tenant]: any[] = await (sequelize as any).query(
    `SELECT "businessHours", "messageBusinessHours" FROM "Tenants" WHERE id = :tenantId`,
    {
      replacements: { tenantId },
      type: QueryTypes.SELECT
    }
  );

  if (!tenant || tenant.length === 0) {
    throw new AppError("ERR_NO_TENANT_FOUND", 404);
  }

  return tenant[0];
};

export default UpdateBusinessHoursService;
