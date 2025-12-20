const { Sequelize } = require('sequelize');

// Configuração do Sequelize para conectar ao PostgreSQL
const sequelize = new Sequelize('chatex', 'chatex', 'chatex', {
  host: '28web-postgres',
  port: 5432,
  dialect: 'postgres'
});

async function checkUsers() {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso!');
    
    // Primeiro verificar a estrutura da tabela
    const [tableInfo, metadata] = await sequelize.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Users'
      ORDER BY ordinal_position
    `);
    
    console.log('Estrutura da tabela Users:');
    console.table(tableInfo);
    
    // Consulta direta à tabela de usuários
    const [results] = await sequelize.query(`
      SELECT *
      FROM "Users"
      ORDER BY id
      LIMIT 10
    `);
    
    console.log('Usuários encontrados:');
    console.table(results);
    
    // Verificar se existe usuário admin
    const adminUser = results.find(u => u.email === 'admin' || u.superAdmin === true);
    if (adminUser) {
      console.log('\nUsuário admin encontrado:', adminUser);
    } else {
      console.log('\nNenhum usuário admin encontrado');
    }
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sequelize.close();
  }
}

checkUsers();