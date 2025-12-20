import { QueryTypes } from "sequelize";
import AppError from "../../errors/AppError";
import sequelize from "../../database";

interface Request {
  messageBusinessHours: string;
  tenantId: number | string;
}

const UpdateMessageBusinessHoursService = async ({
  messageBusinessHours,
  tenantId
}: Request): Promise<any> => {
  // Use raw sequelize query to update the message business hours
  await (sequelize as any).query(
    `UPDATE "Tenants" SET "messageBusinessHours" = :messageBusinessHours WHERE id = :tenantId`,
    {
      replacements: { messageBusinessHours, tenantId },
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

export default UpdateMessageBusinessHoursService;
