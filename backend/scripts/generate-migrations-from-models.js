const fs = require('fs');
const path = require('path');

class MigrationGenerator {
  constructor() {
    this.modelsPath = path.join(__dirname, '../src/models');
    this.migrationsPath = path.join(__dirname, '../src/database/migrations1');
    this.models = new Map();
    this.migrations = new Map();
  }

  async generate() {
    console.log('🔍 Analisando Models e Gerando Migrations...\n');

    await this.loadModels();
    await this.loadMigrations();
    
    const missingMigrations = this.findMissingMigrations();
    
    if (missingMigrations.length === 0) {
      console.log('✅ Todos os models já têm migrations correspondentes!');
      return;
    }

    console.log(`📝 Gerando ${missingMigrations.length} migrations faltantes...\n`);
    
    for (const model of missingMigrations) {
      await this.generateMigration(model);
    }

    console.log('\n✅ Migrations geradas com sucesso!');
    console.log('📂 Execute "npm run db:migrate" para aplicar as migrations ao banco de dados.');
  }

  async loadModels() {
    console.log('📁 Carregando models...');
    
    const modelFiles = fs.readdirSync(this.modelsPath)
      .filter(file => file.endsWith('.ts') && !file.includes('.test') && !file.includes('.spec'));

    for (const file of modelFiles) {
      const modelInfo = this.extractModelInfo(file);
      if (modelInfo) {
        this.models.set(modelInfo.name, modelInfo);
        console.log(`  ✓ ${modelInfo.name} (${modelInfo.tableName})`);
      }
    }
    
    console.log(`📊 Total de models: ${this.models.size}\n`);
  }

  async loadMigrations() {
    console.log('📁 Carregando migrations existentes...');
    
    const migrationFiles = fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.ts') && file.includes('create-'))
      .sort();

    for (const file of migrationFiles) {
      const tableName = this.extractTableNameFromMigration(file);
      if (tableName) {
        this.migrations.set(tableName, file);
        console.log(`  ✓ ${tableName} (${file})`);
      }
    }
    
    console.log(`📊 Total de migrations: ${this.migrations.size}\n`);
  }

  extractModelInfo(filename) {
    try {
      const filePath = path.join(this.modelsPath, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extrai nome da classe
      const classMatch = content.match(/class\s+(\w+)\s+extends/);
      if (!classMatch) return null;
      
      const modelName = classMatch[1];
      
      // Extrai tableName do decorator @Table
      const tableMatch = content.match(/@Table\s*\(\s*\{\s*tableName:\s*['"`]([^'"`]+)['"`]/);
      const tableName = tableMatch ? tableMatch[1] : `${modelName}s`;
      
      // Extrai colunas
      const columns = this.extractColumnsFromModel(content);
      
      // Extrai índices
      const indexes = this.extractIndexesFromModel(content);
      
      return {
        name: modelName,
        tableName,
        columns,
        indexes,
        filename
      };
    } catch (error) {
      console.error(`❌ Erro ao processar model ${filename}:`, error.message);
      return null;
    }
  }

  extractColumnsFromModel(content) {
    const columns = [];
    const lines = content.split('\n');
    
    // Encontra todas as propriedades com decorators
    const propertyMatches = content.match(/(?:@[A-Z][a-zA-Z]+\([^)]*\)\s*\n\s*)*[ \t]*(\w+)\s*(\?)?:\s*[^;]+;/gs);
    
    if (propertyMatches) {
      for (const match of propertyMatches) {
        // Ignora getters e métodos
        if (match.includes('get ') || match.includes('(')) continue;
        
        // Extrai nome da propriedade
        const propMatch = match.match(/(\w+)\s*(\?)?:\s*([^;]+);/);
        if (!propMatch) continue;
        
        const propertyName = propMatch[1];
        const isOptional = propMatch[2] === '?';
        const propertyType = propMatch[3].trim();
        
        // Extrai decorators específicos para esta propriedade
        const propertyBlock = match.split(propertyName)[0];
        
        const column = {
          name: propertyName,
          type: 'STRING',
          allowNull: isOptional
        };
        
        // Extrai tipo do DataType
        const dataTypeMatch = match.match(/DataType\.(\w+)/);
        if (dataTypeMatch) {
          column.type = this.mapDataType(dataTypeMatch[1]);
        } else {
          // Mapeia tipo TypeScript
          column.type = this.mapTypeScriptType(propertyType);
        }
        
        // Verifica propriedades dos decorators
        if (propertyBlock.includes('@PrimaryKey')) column.primaryKey = true;
        if (propertyBlock.includes('@AutoIncrement')) column.autoIncrement = true;
        if (propertyBlock.includes('@AllowNull(true)')) column.allowNull = true;
        if (propertyBlock.includes('@AllowNull(false)')) column.allowNull = false;
        
        // Extrai valor default
        const defaultMatch = match.match(/@Default\(([^)]+)\)/);
        if (defaultMatch) {
          column.defaultValue = this.parseDefaultValue(defaultMatch[1]);
        }
        
        // Extrai foreign key
        const fkMatch = match.match(/@ForeignKey\(\(\)\s*=>\s*(\w+)\)/);
        if (fkMatch) {
          column.references = {
            model: fkMatch[1],
            key: 'id'
          };
        }
        
        // Corrige allowNull para primary keys
        if (column.primaryKey && column.allowNull === undefined) {
          column.allowNull = false;
        }
        
        // Adiciona colunas especiais do Sequelize
        if (propertyBlock.includes('@CreatedAt')) {
          column.name = 'createdAt';
          column.type = 'DATE';
          column.allowNull = false;
        }
        if (propertyBlock.includes('@UpdatedAt')) {
          column.name = 'updatedAt';
          column.type = 'DATE';
          column.allowNull = false;
        }
        
        columns.push(column);
      }
    }
    
    return columns;
  }

  extractIndexesFromModel(content) {
    const indexes = [];
    
    const indexesMatch = content.match(/indexes:\s*\[\s*\{([^}]+)\}\s*\]/s);
    if (indexesMatch) {
      const indexesContent = indexesMatch[1];
      const indexBlocks = indexesContent.match(/\{[^}]+\}/g);
      
      if (indexBlocks) {
        for (const block of indexBlocks) {
          const fieldsMatch = block.match(/fields:\s*\[([^\]]+)\]/);
          if (fieldsMatch) {
            const fields = fieldsMatch[1].split(',').map(f => f.trim().replace(/['"`]/g, ''));
            const isUnique = block.includes('unique: true');
            indexes.push({ fields, unique: isUnique });
          }
        }
      }
    }
    
