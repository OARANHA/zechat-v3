import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.query(
      `
      INSERT INTO public."Settings"(key, value, "createdAt", "updatedAt", "tenantId") VALUES
      ('userCreation', 'enabled', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 1),
      ('NotViewTicketsQueueUndefined', 'disabled', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 1),
      ('NotViewTicketsChatBot', 'enabled', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 1),
      ('DirectTicketsToWallets', 'disabled', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 1),
      ('NotViewAssignedTickets', 'disabled', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 1),
      ('botTicketActive', '3', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 1),
      ('ignoreGroupMsg', 'disabled', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 1)
      `
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Settings", {});
  }
};
