const fs = require('fs');
const path = require('path');

class MigrationGenerator {
  constructor() {
    this.modelsPath = path.join(__dirname, '../src/models');
    this.migrationsPath = path.join(__dirname, '../src/database/migrations');
    this.reportPath = path.join(__dirname, 'sync-report.json');
  }

  async generate() {
    console.log('🔧 Gerando migrations ausentes...\n');

    const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf-8'));
    const modelsWithoutMigration = report.modelsWithoutMigration;

    for (const modelInfo of modelsWithoutMigration) {
      await this.generateMigrationForModel(modelInfo);
    }

    console.log('\n✅ Processo concluído!');
    console.log('💡 Execute "npm run db:migrate" para aplicar as novas migrations');
  }

  async generateMigrationForModel(modelInfo) {
    console.log(`📝 Gerando migration para ${modelInfo.name} (${modelInfo.tableName})...`);

    try {
      const modelPath = path.join(this.modelsPath, `${modelInfo.name}.ts`);
      const modelContent = fs.readFileSync(modelPath, 'utf-8');
      
      // Extrai informações detalhadas do model
      const modelDetails = this.extractModelDetails(modelContent);
      
      // Gera o conteúdo da migration
      const migrationContent = this.generateMigrationContent(modelInfo.name, modelInfo.tableName, modelDetails);
      
      // Cria o arquivo da migration com timestamp atual
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0].substring(0, 14);
      const filename = `${timestamp}-create-table-${modelInfo.tableName.toLowerCase()}.ts`;
      const migrationPath = path.join(this.migrationsPath, filename);
      
      fs.writeFileSync(migrationPath, migrationContent);
      console.log(`  ✓ Criado: ${filename}`);
      
    } catch (error) {
      console.error(`  ❌ Erro ao gerar migration para ${modelInfo.name}:`, error.message);
    }
  }

  extractModelDetails(content) {
    const details = {
      tableName: '',
      columns: [],
      indexes: [],
      foreignKeys: []
    };

    // Extrai tableName
    const tableMatch = content.match(/@Table\s*\(\s*\{\s*tableName:\s*['"`]([^'"`]+)['"`]/);
    details.tableName = tableMatch ? tableMatch[1] : '';

    // Extrai colunas de forma mais robusta
    const columnRegex = /@(?:Column|PrimaryKey|AutoIncrement|Default|AllowNull|ForeignKey|Validate)[^{]*?\{[^}]*\}[^@]*?@?(?:Column|PrimaryKey|AutoIncrement|Default|AllowNull|ForeignKey|Validate)[^{]*?\{[^}]*\}[^@]*?@(?:Column|PrimaryKey|AutoIncrement|Default|AllowNull|ForeignKey|Validate)[^{]*?\{[^}]*\}\s*\n\s*(?:private\s+)?(\w+)(?::\s*[^;=]+)?/gs;
    
    let match;
    const propertyMatches = [];
    
    // Pattern alternativo mais simples
    const simplerPattern = /@[A-Za-z]+\([^)]*\)\s*\n\s*(?:@[A-Za-z]+\([^)]*\)\s*\n\s*)*@[A-Za-z]+\([^)]*\)\s*\n\s*(?:private\s+)?(\w+)/gs;
    
    while ((match = simplerPattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const propertyName = match[1];
      
      // Ignora se não for decorator de coluna relevante
      if (!fullMatch.includes('@Column') && !fullMatch.includes('@PrimaryKey') && 
          !fullMatch.includes('@ForeignKey') && !fullMatch.includes('@Default') &&
          !fullMatch.includes('@AllowNull') && !fullMatch.includes('@Validate')) {
        continue;
      }

      const columnInfo = this.extractColumnInfo(fullMatch, propertyName);
      if (columnInfo) {
        details.columns.push(columnInfo);
      }
    }

    // Extrai índices
    const indexMatch = content.match(/indexes:\s*\[\s*\{([^}]+)\}\s*\]/s);
    if (indexMatch) {
      const indexesContent = indexMatch[1];
      const fieldMatches = indexesContent.match(/fields:\s*\[([^\]]+)\]/g);
      
      if (fieldMatches) {
        for (const match of fieldMatches) {
          const fieldsStr = match.match(/\[([^\]]+)\]/);
          if (fieldsStr) {
            const fields = fieldsStr[1].split(',').map(f => f.trim().replace(/['"`]/g, ''));
            const isUnique = indexesContent.includes('unique: true');
            details.indexes.push({ fields, unique: isUnique });
          }
        }
      }
    }

    return details;
  }

  extractColumnInfo(match, propertyName) {
    const info = {
      name: propertyName,
      type: 'STRING',
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: null,
      foreignKey: null
    };

    // Extrai tipo
    const typeMatch = match.match(/DataType\.(\w+)/);
    if (typeMatch) {
      const dataType = typeMatch[1];
      info.type = this.mapDataType(dataType);
    }

    // Verifica propriedades
    info.primaryKey = match.includes('@PrimaryKey');
    info.autoIncrement = match.includes('@AutoIncrement');
    info.unique = match.includes('unique:') && match.includes('true');
    
    // AllowNull
    if (match.includes('@AllowNull')) {
      if (match.includes('@AllowNull(true)')) {
        info.allowNull = true;
      } else if (match.includes('@AllowNull(false)')) {
        info.allowNull = false;
      }
    } else if (!info.primaryKey) {
      info.allowNull = true;
    }

    // Default value
    const defaultMatch = match.match(/@Default\(([^)]+)\)/);
    if (defaultMatch) {
      const defaultValueStr = defaultMatch[1];
      if (defaultValueStr.includes('true')) info.defaultValue = true;
      else if (defaultValueStr.includes('false')) info.defaultValue = false;
      else if (defaultValueStr.includes('"') || defaultValueStr.includes("'")) {
        info.defaultValue = defaultValueStr.slice(1, -1);
      }
      else if (!isNaN(Number(defaultValueStr))) {
        info.defaultValue = Number(defaultValueStr);
      }
    }

    // Foreign key
    const foreignKeyMatch = match.match(/@ForeignKey\(\(\)\s*=>\s*(\w+)\)/);
    if (foreignKeyMatch) {
      info.foreignKey = foreignKeyMatch[1];
    }

    return info;
  }

  mapDataType(dataType) {
    const typeMap = {
      'STRING': 'DataTypes.STRING',
      'TEXT': 'DataTypes.TEXT',
      'INTEGER': 'DataTypes.INTEGER',
      'BIGINT': 'DataTypes.BIGINT',
      'DECIMAL': 'DataTypes.DECIMAL',
      'FLOAT': 'DataTypes.FLOAT',
      'DOUBLE': 'DataTypes.DOUBLE',
      'BOOLEAN': 'DataTypes.BOOLEAN',
      'DATE': 'DataTypes.DATE',
      'UUID': 'DataTypes.UUID',
      'JSON': 'DataTypes.JSON',
      'JSONB': 'DataTypes.JSONB',
      'ENUM': 'DataTypes.ENUM',
      'VIRTUAL': 'DataTypes.VIRTUAL'
    };
    return typeMap[dataType] || 'DataTypes.STRING';
  }

  generateMigrationContent(modelName, tableName, modelDetails) {
    const columns = modelDetails.columns.map(col => this.generateColumnDefinition(col)).join(',\n      ');
    
    return `import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("${tableName}", {
      ${columns}
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("${tableName}");
  }
};`;
  }

  generateColumnDefinition(column) {
    let definition = `      ${column.name}: {
        type: ${column.type}`;
    
    if (!column.allowNull) {
      definition += `,
        allowNull: false`;
    }
    
    if (column.primaryKey) {
      definition += `,
        primaryKey: true`;
    }
    
    if (column.autoIncrement) {
      definition += `,
        autoIncrement: true`;
    }
    
    if (column.unique) {
      definition += `,
        unique: true`;
    }
    
    if (column.defaultValue !== null) {
      if (typeof column.defaultValue === 'string') {
        definition += `,
        defaultValue: "${column.defaultValue}"`;
      } else {
        definition += `,
        defaultValue: ${column.defaultValue}`;
      }
    }
    
    if (column.foreignKey) {
      const targetTable = this.getTableNameFromModel(column.foreignKey);
      definition += `,
        references: { model: "${targetTable}", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "restrict"`;
    }
    
    definition += '\n      }';
    
    return definition;
  }

  getTableNameFromModel(modelName) {
    // Converte PascalCase para plural com 's'
    return modelName + 's';
  }
}

// Executa geração
if (require.main === module) {
  const generator = new MigrationGenerator();
  generator.generate().catch(console.error);
}

module.exports = MigrationGenerator;