    return indexes;
  }

  mapDataType(type) {
    const typeMap = {
      'INTEGER': 'INTEGER',
      'STRING': 'STRING',
      'TEXT': 'TEXT',
      'DATE': 'DATE',
      'BOOLEAN': 'BOOLEAN',
      'JSON': 'JSON',
      'JSONB': 'JSONB',
      'UUID': 'UUID',
      'DECIMAL': 'DECIMAL',
      'FLOAT': 'FLOAT',
      'DOUBLE': 'DOUBLE',
      'ENUM': 'ENUM'
    };
    return typeMap[type] || 'STRING';
  }

  mapTypeScriptType(type) {
    const typeMap = {
      'number': 'INTEGER',
      'string': 'STRING',
      'boolean': 'BOOLEAN',
      'Date': 'DATE',
      'object': 'JSON'
    };
    return typeMap[type] || 'STRING';
  }

  parseDefaultValue(value) {
    value = value.trim();
    
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value.includes('"') || value.includes("'")) return value.slice(1, -1);
    if (value.includes('()')) {
      // Para funções como new Date()
      if (value.includes('Date')) return 'sequelize.literal("CURRENT_TIMESTAMP")';
      return value;
    }
    if (!isNaN(Number(value))) return Number(value);
    
    return value;
  }

  extractTableNameFromMigration(filename) {
    const match = filename.match(/create-(.+)\.ts$/);
    return match ? match[1] : null;
  }

  findMissingMigrations() {
    return Array.from(this.models.values()).filter(model => 
      !this.migrations.has(model.tableName)
    );
  }

  async generateMigration(model) {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '');
    const filename = `${timestamp}-create-${model.tableName}.ts`;
    const filePath = path.join(this.migrationsPath, filename);
    
    const migrationContent = this.generateMigrationContent(model);
    
    fs.writeFileSync(filePath, migrationContent, 'utf-8');
    console.log(`  ✓ Gerado: ${filename}`);
  }

  generateMigrationContent(model) {
    const columns = model.columns.map(col => this.generateColumnDefinition(col)).join(',\n    ');
    const indexes = model.indexes.map(idx => this.generateIndexDefinition(idx, model.tableName)).join('\n    ');
    
    return `"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("${model.tableName}", {
${columns}
    });

${indexes}
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("${model.tableName}");
  }
};`;
  }

  generateColumnDefinition(column) {
    let definition = `      ${column.name}: {
        type: Sequelize.${column.type}`;
    
    if (column.allowNull !== undefined) {
      definition += `,\n        allowNull: ${column.allowNull}`;
    }
    
    if (column.primaryKey) {
      definition += `,\n        primaryKey: true`;
    }
    
    if (column.autoIncrement) {
      definition += `,\n        autoIncrement: true`;
    }
    
    if (column.defaultValue !== undefined) {
      if (typeof column.defaultValue === 'string' && column.defaultValue.includes('sequelize.literal')) {
        definition += `,\n        defaultValue: ${column.defaultValue}`;
      } else {
        definition += `,\n        defaultValue: ${JSON.stringify(column.defaultValue)}`;
      }
    }
    
    if (column.references) {
      definition += `,\n        references: {
          model: "${column.references.model}",
          key: "${column.references.key}"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }`;
    } else {
      definition += '\n      }';
    }
    
    return definition;
  }

  generateIndexDefinition(index, tableName) {
    const indexName = `${index.fields.join('_')}_index`;
    const fieldsStr = index.fields.map(f => `"${f}"`).join(', ');
    
    if (index.unique) {
      return `    await queryInterface.addIndex("${tableName}", [${fieldsStr}], {
      name: "${indexName}",
      unique: true
    });`;
    } else {
      return `    await queryInterface.addIndex("${tableName}", [${fieldsStr}], {
      name: "${indexName}"
    });`;
    }
  }
}

// Executa geração
if (require.main === module) {
  const generator = new MigrationGenerator();
  generator.generate().catch(console.error);
}

module.exports = MigrationGenerator;
