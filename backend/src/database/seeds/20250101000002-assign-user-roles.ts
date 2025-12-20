import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Obter o tenant padrão (ID 1)
    const tenantResult = await queryInterface.sequelize.query(
      `SELECT id FROM "Tenants" WHERE name = 'Tenant Padrão' OR name = 'Empresa Padrão' LIMIT 1`
    );
    
    const tenantId = (tenantResult[0] as any[])[0]?.id || 1;
    
    // Associar usuários aos papéis
    await queryInterface.sequelize.query(`
      INSERT INTO "UserRoles" (userId, roleId, tenantId, createdAt, updatedAt, isDefault) VALUES
      -- Super Admin (admin@superadmin.com) -> Super Admin
      ((SELECT id FROM "Users" WHERE email = 'admin@superadmin.com' LIMIT 1),
       (SELECT id FROM "Roles" WHERE name = 'Super Admin' AND tenantId = ${tenantId} LIMIT 1),
       ${tenantId}, NOW(), NOW(), true),
      -- Aranha (aranha.com@gmail.com) -> Super Admin  
      ((SELECT id FROM "Users" WHERE email = 'aranha.com@gmail.com' LIMIT 1),
       (SELECT id FROM "Roles" WHERE name = 'Super Admin' AND tenantId = ${tenantId} LIMIT 1),
       ${tenantId}, NOW(), NOW(), true),
      -- Administrador (admin@empresa-padrao.com) -> Admin
      ((SELECT id FROM "Users" WHERE email = 'admin@empresa-padrao.com' LIMIT 1),
       (SELECT id FROM "Roles" WHERE name = 'Admin' AND tenantId = ${tenantId} LIMIT 1),
       ${tenantId}, NOW(), NOW(), true),
      -- Usuário Teste (user@empresa-padrao.com) -> Agente
      ((SELECT id FROM "Users" WHERE email = 'user@empresa-padrao.com' LIMIT 1),
       (SELECT id FROM "Roles" WHERE name = 'Agente' AND tenantId = ${tenantId} LIMIT 1),
       ${tenantId}, NOW(), NOW(), true)
      ON CONFLICT (userId, roleId) DO NOTHING
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query('DELETE FROM "UserRoles"');
  }
};
