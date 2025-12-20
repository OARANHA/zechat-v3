import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    // Coluna name já existe em Whatsapps - migration duplicada
    return Promise.resolve();
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.resolve();
  }
};
