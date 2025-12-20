"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ModelVsMigrationAnalyzer {
    constructor() {
        this.modelsPath = path.join(__dirname, '../src/models');
        this.migrationsPath = path.join(__dirname, '../src/database/migrations');
        this.models = new Map();
        this.migrations = new Map();
    }
    async analyze() {
        console.log('🔍 Analisando Models vs Migrations...\n');
        await this.loadModels();
        await this.loadMigrations();
        this.generateReport();
    }
    async loadModels() {
        console.log('📁 Carregando models...');
        const modelFiles = fs.readdirSync(this.modelsPath)
            .filter(file => file.endsWith('.ts') && !file.includes('.test') && !file.includes('.spec'));
        for (const file of modelFiles) {
            const modelInfo = await this.extractModelInfo(file);
            if (modelInfo) {
                this.models.set(modelInfo.name, modelInfo);
                console.log(`  ✓ ${modelInfo.name} (${modelInfo.tableName})`);
            }
        }
        console.log(`📊 Total de models: ${this.models.size}\n`);
    }
    async loadMigrations() {
        console.log('📁 Carregando migrations...');
        const migrationFiles = fs.readdirSync(this.migrationsPath)
            .filter(file => file.endsWith('.ts'))
            .sort(); // Ordena por timestamp
        for (const file of migrationFiles) {
            const migrationInfo = await this.extractMigrationInfo(file);
            if (migrationInfo) {
                this.migrations.set(migrationInfo.tableName, migrationInfo);
                console.log(`  ✓ ${migrationInfo.tableName} (${file})`);
            }
        }
        console.log(`📊 Total de migrations: ${this.migrations.size}\n`);
    }
    async extractModelInfo(filename) {
        try {
            const filePath = path.join(this.modelsPath, filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            // Extrai nome da classe
            const classMatch = content.match(/class\s+(\w+)\s+extends/);
            if (!classMatch)
                return null;
            const modelName = classMatch[1];
            // Extrai tableName do decorator @Table
            const tableMatch = content.match(/@Table\s*\(\s*\{\s*tableName:\s*['"`]([^'"`]+)['"`]/);
            const tableName = tableMatch ? tableMatch[1] : `${modelName}s`;
            // Extrai colunas
            const columns = this.extractColumnsFromModel(content);
            // Extrai relações
            const relations = this.extractRelationsFromModel(content);
            // Extrai índices
            const indexes = this.extractIndexesFromModel(content);
            return {
                name: modelName,
                tableName,
                columns,
                relations,
                indexes
            };
        }
        catch (error) {
            console.error(`❌ Erro ao processar model ${filename}:`, error);
            return null;
        }
    }
    extractColumnsFromModel(content) {
        const columns = [];
        // Padrão para decorators de coluna
        const columnRegex = /@(?:Column|PrimaryKey|AutoIncrement|Default|AllowNull|ForeignKey)\([^)]*\)\s*\n\s*@?(?:Column|PrimaryKey|AutoIncrement|Default|AllowNull|ForeignKey)?\([^)]*\)\s*\n\s*@(?:Column|PrimaryKey|AutoIncrement|Default|AllowNull|ForeignKey)?\([^)]*\)\s*\n\s*(?:private\s+)?(\w+)(?::\s*[^;=]+)?/g;
        const matches = content.match(/@[^{]+?\{[^}]*?\}\s*\n[^@]*?(\w+):/gs) || [];
        for (const match of matches) {
            const propertyNameMatch = match.match(/(\w+):/);
            if (!propertyNameMatch)
                continue;
            const columnName = propertyNameMatch[1];
            // Extrai tipo
            const typeMatch = match.match(/DataType\.(\w+)/);
            const type = typeMatch ? typeMatch[1] : 'UNKNOWN';
            // Verifica se é primary key
            const isPrimaryKey = match.includes('@PrimaryKey');
            // Verifica auto increment
            const isAutoIncrement = match.includes('@AutoIncrement');
            // Verifica allow null
            const allowNull = match.includes('@AllowNull') && match.includes('true') ||
                !match.includes('@AllowNull') && !isPrimaryKey;
            // Verifica unique
            const isUnique = match.includes('unique:') && match.includes('true');
            // Extrai default value
            const defaultMatch = match.match(/@Default\(([^)]+)\)/);
            let defaultValue = undefined;
            if (defaultMatch) {
                const defaultValueStr = defaultMatch[1];
                if (defaultValueStr.includes('true'))
                    defaultValue = true;
                else if (defaultValueStr.includes('false'))
                    defaultValue = false;
                else if (defaultValueStr.includes('"'))
                    defaultValue = defaultValueStr.slice(1, -1);
                else if (!isNaN(Number(defaultValueStr)))
                    defaultValue = Number(defaultValueStr);
            }
            // Extrai foreign key
            const foreignKeyMatch = match.match(/@ForeignKey\(\(\)\s*=>\s*(\w+)\)/);
            const foreignKey = foreignKeyMatch ? foreignKeyMatch[1] : undefined;
            columns.push({
                name: columnName,
                type,
                allowNull: !isPrimaryKey && allowNull,
                primaryKey: isPrimaryKey,
                autoIncrement: isAutoIncrement,
                unique: isUnique,
                defaultValue,
                foreignKey
            });
        }
        return columns;
    }
    extractRelationsFromModel(content) {
        const relations = [];
        // HasMany
        const hasManyMatches = content.match(/@HasMany\(\(\)\s*=>\s*(\w+)(?:,\s*\([^)]*\))?/g);
        if (hasManyMatches) {
            for (const match of hasManyMatches) {
                const targetMatch = match.match(/=>\s*(\w+)/);
                if (targetMatch) {
                    relations.push({ type: 'hasMany', target: targetMatch[1] });
                }
            }
        }
        // BelongsTo
        const belongsToMatches = content.match(/@BelongsTo\(\(\)\s*=>\s*(\w+)(?:,\s*\([^)]*\))?/g);
        if (belongsToMatches) {
            for (const match of belongsToMatches) {
                const targetMatch = match.match(/=>\s*(\w+)/);
                if (targetMatch) {
                    relations.push({ type: 'belongsTo', target: targetMatch[1] });
                }
            }
        }
        // BelongsToMany
        const belongsToManyMatches = content.match(/@BelongsToMany\(\(\)\s*=>\s*(\w+),\s*\(\)\s*=>\s*(\w+)/g);
        if (belongsToManyMatches) {
            for (const match of belongsToManyMatches) {
                const targetMatch = match.match(/=>\s*(\w+),/);
                const throughMatch = match.match(/,\s*\(\)\s*=>\s*(\w+)/);
                if (targetMatch && throughMatch) {
                    relations.push({
                        type: 'belongsToMany',
                        target: targetMatch[1],
                        through: throughMatch[1]
                    });
                }
            }
        }
        return relations;
    }
    extractIndexesFromModel(content) {
        const indexes = [];
        const indexesMatch = content.match(/indexes:\s*\[\s*\{([^}]+)\}\s*\]/s);
        if (indexesMatch) {
            const indexesContent = indexesMatch[1];
            const fieldMatches = indexesContent.match(/fields:\s*\[([^\]]+)\]/g);
            if (fieldMatches) {
                for (const match of fieldMatches) {
                    const fieldsStr = match.match(/\[([^\]]+)\]/);
                    if (fieldsStr) {
                        const fields = fieldsStr[1].split(',').map(f => f.trim().replace(/['"`]/g, ''));
                        const isUnique = indexesContent.includes('unique: true');
                        indexes.push({ fields, unique: isUnique });
                    }
                }
            }
        }
        return indexes;
    }
    async extractMigrationInfo(filename) {
        try {
            const filePath = path.join(this.migrationsPath, filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            // Extrai timestamp do nome
            const timestamp = filename.split('-')[0];
            // Determina operação
            let operation = 'create';
            if (content.includes('alterTable'))
                operation = 'alter';
            else if (content.includes('dropTable'))
                operation = 'drop';
            else if (content.includes('addColumn'))
                operation = 'add';
            else if (content.includes('removeColumn'))
                operation = 'remove';
            // Extrai nome da tabela
            let tableName = '';
            const createTableMatch = content.match(/createTable\s*\(\s*['"`]([^'"`]+)['"`]/);
            if (createTableMatch) {
                tableName = createTableMatch[1];
            }
            else {
                const alterTableMatch = content.match(/alterTable\s*\(\s*['"`]([^'"`]+)['"`]/);
                if (alterTableMatch) {
                    tableName = alterTableMatch[1];
                }
            }
            if (!tableName)
                return null;
            // Extrai colunas (simplificado)
            const columns = [];
            const columnMatches = content.match(/\w+:\s*\{[^}]+\}/g) || [];
            for (const match of columnMatches) {
                const nameMatch = match.match(/(\w+):/);
                if (!nameMatch)
                    continue;
                const name = nameMatch[1];
                const typeMatch = match.match(/type:\s*DataTypes\.(\w+)/);
                const type = typeMatch ? typeMatch[1] : 'UNKNOWN';
                const allowNull = match.includes('allowNull: false') ? false : true;
                const isPrimaryKey = match.includes('primaryKey: true');
                const isAutoIncrement = match.includes('autoIncrement: true');
                const isUnique = match.includes('unique: true');
                columns.push({
                    name,
                    type,
                    allowNull,
                    primaryKey: isPrimaryKey,
                    autoIncrement: isAutoIncrement,
                    unique: isUnique
                });
            }
            return {
                filename,
                tableName,
                operation,
                columns,
                timestamp
            };
        }
        catch (error) {
            console.error(`❌ Erro ao processar migration ${filename}:`, error);
            return null;
        }
    }
    generateReport() {
        console.log('📋 GERANDO RELATÓRIO DE ANÁLISE\n');
        // Models sem migration
        console.log('🔍 MODELS SEM MIGRATION CORRESPONDENTE:');
        const modelsWithoutMigration = Array.from(this.models.keys())
            .filter(modelName => {
            const model = this.models.get(modelName);
            return !this.migrations.has(model.tableName);
        });
        if (modelsWithoutMigration.length === 0) {
            console.log('  ✅ Todos os models têm migration correspondente');
        }
        else {
            modelsWithoutMigration.forEach(modelName => {
                const model = this.models.get(modelName);
                console.log(`  ❌ ${modelName} (tabela: ${model.tableName})`);
            });
        }
        console.log('\n📊 ESTATÍSTICAS:');
        console.log(`  • Models encontrados: ${this.models.size}`);
        console.log(`  • Migrations encontradas: ${this.migrations.size}`);
        console.log(`  • Models sem migration: ${modelsWithoutMigration.length}`);
        // Análise detalhada das diferenças
        console.log('\n🔍 ANÁLISE DETALHADA:');
        for (const [modelName, model] of this.models) {
            const migration = this.migrations.get(model.tableName);
            if (!migration) {
                console.log(`\n❌ ${modelName}: Nenhuma migration encontrada para tabela ${model.tableName}`);
                continue;
            }
            console.log(`\n📝 ${modelName} vs ${migration.filename}:`);
            // Compara colunas
            const modelColumns = new Set(model.columns.map(c => c.name));
            const migrationColumns = new Set(migration.columns.map(c => c.name));
            const missingInMigration = Array.from(modelColumns).filter(col => !migrationColumns.has(col));
            const extraInMigration = Array.from(migrationColumns).filter(col => !modelColumns.has(col));
            if (missingInMigration.length > 0) {
                console.log(`  ⚠️  Colunas faltando na migration: ${missingInMigration.join(', ')}`);
            }
            if (extraInMigration.length > 0) {
                console.log(`  ℹ️  Colunas extras na migration: ${extraInMigration.join(', ')}`);
            }
            if (missingInMigration.length === 0 && extraInMigration.length === 0) {
                console.log(`  ✅ Colunas sincronizadas`);
            }
        }
        // Salva relatório em arquivo
        this.saveDetailedReport(modelsWithoutMigration);
    }
    saveDetailedReport(modelsWithoutMigration) {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalModels: this.models.size,
                totalMigrations: this.migrations.size,
                modelsWithoutMigration: modelsWithoutMigration.length
            },
            modelsWithoutMigration: modelsWithoutMigration.map(name => {
                const model = this.models.get(name);
                return {
                    name,
                    tableName: model.tableName,
                    columns: model.columns.length,
                    relations: model.relations.length
                };
            }),
            detailedAnalysis: Array.from(this.models.entries()).map(([name, model]) => {
                const migration = this.migrations.get(model.tableName);
                return {
                    model: name,
                    tableName: model.tableName,
                    hasMigration: !!migration,
                    migrationFile: migration === null || migration === void 0 ? void 0 : migration.filename,
                    columnsComparison: {
                        model: model.columns.map(c => ({ name: c.name, type: c.type })),
                        migration: (migration === null || migration === void 0 ? void 0 : migration.columns.map(c => ({ name: c.name, type: c.type }))) || []
                    }
                };
            })
        };
        const reportPath = path.join(__dirname, '../scripts/sync-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n💾 Relatório detalhado salvo em: ${reportPath}`);
    }
}
// Executa análise
if (require.main === module) {
    const analyzer = new ModelVsMigrationAnalyzer();
    analyzer.analyze().catch(console.error);
}
exports.default = ModelVsMigrationAnalyzer;
//# sourceMappingURL=analyze-models-vs-migrations.js.map