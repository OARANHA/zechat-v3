import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    // Esta coluna já foi criada na migration 20201220234957-create-table-tenant.ts
    // Esta é uma migration duplicada - apenas ignorar
    return Promise.resolve();
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.resolve();
  }
};
