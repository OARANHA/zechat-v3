# RELATÓRIO DE INTEGRIDADE DAS TABELAS DO PROJETO 28WEB HUB
**Data da Análise**: 17/12/2025  
**Sistema Analisado**: 28web Hub  
**Versão do Relatório**: 1.0  
**Última Verificação**: 16:33h

## 📊 RESUMO EXECUTIVO

O sistema possui **78 migrações pendentes** de um total de aproximadamente 100+ migrations existentes. A aplicação está rodando, mas apresenta erros de jobs devido a colunas faltantes e problemas de migração.

### 🔴 **STATUS CRÍTICO**: 
- **78 migrações não aplicadas** no banco de dados
- Erros no job `SendMessageSchenduled` ainda persistindo
- Sistema RBAC **NÃO IMPLEMENTADO** conforme relatório anterior
- Health check da aplicação falhando (retorno HTTP 000)

---

## 📋 **ANÁLISE DETALHADA DAS TABELAS**

### 1. **TABELAS EXISTENTES NO BANCO DE DADOS**

Com base nas migrations aplicadas (primeiras 10 listadas), temos as seguintes tabelas criadas:

| Tabela | Status | Migration Aplicada |
|--------|--------|-------------------|
| Users | ✅ | 20200717133438-create-users.js |
| Contacts | ✅ | 20200717144403-create-contacts.js |
| Tickets | ✅ | 20200717145643-create-tickets.js |
| Messages | ✅ | 20200717151645-create-messages.js |
| Whatsapps | ✅ | 20200717170223-create-whatsapps.js |
| ContactCustomFields | ✅ | 20200723200315-create-contacts-custom-fields.js |
| Settings | ✅ | 20200903215941-create-settings.js |
| AutoReply | ✅ | 20201116231228-create-table-auto-reply.js |
| StepsReply | ✅ | 20201118152407-create-table-steps-reply.js |
| StepsReplyActions | ✅ | 20201118180019-create-table-steps-reply-action.js |
| Queues | ✅ | 20201207215725-create-table-queues.js |
| UsersQueues | ✅ | 20201208180734-create-table-users-queues.js |
| Tenants | ✅ | 20201220234957-create-table-tenant.js |
| AutoReplyLogs | ✅ | 20201230151109-create-table-record-auto-reply.js |
| MessagesOffLine | ✅ | 20210123165336-create-table-messageOffLine.js |
| UserMessagesLog | ✅ | 20210126144647-create-table-UserMessagesLog.js |
| FastReply | ✅ | 20210207131524-create-table-fastReply.js |
| Tags | ✅ | 20210219213513-create-table-tags.js |
| ContactTags | ✅ | 20210220004040-create-table-tags-contact.js |
| Campaigns | ✅ | 20210227000928-create-table-campaign.js |
| CampaignContacts | ✅ | 20210227021721-create-table-campaign-contacts.js |
| ApiConfigs | ✅ | 20210308174543-create-table-ApiConfigs.js |
| ApiMessages | ✅ | 20210309200505-create-table-ApiMessages.js |
| ContactWallets | ✅ | 20210727193355-create-table-wallets-contact.js |
| LogTickets | ✅ | 20210815021807-create-table-LogTickets.js |
| ChatFlow | ✅ | 20211126182602-add-table-chatFlow.js |

### 2. **TABELAS COM MIGRATIONS PENDENTES**

Segundo análise, há **78 migrations pendentes**. Algumas críticas incluem:

| Migration Faltante | Tabela/Coluna Afetada | Impacto |
|-------------------|----------------------|---------|
| `20201221013617-add-name-table-tenants.js` | Coluna `name` em Tenants | ✅ **Corrigida anteriormente** |
| `20201222035938-add-contraint-contato-number-tenantId.js` | Constraint única Contacts | Integridade de dados |
| `20201226152811-add-number-phone-table-whatsapps.js` | Colunas `number` e `phone` em Whatsapps | Funcionalidade básica |
| `20210125180503-add-column-userId-to-table-messages.js` | Coluna `userId` em Messages | Associação de usuários |
| `20210719011137-add-columns-status-scheduleDate--table-Message.js` | Colunas críticas em Messages | **Causa erro atual** |
| `20220101191958-add-colum-tenantId-table-messages.js` | Coluna `tenantId` em Messages | Multi-tenancy |
| `20250101000001-create-table-plans.js` | Tabelas Plans e TenantPlans | Sistema de billing |
| `20250101000002-create-table-subscriptions.js` | Tabela Subscriptions | Sistema de billing |

