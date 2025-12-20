import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Adicionar coluna tenantId
    await queryInterface.addColumn("Roles", "tenantId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Tenants", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    });

    // Adicionar índice
    await queryInterface.addIndex("Roles", ["tenantId"], {
      name: "roles_tenantId_index"
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex("Roles", "roles_tenantId_index");
    await queryInterface.removeColumn("Roles", "tenantId");
  }
};