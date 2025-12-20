import { QueryTypes } from "sequelize";
import AppError from "../../errors/AppError";

// Import the database instance
import sequelize from "../../database";

interface Request {
  tenantId: string | number;
}

const ShowBusinessHoursAndMessageService = async ({
  tenantId
}: Request): Promise<any> => {
  // Use raw sequelize query to get the tenant with specific attributes
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

  console.log('🔍 DEBUG: Dados do tenant:', tenant);

  // A query SELECT retorna um array de objetos, mas como estamos usando QueryTypes.SELECT
  // e esperamos apenas um resultado, o Sequelize já retorna o objeto diretamente
  return tenant;
};

export default ShowBusinessHoursAndMessageService;