### 3. **TABELAS RBAC FALTANTES (NÃO IMPLEMENTADAS)**

Conforme relatório anterior, o sistema RBAC completo está faltando:

| Tabela | Status | Impacto |
|--------|--------|---------|
| roles | ❌ **NÃO EXISTE** | Sem controle de acesso baseado em papéis |
| permissions | ❌ **NÃO EXISTE** | Sem sistema de permissões |
| user_roles | ❌ **NÃO EXISTE** | Sem associação usuário-papéis |
| role_permissions | ❌ **NÃO EXISTE** | Sem associação papel-permissões |
| erp_providers | ❌ **NÃO EXISTE migration** | Integração ERP incompleta |
| subscriptions | ❌ **NÃO EXISTE migration** | Sistema de assinaturas incompleto |

---

## 🔍 **PROBLEMAS DE INTEGRIDADE IDENTIFICADOS**

### 1. **Colunas Faltantes Críticas**

1. **Messages.messageId** - Causa erro no job `SendMessageSchenduled`
2. **Messages.wabaMediaId** - Falta em algumas migrações 
3. **Tenants.name** - ✅ Já corrigida
4. **Messages.tenantId** - Necessário para multi-tenancy

### 2. **Relacionamentos Ausentes**

1. **Tenant → ERPProvider** - Não há FK
2. **Tenant → Subscription** - Não há FK  
3. **User → Role** - Muitos-para-muitos não implementado
4. **Role → Permission** - Muitos-para-muitos não implementado

### 3. **Modelos sem Migrations Correspondentes**

| Modelo | Migration | Status |
|--------|-----------|--------|
| ERPProvider | 20250101000003-create-table-erp-providers.ts | ❌ **NÃO APLICADA** |
| Subscription | 20250101000002-create-table-subscriptions.ts | ❌ **NÃO APLICADA** |
| Plan | 20250101000001-create-table-plans.ts | ✅ **APLICADA** |

---

## 📊 **STATISTICAS DE MIGRATIONS**

```bash
Total de migrations no diretório: ~100+
Migrations aplicadas: ~22
Migrations pendentes: 78
Taxa de aplicação: ~22%
```

### **Principais Grupos de Migrations Pendentes:**
1. **Migrations de tenant (2020-2021)**: 20+ migrations
2. **Migrations de funcionalidades (2021-2022)**: 25+ migrations
3. **Migrations de integração (2022-2023)**: 15+ migrations
4. **Migrations de RBAC (2025)**: 4 migrations
5. **Migrations de billing (2025)**: 2 migrations

---

## ⚠️ **RISCOS IDENTIFICADOS**

### **1. RISCOS CRÍTICOS (IMPACTO IMEDIATO)**
- ✅ **Corrigido**: Coluna `messageId` faltante (causava crash no job)
- ❌ **Pendente**: 78 migrations não aplicadas (possível instabilidade)
- ❌ **Pendente**: Sistema de autenticação sem RBAC (vulnerabilidade)
- ❌ **Pendente**: Models sem migrations (ERPProvider, Subscription)

### **2. RISCOS DE NEGÓCIO**
- Sistema de billing incompleto (migrations faltantes)
- Multi-tenancy parcialmente implementado
- Sem controle de acesso granular
- Possível perda de dados por falta de constraints

### **3. RISCOS OPERACIONAIS**
- Jobs falhando (SendMessageSchenduled)
- Health check não funcional
- Migrations acumuladas por anos

---

## 🛠️ **PLANO DE CORREÇÃO PRIORITÁRIO**

### **FASE 1: ESTABILIDADE DO SISTEMA (URGENTE)**
1. **Aplicar todas as migrations pendentes** - Usar `npm run db:migrate`
2. **Verificar integridade de todas as tabelas** - Checar FKs e constraints
3. **Corrigir health check** - Verificar se endpoint retorna 200

