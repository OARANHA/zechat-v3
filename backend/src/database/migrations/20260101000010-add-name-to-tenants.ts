// backend/src/migrations/20260101000010-add-name-to-tenants.ts

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Verifica se coluna já existe antes de adicionar (idempotente)
    const table = await queryInterface.describeTable("Tenants");
    
    if (!(table as any).name) {
      await queryInterface.addColumn("Tenants", "name", {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Empresa Padrão"
      });
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const table = await queryInterface.describeTable("Tenants");
    
    if ((table as any).name) {
      await queryInterface.removeColumn("Tenants", "name");
    }
  }
};
