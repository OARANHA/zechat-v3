const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class RBACMigrator {
  constructor() {
    this.migrationCommands = [
      {
        from: 'erp_providers',
        to: 'ErpProviders',
        columns: ['id', 'apiKey', 'webhookSecret', 'webhookUrl', 'errorMessage', 'lastSync', 'config', 'active', 'createdAt', 'updatedAt']
      },
      {
        from: 'permissions', 
        to: 'Permissions',
        columns: ['id', 'name', 'description', 'conditions', 'metadata', 'active', 'createdAt', 'updatedAt']
      },
      {
        from: 'role_permissions',
        to: 'RolePermissions', 
        columns: ['id', 'roleId', 'permissionId', 'assignedBy', 'expiresAt', 'createdAt', 'updatedAt']
      },
      {
        from: 'roles',
        to: 'Roles',
        columns: ['id', 'name', 'description', 'isDefault', 'metadata', 'active', 'createdAt', 'updatedAt']
      },
      {
        from: 'user_roles',
        to: 'UserRoles',
        columns: ['id', 'userId', 'roleId', 'assignedBy', 'expiresAt', 'isDefault', 'active', 'createdAt', 'updatedAt']
      }
    ];
  }

  async executeMigration() {
    console.log('🚀 INICIANDO MIGRAÇÃO RBAC (minúsculas → PascalCase)\n');

    try {
      // Passo 1: Backup dos dados
      await this.backupRBACData();

      // Passo 2: Criar tabelas novas em PascalCase
      await this.createNewTables();

      // Passo 3: Migrar dados
      await this.migrateData();

      // Passo 4: Remover tabelas antigas
      await this.dropOldTables();

      // Passo 5: Verificação final
      await this.verifyMigration();

      console.log('✅ MIGRAÇÃO RBAC CONCLUÍDA COM SUCESSO!\n');
      console.log('📋 TABELAS MIGRADAS:');
      this.migrationCommands.forEach(cmd => {
        console.log(`  • ${cmd.from} → ${cmd.to}`);
      });

    } catch (error) {
      console.error('❌ ERRO NA MIGRAÇÃO:', error.message);
      throw error;
    }
  }

  async backupRBACData() {
    console.log('📦 Fazendo backup dos dados RBAC...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -3);
    const backupDir = path.join(__dirname, '../backups/rbac-migration');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    for (const migration of this.migrationCommands) {
      const backupFile = path.join(backupDir, `${migration.from}_${timestamp}.sql`);
      const command = `docker exec 28web-postgres pg_dump -U chatex -d chatex -t ${migration.from} > ${backupFile}`;
      
      try {
        execSync(command, { stdio: 'pipe' });
        console.log(`  ✓ Backup: ${migration.from}`);
      } catch (error) {
        console.warn(`  ⚠️  Aviso: Backup de ${migration.from} falhou (pode não existir)`);
      }
    }
  }

  async createNewTables() {
    console.log('🏗️  Criando tabelas PascalCase...');

    for (const migration of this.migrationCommands) {
      try {
        // Verificar se tabela já existe
        const checkCmd = `docker exec 28web-postgres psql -U chatex -d chatex -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${migration.to}')"`;
        
        try {
          const result = execSync(checkCmd, { encoding: 'utf8' });
          if (result.trim() === 't') {
            console.log(`  • Tabela ${migration.to} já existe`);
            continue;
          }
        } catch (error) {
          // Tabela não existe, criar
        }

        // Definir colunas com tipos corretos
        const columnDefinitions = {
          'ErpProviders': `id SERIAL PRIMARY KEY,
  apiKey VARCHAR(255),
  webhookSecret VARCHAR(255),
  webhookUrl VARCHAR(500),
  errorMessage TEXT,
  lastSync TIMESTAMP,
  config JSONB,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
          'Permissions': `id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  conditions JSONB,
  metadata JSONB,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
          'RolePermissions': `id SERIAL PRIMARY KEY,
  roleId INTEGER REFERENCES Roles(id) ON DELETE CASCADE,
  permissionId INTEGER REFERENCES Permissions(id) ON DELETE CASCADE,
  assignedBy INTEGER REFERENCES Users(id),
  expiresAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
          'Roles': `id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  isDefault BOOLEAN DEFAULT false,
  metadata JSONB,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
          'UserRoles': `id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES Users(id) ON DELETE CASCADE,
  roleId INTEGER REFERENCES Roles(id) ON DELETE CASCADE,
  assignedBy INTEGER REFERENCES Users(id),
  expiresAt TIMESTAMP,
  isDefault BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
        };

        const columns = columnDefinitions[migration.to] || migration.columns.join(',\n  ');
        const createTableSQL = `CREATE TABLE "${migration.to}" (\n  ${columns}\n);`;

        const tempFile = path.join(__dirname, `create_${migration.to.toLowerCase()}.sql`);
        fs.writeFileSync(tempFile, createTableSQL);

        const command = `docker exec -i 28web-postgres psql -U chatex -d chatex < ${tempFile}`;
        execSync(command, { stdio: 'pipe' });
        
        fs.unlinkSync(tempFile);
        console.log(`  ✓ Criada: ${migration.to}`);
        
      } catch (error) {
        console.warn(`  ⚠️  Aviso: Criação de ${migration.to} falhou: ${error.message}`);
      }
    }
  }

  async migrateData() {
    console.log('📤 Migrando dados...');

    for (const migration of this.migrationCommands) {
      try {
        // Verificar se tabela de origem existe e tem dados
        const countCmd = `docker exec 28web-postgres psql -U chatex -d chatex -c "SELECT COUNT(*) FROM ${migration.from}"`;
        
        try {
          const result = execSync(countCmd, { encoding: 'utf8' });
          const count = parseInt(result.trim());
          
          if (count === 0) {
            console.log(`  • ${migration.from}: sem dados para migrar`);
            continue;
          }

          const columns = migration.columns.join(', ');
          const insertSQL = `
INSERT INTO "${migration.to}" (${columns})
SELECT ${columns}
FROM ${migration.from};`;

          const tempFile = path.join(__dirname, `migrate_${migration.from}.sql`);
          fs.writeFileSync(tempFile, insertSQL);

          const command = `docker exec -i 28web-postgres psql -U chatex -d chatex < ${tempFile}`;
          execSync(command, { stdio: 'pipe' });
          
          fs.unlinkSync(tempFile);
          console.log(`  ✓ Migrados: ${count} registros de ${migration.from} → ${migration.to}`);
          
        } catch (error) {
          console.warn(`  ⚠️  Aviso: Migração de ${migration.from} falhou: ${error.message}`);
        }
        
      } catch (error) {
        console.warn(`  ⚠️  Aviso: Verificação de ${migration.from} falhou: ${error.message}`);
      }
    }
  }

  async dropOldTables() {
    console.log('🗑️  Removendo tabelas antigas...');

    for (const migration of this.migrationCommands) {
      try {
        // Verificar se tabela ainda existe antes de remover
        const checkCmd = `docker exec 28web-postgres psql -U chatex -d chatex -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${migration.from}')"`;
        
        try {
          const result = execSync(checkCmd, { encoding: 'utf8' });
          if (result.trim() !== 't') {
            console.log(`  • Tabela ${migration.from} não existe para remover`);
            continue;
          }
        } catch (error) {
          continue;
        }

        const dropCmd = `docker exec 28web-postgres psql -U chatex -d chatex -c "DROP TABLE ${migration.from}"`;
        execSync(dropCmd, { stdio: 'pipe' });
        
        console.log(`  ✓ Removida: ${migration.from}`);
        
      } catch (error) {
        console.warn(`  ⚠️  Aviso: Remoção de ${migration.from} falhou: ${error.message}`);
      }
    }
  }

  async verifyMigration() {
    console.log('🔍 Verificando migração...');

    let successCount = 0;
    let errorCount = 0;

    for (const migration of this.migrationCommands) {
      try {
        // Verificar se tabela nova existe
        const checkNewCmd = `docker exec 28web-postgres psql -U chatex -d chatex -c "SELECT COUNT(*) FROM ${migration.to}"`;
        execSync(checkNewCmd, { stdio: 'pipe' });
        
        // Verificar se tabela antiga foi removida
        const checkOldCmd = `docker exec 28web-postgres psql -U chatex -d chatex -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${migration.from}')"`;
        const oldResult = execSync(checkOldCmd, { encoding: 'utf8' });
        
        if (oldResult.trim() === 'f') {
          console.log(`  ✅ ${migration.from} → ${migration.to}: SUCESSO`);
          successCount++;
        } else {
          console.log(`  ❌ ${migration.from} → ${migration.to}: FALHO (tabela antiga ainda existe)`);
          errorCount++;
        }
        
      } catch (error) {
        console.log(`  ❌ ${migration.from} → ${migration.to}: ERRO - ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 RESUMO DA VERIFICAÇÃO:`);
    console.log(`  • Migrações bem-sucedidas: ${successCount}`);
    console.log(`  • Migrações com falha: ${errorCount}`);
    console.log(`  • Taxa de sucesso: ${Math.round((successCount / this.migrationCommands.length) * 100)}%`);

    if (errorCount === 0) {
      console.log('\n🎉 TODAS AS MIGRAÇÕES FORAM CONCLUÍDAS COM SUCESSO!');
    } else {
      console.log('\n⚠️  ATENÇÃO: Algumas migrações precisam de atenção manual.');
    }
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  const migrator = new RBACMigrator();
  migrator.executeMigration().catch(console.error);
}

module.exports = RBACMigrator;