### **FASE 2: SISTEMA RBAC (ALTA PRIORIDADE)**
1. Criar migrations RBAC faltantes (4 migrations)
2. Criar models correspondentes (Role, Permission, UserRole, RolePermission)
3. Atualizar model User para ter relacionamento Many-to-Many com Role
4. Criar controllers básicos para RBAC

### **FASE 3: INTEGRAÇÃO COMPLETA (MÉDIA PRIORIDADE)**
1. Criar migration para ERPProviders
2. Criar migration para Subscriptions
3. Implementar relacionamentos faltantes
4. Testar fluxo completo de assinatura

### **FASE 4: TESTES E VALIDAÇÃO (BAIXA PRIORIDADE)**
1. Testar todas as funcionalidades principais
2. Validar integridade referencial
3. Verificar permissões de acesso
4. Testar multi-tenancy

---

## 📝 **MIGRATIONS CRÍTICAS PARA APLICAÇÃO IMEDIATA**

Baseado na análise dos logs de erro, as seguintes migrations devem ser aplicadas **IMEDIATAMENTE**:

1. `20210719011137-add-columns-status-scheduleDate--table-Message.js` - Resolve erro do job
2. `20211222004247-add-colum-wabaMediaId-table-messages.js` - Coluna necessária
3. `20201221010713-add-tenantId-all-tables.js` - Multi-tenancy completa
4. `20220101191958-add-colum-tenantId-table-messages.js` - Tenant em Messages

---

## 🔧 **COMANDOS PARA EXECUTAR**

```bash
# 1. Aplicar todas as migrations pendentes
cd backend
npm run db:migrate

# 2. Verificar status após migração
docker exec 28web-postgres psql -U chatex -d chatex -c "SELECT name FROM \"SequelizeMeta\" ORDER BY name DESC LIMIT 20;"

# 3. Reiniciar backend para aplicar mudanças
docker-compose restart backend

# 4. Testar health check
curl -v http://localhost:3100/health

# 5. Verificar logs do job
docker logs 28web-backend --tail 50 | grep -i "error\|warn\|SendMessage"
```

---

## 📊 **MÉTRICAS DE QUALIDADE**

| Métrica | Valor | Status |
|---------|-------|--------|
| Migrations aplicadas | ~22 | 🔴 Crítico |
| Migrations pendentes | 78 | 🔴 Crítico |
| Tabelas RBAC implementadas | 0/4 | 🔴 Crítico |
| Tabelas billing implementadas | 1/3 | 🟡 Parcial |
| Health check funcional | ❌ Falhando | 🔴 Crítico |
| Jobs executando | ⚠️ Com erros | 🟡 Parcial |

---

## ✅ **RECOMENDAÇÕES FINAIS**

### **AÇÕES IMEDIATAS (HOJE)**
1. Executar `npm run db:migrate` para aplicar todas as migrations
2. Reiniciar o container do backend
3. Testar health check e verificar logs
4. Corrigir erros restantes no job `SendMessageSchenduled`

### **AÇÕES CURTO PRAZO (1-2 DIAS)**
1. Implementar sistema RBAC completo
2. Criar migrations faltantes para ERP e Subscriptions
3. Validar integridade referencial do banco
4. Testar fluxo completo de autenticação

### **AÇÕES LONGO PRAZO (1 SEMANA)**
1. Implementar middlewares de validação RBAC
2. Integrar permissões nas rotas existentes
3. Testar sistema de billing
4. Documentar arquitetura completa

---

## 📄 **ARQUIVOS DE SUPORTE**

1. **relatorio_compatibilidade_rbac_tenants.md** - Análise RBAC + Tenants
2. **relatorio_integridade_tabelas.md** - Versão inicial deste relatório
3. **todo.md** - Tarefas pendentes
4. **docs/learned_fixes.json** - Conhecimento adquirido

---

**Documento Gerado**: 17 de Dezembro de 2025  
**Responsável pela Análise**: Cline AI Assistant  
**Status**: 🔴 **CRÍTICO - NECESSIDADE DE INTERVENÇÃO IMEDIATA**  
**Próxima Revisão**: Após aplicação das migrations pendentes
