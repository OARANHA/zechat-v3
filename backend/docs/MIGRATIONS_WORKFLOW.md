# Workflow de Sincronização Models vs Migrations

## 📋 Visão Geral

Este documento descreve o workflow automatizado para manter a sincronia entre models TypeScript (Sequelize) e migrations do banco de dados.

## 🎯 Problema Resolvido

**Situação Original:**
- 34 models detectados
- 27 migrations originais 
- 7 models sem migration correspondente
- Várias inconsistências de nomeclatura

**Solução Aplicada:**
- Abordagem híbrida: manter migrations originais + gerar complementares
- 18 migrations complementares geradas automaticamente
- 100% de cobertura alcançada (42 migrations totais)

## 🛠️ Ferramentas Criadas

### 1. Análise de Sincronia
```bash
node scripts/analyze-models-vs-migrations.js
```

**Funcionalidades:**
- Analisa todos os models em `src/models/`
- Compara com migrations existentes em `src/database/migrations/`
- Gera relatório detalhado de gaps
- Identifica inconsistências de colunas e relacionamentos

### 2. Geração de Migrations
```bash
node scripts/generate-missing-migrations.js
```

**Funcionalidades:**
- Lê estrutura dos models sem migration
- Gera migrations automaticamente com:
  - Tipos de dados corretos
  - Relacionamentos (FKs)
  - Índices e constraints
  - Valores default
- Respeita naming conventions do projeto

### 3. Validação Final
```bash
node scripts/sync-final-check.js
```

**Funcionalidades:**
- Corrige problemas de nomeclatura
- Valida sincronia completa
- Gera resumo executivo

## 📁 Estrutura de Arquivos

```
backend/
├── scripts/
│   ├── analyze-models-vs-migrations.js    # Análise comparativa
│   ├── generate-missing-migrations.js     # Geração automática
│   ├── sync-final-check.js              # Validação final
│   └── sync-report.json               # Relatório detalhado
├── src/
│   ├── models/                        # Models TypeScript
│   └── database/
│       └── migrations/                # Migrations SQL
└── docs/
    └── MIGRATIONS_WORKFLOW.md        # Este documento
```

## 🔄 Workflow Completo

### Para Novos Desenvolvimentos

1. **Criar/Modificar Model**
   ```typescript
   @Table({ tableName: "nova_tabela" })
   class NovoModel extends Model<NovoModel> {
     @PrimaryKey
     @AutoIncrement
     @Column
     id: number;
     
     @Column(DataType.STRING)
     nome: string;
   }
   ```

2. **Verificar Sincronia**
   ```bash
   node scripts/analyze-models-vs-migrations.js
   ```

3. **Gerar Migration (se necessário)**
   ```bash
   node scripts/generate-missing-migrations.js
   ```

4. **Aplicar Migration**
   ```bash
   npm run db:migrate
   ```

### Para Manutenção da Base

1. **Validação Completa**
   ```bash
   node scripts/sync-final-check.js
   ```

2. **Análise de Relatório**
   - Verificar `scripts/sync-report.json`
   - Validar覆盖率
   - Identificar anomalias

## 📊 Métricas e KPIs

### Relatório de Sincronia

O arquivo `sync-report.json` contém:

```json
{
  "timestamp": "2025-12-18T08:49:49.035Z",
  "summary": {
    "totalModels": 34,
    "totalMigrations": 42,
    "modelsWithoutMigration": 0
  },
  "finalCheck": {
    "status": "COMPLETED",
    "approach": "HYBRID_MAINTAIN_ORIGINALS"
  }
}
```

### Indicadores

- **Coverage**: 100% (34/34 models com migration)
- **Consistency**: 0 inconsistências de nomeclatura
- **Maintainability**: Scripts reutilizáveis

## 🚀 Melhores Práticas

### 1. Convenções de Nomenclatura

**Models:**
```typescript
// PascalCase + singular
class User extends Model<User>
class UserRole extends Model<UserRole>
```

**Migrations:**
```typescript
// timestamp + create-table + nome_pluralizado
20251218085210-create-table-users.ts
20251218085211-create-table-user-roles.ts
```

**Tabelas:**
```sql
-- Plural com 's' ou padrão específico
users
user_roles
```

### 2. Estrutura de Models

```typescript
@Table({ 
  freezeTableName: true,  // Evita pluralização automática
  tableName: "nome_exato" 
})
class NomeModel extends Model<NomeModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  
  @Column(DataType.STRING)
  @AllowNull(false)
  nome: string;
  
  @Default(true)
  @Column(DataType.BOOLEAN)
  ativo: boolean;
  
  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;
  
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
```

### 3. Relacionamentos

```typescript
// BelongsTo
@ForeignKey(() => User)
@Column
userId: number;

@BelongsTo(() => User)
user: User;

// HasMany  
@HasMany(() => UserRole)
userRoles: UserRole[];

// BelongsToMany
@BelongsToMany(() => Role, { through: () => UserRole })
roles: Role[];
```

## 🔧 Scripts de Automatização

### Análise Rápida
```bash
# Verificar status atual
node scripts/analyze-models-vs-migrations.js | grep -E "(Models|Migrations|✅|❌)"
```

### Geração em Lote
```bash
# Gerar todas as migrations faltantes
node scripts/generate-missing-migrations.js && npm run db:migrate
```

### Validação Automática
```bash
# Verificar sincronia completa
node scripts/sync-final-check.js
```

## 📝 Troubleshooting

### Problemas Comuns

1. **Erro: "Cannot find module"**
   - Verificar se `@types/node` está instalado
   - Executar `npm install @types/node --save-dev`

2. **Erro: "ENOENT no such file"**
   - Verificar nome do arquivo model
   - Usar PascalCase exato

3. **Erro de nomeclatura**
   - Executar `node scripts/sync-final-check.js`
   - Corrigir automaticamente

4. **Migration não aplicada**
   - Verificar arquivo de configuração do banco
   - Executar `npm run db:migrate:undo` e `npm run db:migrate`

### Logs e Debug

```bash
# Ver logs completos
node scripts/analyze-models-vs-migrations.js 2>&1 | tee analysis.log

# Ver arquivo de relatório
cat scripts/sync-report.json | jq '.summary'
```

## 🎓 Conclusão

Este workflow estabelece um processo robusto e automatizado para:

✅ **Manter sincronia** entre models e migrations  
✅ **Gerar migrations** automaticamente a partir de models  
✅ **Validar consistência** do schema do banco  
✅ **Documentar mudanças** de forma rastreável  
✅ **Facilitar manutenção** contínua  

A abordagem híbrida preserva a estabilidade das migrations originais enquanto garante completude através das migrations geradas automaticamente.

---

**Última atualização:** 18/12/2025  
**Versão:** 1.0  
**Status:** ✅ Produção Ready
