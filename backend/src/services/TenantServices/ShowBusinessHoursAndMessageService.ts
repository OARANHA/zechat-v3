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

  // Normaliza para sempre retornar 7 dias (Dom → Sáb)
  const defaultDays = [
    { day: 0, label: 'Domingo' },
    { day: 1, label: 'Segunda-Feira' },
    { day: 2, label: 'Terça-Feira' },
    { day: 3, label: 'Quarta-Feira' },
    { day: 4, label: 'Quinta-Feira' },
    { day: 5, label: 'Sexta-Feira' },
    { day: 6, label: 'Sábado' }
  ];

  let businessHours: any[] = Array.isArray((tenant as any)?.businessHours)
    ? (tenant as any).businessHours
    : [];
  const byDay = Object.fromEntries(businessHours.map((d: any) => [Number(d.day), d]));
  const normalized = defaultDays.map(d => {
    const existing = byDay[d.day];
    return {
      day: d.day,
      label: d.label,
      type: existing?.type || 'O',
      hr1: existing?.hr1 || '08:00',
      hr2: existing?.hr2 || '12:00',
      hr3: existing?.hr3 || '14:00',
      hr4: existing?.hr4 || '18:00'
    }
  });

  return { businessHours: normalized, messageBusinessHours: (tenant as any)?.messageBusinessHours || '' };
};

export default ShowBusinessHoursAndMessageService;
