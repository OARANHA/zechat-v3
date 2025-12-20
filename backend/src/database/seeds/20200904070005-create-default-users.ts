import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.query(
      `
        INSERT INTO public."Users" ("name", email, "passwordHash", "createdAt", "updatedAt", profile, "tokenVersion", "tenantId", "isOnline", configs, "lastOnline", status) VALUES
	      ('Super Admin', 'admin@superadmin.com', '$2a$08$D9h7tBQkkxnXDBcIqC8iie6qBOHOxLmkNcNp6mLVmqHr8d8LC.Dfe', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 'super', 0, 1, false, '{}', '2021-03-10 17:28:29.000', 'active'),
	      ('Administrador', 'admin@empresa-padrao.com', '$2a$08$D9h7tBQkkxnXDBcIqC8iie6qBOHOxLmkNcNp6mLVmqHr8d8LC.Dfe', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 'admin', 0, 1, false, '{"filtrosAtendimento":{"searchParam":"","pageNumber":1,"status":["open","pending","closed"],"showAll":true,"count":null,"queuesIds":[],"withUnreadMessages":false,"isNotAssignedUser":false,"includeNotQueueDefined":true},"isDark":false}', '2021-03-10 17:28:29.000', 'active'),
	      ('Usuário Teste', 'user@empresa-padrao.com', '$2a$08$D9h7tBQkkxnXDBcIqC8iie6qBOHOxLmkNcNp6mLVmqHr8d8LC.Dfe', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 'user', 0, 1, false, '{}', '2021-03-10 17:28:29.000', 'active'),
	      ('Aranha', 'aranha.com@gmail.com', '$2a$08$Ml2R63eEePsK1M0tAuchFuoOqLDGknk0048l.vd3/9LYZU4RwRpkS', '2021-03-10 17:28:29.000', '2021-03-10 17:28:29.000', 'super', 0, 1, false, '{}', '2021-03-10 17:28:29.000', 'active')
        ON CONFLICT (email) DO NOTHING
      `
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.query(
      `DELETE FROM public."Users" WHERE email IN ('admin@superadmin.com', 'admin@empresa-padrao.com', 'user@empresa-padrao.com', 'aranha.com@gmail.com');`
    );
  }
};
