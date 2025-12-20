---

## 📋 SUMÁRIO EXECUTIVO

Implementação de um sistema RBAC (Role-Based Access Control) com suporte a Multi-Tenant no 28web Hub. O sistema permite que Super Admins gerenciem múltiplas empresas (Tenants) com isolamento completo de dados, além de integração com providers ERP para cobrança de assinaturas SaaS.

## 1. INTRODUÇÃO

O 28web Hub é uma plataforma que permite que diferentes empresas (Tenants) utilizem serviços de forma isolada. Cada Tenant tem seu próprio conjunto de usuários, permissões e dados. Além disso, o sistema suporta integração com diferentes providers ERP para gerenciar cobranças e vendas de forma eficiente.

## 2. REQUISITOS

- Node.js v18+
- PostgreSQL v14+
- Conhecimento básico de TypeScript e Sequelize

## 3. ARQUITETURA

### 3.1 Modelos

- **Tenant**: Representa uma empresa cliente.
- **User**: Representa um usuário dentro de um Tenant.
- **Role**: Representa uma função dentro de um Tenant.
- **Permission**: Representa uma permissão dentro de um Tenant.
- **UserRole**: Ligação entre User e Role.
- **RolePermission**: Ligação entre Role e Permission.

### 3.2 Relacionamentos

- **Tenant** 1:N **User**
- **Tenant** 1:N **Role**
- **Tenant** 1:N **Permission**
- **User** N:N **Role** (via UserRole)
- **Role** N:N **Permission** (via RolePermission)

## 4. MODELOS DE USUÁRIO, ROLE E PERMISSION

### 4.1 Model: Tenant

**Arquivo**: `backend/src/models/Tenant.ts`

Define uma empresa cliente.

**Tabela**: `Tenants`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `name` | VARCHAR(255) | Nome da empresa |
| `status` | ENUM | 'active'\|'inactive'\|'archived' |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

### 4.2 Model: User

**Arquivo**: `backend/src/models/User.ts`

Define um usuário dentro de um Tenant.

**Tabela**: `Users`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `tenantId` | INTEGER (FK) | Qual tenant o usuário pertence |
| `email` | VARCHAR(255) | Email do usuário |
| `name` | VARCHAR(255) | Nome do usuário |
| `password` | TEXT | Senha criptografada |
| `status` | ENUM | 'active'\|'inactive'\|'archived' |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

### 4.3 Model: Role

**Arquivo**: `backend/src/models/Role.ts`

Define uma função dentro de um Tenant.

**Tabela**: `Roles`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `tenantId` | INTEGER (FK) | Qual tenant a role pertence |
| `name` | VARCHAR(255) | Nome da função |
| `status` | ENUM | 'active'\|'inactive'\|'archived' |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

### 4.4 Model: Permission

**Arquivo**: `backend/src/models/Permission.ts`

Define uma permissão dentro de um Tenant.

**Tabela**: `Permissions`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `tenantId` | INTEGER (FK) | Qual tenant a permissão pertence |
| `name` | VARCHAR(255) | Nome da permissão |
| `status` | ENUM | 'active'\|'inactive'\|'archived' |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

### 4.5 Model: UserRole (Ligação)

**Arquivo**: `backend/src/models/UserRole.ts`

Define a relação entre User e Role.

**Tabela**: `UserRoles`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `userId` | INTEGER (FK) | Qual usuário |
| `roleId` | INTEGER (FK) | Qual função |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

### 4.6 Model: RolePermission (Ligação)

**Arquivo**: `backend/src/models/RolePermission.ts`

Define a relação entre Role e Permission.

**Tabela**: `RolePermissions`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `roleId` | INTEGER (FK) | Qual função |
| `permissionId` | INTEGER (FK) | Qual permissão |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

## 5. CONTROLLERS

### 5.1 TenantController

**Arquivo**: `backend/src/controllers/TenantController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/tenants` | Criar Tenant |
| GET | `/api/tenants` | Listar Tenants |
| GET | `/api/tenants/:id` | Detalhe de Tenant |
| PUT | `/api/tenants/:id` | Atualizar Tenant |
| DELETE | `/api/tenants/:id` | Deletar Tenant |

### 5.2 UserController

**Arquivo**: `backend/src/controllers/UserController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/users` | Criar User |
| GET | `/api/users` | Listar Users |
| GET | `/api/users/:id` | Detalhe de User |
| PUT | `/api/users/:id` | Atualizar User |
| DELETE | `/api/users/:id` | Deletar User |

### 5.3 RoleController

**Arquivo**: `backend/src/controllers/RoleController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/roles` | Criar Role |
| GET | `/api/roles` | Listar Roles |
| GET | `/api/roles/:id` | Detalhe de Role |
| PUT | `/api/roles/:id` | Atualizar Role |
| DELETE | `/api/roles/:id` | Deletar Role |

### 5.4 PermissionController

**Arquivo**: `backend/src/controllers/PermissionController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/permissions` | Criar Permission |
| GET | `/api/permissions` | Listar Permissions |
| GET | `/api/permissions/:id` | Detalhe de Permission |
| PUT | `/api/permissions/:id` | Atualizar Permission |
| DELETE | `/api/permissions/:id` | Deletar Permission |

### 5.5 UserRoleController

**Arquivo**: `backend/src/controllers/UserRoleController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/user-roles` | Criar UserRole |
| GET | `/api/user-roles` | Listar UserRoles |
| DELETE | `/api/user-roles/:id` | Deletar UserRole |

### 5.6 RolePermissionController

**Arquivo**: `backend/src/controllers/RolePermissionController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/role-permissions` | Criar RolePermission |
| GET | `/api/role-permissions` | Listar RolePermissions |
| DELETE | `/api/role-permissions/:id` | Deletar RolePermission |

## 6. MIDDLEWARES

### 6.1 TenantValidator

**Arquivo**: `backend/src/middlewares/TenantValidator.ts`

Valida se o Tenant existe e está ativo.

### 6.2 RoleValidator

**Arquivo**: `backend/src/middlewares/RoleValidator.ts`

Valida se a Role existe e está ativa.

### 6.3 PermissionValidator

**Arquivo**: `backend/src/middlewares/PermissionValidator.ts`

Valida se a Permission existe e está ativa.

### 6.4 AuthMiddleware

**Arquivo**: `backend/src/middlewares/AuthMiddleware.ts`

Autentica o usuário e verifica se ele tem permissão para acessar o recurso.

## 7. AUTHENTICATION

### 7.1 JWT Authentication

**Arquivo**: `backend/src/auth/JwtAuth.ts`

Gerencia a autenticação via JWT (JSON Web Tokens).

### 7.2 AuthService

**Arquivo**: `backend/src/services/AuthService.ts`

Lógica de autenticação e criação de tokens.

## 8. VALIDATIONS

### 8.1 UserValidation

**Arquivo**: `backend/src/validations/UserValidation.ts`

Valida os dados de entrada para criação e atualização de usuários.

### 8.2 RoleValidation

**Arquivo**: `backend/src/validations/RoleValidation.ts`

Valida os dados de entrada para criação e atualização de roles.

### 8.3 PermissionValidation

**Arquivo**: `backend/src/validations/PermissionValidation.ts`

Valida os dados de entrada para criação e atualização de permissões.

## 9. INTEGRAÇÃO COM PROVIDERS ERP

### 9.1 Interface IERPProvider

**Arquivo**: `backend/src/interfaces/IERPProvider.ts`

Define o contrato base que todo provider de ERP deve seguir.

**Interfaces Definidas**:

#### `CreateInvoiceData`
Dados para criar uma fatura/cobrança recorrente:
```

```

#### `InvoiceResponse`
Resposta após criar fatura:
```

```

#### `InvoiceStatus`
Status de uma fatura:
```

```

#### `CreateSaleData`
Dados para criar uma venda:
```

```

#### `SaleResponse` e `SaleStatus`
Respostas de vendas (análogo a invoices)

#### `IERPProvider` (Interface Principal)
```


```

### 9.2 Model: ERPProvider

**Arquivo**: `backend/src/models/ERPProvider.ts`

Armazena configurações de integração com ERPs externos (uma por tenant)

**Tabela**: `erp_providers`

| Campo | Tipo | Descrição | Padrão |
|-------|------|-----------|--------|
| `id` | INTEGER | ID primário | AUTO |
| `tenantId` | INTEGER (FK) | Tenant que configurou | - |
| `providerType` | ENUM | Tipo de ERP | - |
| `apiKey` | TEXT | Chave de API criptografada | - |
| `webhookSecret` | TEXT | Secret para validar webhooks | - |
| `webhookUrl` | VARCHAR | URL para receber eventos do ERP | - |
| `status` | ENUM | 'active'\|'inactive'\|'error' | 'inactive' |
| `errorMessage` | TEXT | Mensagem de erro se falhar | NULL |
| `lastSync` | TIMESTAMP | Último sincronismo bem-sucedido | NULL |
| `config` | JSON | Configurações adicionais | NULL |
| `createdAt` | TIMESTAMP | Criação | AUTO |
| `updatedAt` | TIMESTAMP | Última atualização | AUTO |

**ENUM providerType**:
- `'vendaerp'` - VENDAERP (implementado ✅)
- `'bling'` - Bling ERP (futuro)
- `'omie'` - Omie (futuro)
- `'mercadopago'` - MercadoPago (futuro)

**Getters**:
- `isActive`: Retorna true se status='active' e sem erros

**Relacionamentos**:
- BelongsTo Tenant

### 9.3 Implementation: VendaERPProvider

**Arquivo**: `backend/src/providers/VendaERPProvider.ts`

Implementação concreta da interface `IERPProvider` para VENDAERP.

**Features**:
- ✅ Validação de API Key
- ✅ Criação de faturas recorrentes
- ✅ Consulta de status de fatura
- ✅ Cancelamento de faturas
- ✅ Reembolsos
- ✅ Criação de vendas
- ✅ Webhook validation com HMAC SHA-256

**Configuração**:
```

```

### 9.4 Factory Pattern: ERPProviderFactory

**Arquivo**: `backend/src/providers/ERPProviderFactory.ts`

Factory para criar instâncias do provider correto baseado no tipo configurado.

```


```

---

## 10. MODELOS DE ASSINATURA E PLANOS

### 10.1 Model: Plan

**Arquivo**: `backend/src/models/Plan.ts`

Define os planos de assinatura disponíveis para todos os tenants.

**Tabela**: `plans`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `name` | VARCHAR(255) | Nome do plano (ex: Free, Professional) |
| `price` | DECIMAL(10,2) | Preço mensal do plano |
| `limits` | JSONB | Limites de recursos (whatsappSessions, messagesPerMonth, etc) |
| `features` | JSONB | Features ativadas neste plano |
| `status` | ENUM | 'active'\|'inactive'\|'archived' |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

**Interface PlanLimits**:
```

```

**Interface PlanFeatures**:
```

```

**Planos Padrão**:

| Plano | Preço | Usuários | Conexões | Mensagens/Mês | Storage |
|-------|-------|----------|----------|----------------|---------|
| Free | $0 | 1 | 1 | 1.000 | 1 GB |
| Professional | $99 | 5 | 3 | 100.000 | 50 GB |
| Enterprise | $499 | Unlimited | Unlimited | Unlimited | 500 GB |

### 10.2 Model: Subscription

**Arquivo**: `backend/src/models/Subscription.ts`

Rastreia assinaturas ativas de cada tenant em planos SaaS.

**Tabela**: `subscriptions`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `tenantId` | INTEGER (FK) | Qual tenant assinou |
| `planId` | INTEGER (FK) | Qual plano está usando |
| `erpProviderId` | INTEGER (FK) | Qual ERP gerencia cobrança |
| `externalInvoiceId` | VARCHAR | ID da fatura no ERP externo |
| `status` | ENUM | 'pending'\|'active'\|'paused'\|'canceled' |
| `amount` | DECIMAL(10,2) | Valor cobrado |
| `currentPeriodStart` | DATE | Início do período atual |
| `currentPeriodEnd` | DATE | Fim do período atual |
| `cancelAtPeriodEnd` | BOOLEAN | Cancelar no final do período? |
| `paidAt` | TIMESTAMP | Quando foi pago |
| `canceledAt` | TIMESTAMP | Quando foi cancelado |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

**Tipo SubscriptionStatus**:
- `'pending'` - Aguardando primeiro pagamento
- `'active'` - Assinatura ativa e paga
- `'paused'` - Pausada temporariamente
- `'canceled'` - Cancelada

**Relacionamentos**:
- BelongsTo Tenant
- BelongsTo Plan
- BelongsTo ERPProvider

**Scopes**:
- `active()` - Apenas assinaturas ativas
- `withRelations()` - Inclui Tenant, Plan, ERPProvider
- `byTenant(tenantId)` - Filtro por tenant

### 10.3 Model: TenantPlan (Ligação)

**Arquivo**: `backend/src/models/Plan.ts` (exporta TenantPlan também)

Histórico de qual plano cada tenant usou (pode ter múltiplas assinaturas ao longo do tempo).

**Tabela**: `tenant_plans`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | ID primário |
| `tenantId` | INTEGER (FK) | Tenant |
| `planId` | INTEGER (FK) | Plano |
| `status` | ENUM | 'active'\|'suspended'\|'cancelled' |
| `subscriptionId` | VARCHAR | ID da assinatura do ERP |
| `currentPeriodStart` | DATE | Quando começou |
| `currentPeriodEnd` | DATE | Quando termina |
| `cancelAtPeriodEnd` | BOOLEAN | Cancelar ao final? |
| `createdAt` | TIMESTAMP | Criação |
| `updatedAt` | TIMESTAMP | Atualização |

---

## 11. CONTROLLERS PARA ERP E ASSINATURA

### 11.1 ERPIntegrationController

**Arquivo**: `backend/src/controllers/ERPIntegrationController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/erp/configure` | Configurar integração ERP |
| GET | `/api/erp/status` | Verificar status da integração |
| POST | `/api/erp/test` | Testar conexão com ERP |
| POST | `/api/erp/disable` | Desativar integração |

**Métodos**:

#### `configureIntegration()`
- Valida API Key com o ERP
- Cria/atualiza registro em `erp_providers`
- Retorna status da configuração

#### `getIntegrationStatus()`
- Retorna dados da integração ativa
- Mostra último sync bem-sucedido

#### `testConnection()`
- Valida API Key
- Atualiza `lastSync`
- Retorna conexão OK/ERRO

#### `disableIntegration()`
- Marca integração como `inactive`
- Futuras cobranças não funcionarão

### 11.2 SubscriptionController

**Arquivo**: `backend/src/controllers/SubscriptionController.ts`

**Endpoints**:

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/subscriptions` | Criar assinatura |
| GET | `/api/subscriptions` | Listar assinaturas do tenant |
| GET | `/api/subscriptions/:id` | Detalhe de assinatura |
| PUT | `/api/subscriptions/:id` | Atualizar assinatura |
| POST | `/api/subscriptions/:id/cancel` | Cancelar assinatura |
| POST | `/api/subscriptions/webhook` | Webhook do ERP |

**Métodos**:

#### `create()`
- Valida plano
- Valida integração ERP
- Chama `CreateSubscriptionService`
- Cria fatura no ERP
- Retorna assinatura criada

#### `list()`
- Lista assinaturas do tenant logado
- Filtra por status

#### `getById(id)`
- Detalhe completo com relacionamentos

#### `update(id, data)`
- Pode alterar plano
- Atualiza valores se necessário

#### `cancel(id)`
- Marca para cancelamento ao final do período
- Opcionalmente cancela imediatamente

#### `webhook()`
- Recebe eventos do ERP (pagamento confirmado, falha, etc)
- Atualiza status de subscription
- Valida assinatura HMAC

---

## 12. SERVIÇOS PARA ASSINATURA

### 12.1 CreateSubscriptionService

**Arquivo**: `backend/src/services/SubscriptionServices/CreateSubscriptionService.ts`

Lógica complexa para criar assinatura:

**Fluxo**:
```
1. Buscar plano por ID
2. Buscar integração ERP ativa do tenant
3. Instanciar provider via Factory
4. Chamar provider.createInvoice()
5. Calcular períodos (30 dias)
6. Verificar se já existe assinatura
7. Criar ou atualizar Subscription
8. Retornar subscription com tokens
```

**Exemplo de uso**:
```


```

---

## 13. ESTRUTURA DE ARQUIVOS

```
backend/src/
├── models/
│   ├── Tenant.ts                    ✨ NOVO
│   ├── Plan.ts                      ✨ NOVO (com TenantPlan)
│   ├── Subscription.ts              ✨ NOVO
│   └── ERPProvider.ts               ✨ NOVO
├── interfaces/
│   └── IERPProvider.ts              ✨ NOVO
├── providers/
│   ├── ERPProviderFactory.ts        ✨ NOVO
│   └── VendaERPProvider.ts          ✨ NOVO
├── controllers/
│   ├── TenantController.ts          ✨ NOVO
│   ├── SubscriptionController.ts    ✨ NOVO
│   └── ERPIntegrationController.ts  ✨ NOVO
├── services/
│   ├── TenantService.ts             ✨ NOVO
│   ├── SubscriptionServices/
│   │   └── CreateSubscriptionService.ts  ✨ NOVO
│   ├── UserServices/
│   │   └── AuthUserService.ts       📝 MODIFICADO
│   └── VerifyBusinessHours.ts       ✨ NOVO
├── database/
│   ├── migrations/
│   │   ├── 20201220234957-create-table-tenant.ts
│   │   ├── 20201221010713-add-tenantId-all-tables.ts
│   │   └── 20250101000001-create-table-plans.ts
│   └── seeds/
│       └── 20200904070005-create-default-users.ts

frontend/src/
├── pages/
│   └── super/
│       ├── SuperEmpresas.vue        ✨ NOVO
│       ├── SuperBilling.vue         ✨ NOVO
│       ├── SuperPlans.vue           ✨ NOVO
│       └── SuperIntegrations.vue    ✨ NOVO
```

## 13. MIGRATIONS NECESSÁRIAS (PENDENTES)

As seguintes migrations ainda precisam ser criadas para suportar os modelos acima:

### 13.1 `20250101000001-create-table-plans.ts` (CRIADA)
✅ Cria tabelas: `plans` e `tenant_plans`

### 13.2 `20250101000002-create-table-subscriptions.ts` (PENDENTE)
Deveria criar:
```
CREATE TABLE `Subscriptions` (
  id SERIAL PRIMARY KEY,
  tenantId INTEGER NOT NULL REFERENCES Tenants(id),
  planId INTEGER NOT NULL REFERENCES plans(id),
  erpProviderId INTEGER REFERENCES erp_providers(id),
  externalInvoiceId VARCHAR(255) UNIQUE,
  status ENUM('pending', 'active', 'paused', 'canceled'),
  amount DECIMAL(10,2),
  currentPeriodStart DATE,
  currentPeriodEnd DATE,
  cancelAtPeriodEnd BOOLEAN DEFAULT false,
  paidAt TIMESTAMP,
  canceledAt TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3 `20250101000003-create-table-erp-providers.ts` (PENDENTE)
Deveria criar:
```sql
CREATE TABLE `ERPProviders` (
  id SERIAL PRIMARY KEY,
  tenantId INTEGER NOT NULL UNIQUE REFERENCES Tenants(id),
  providerType ENUM('vendaerp', 'bling', 'omie', 'mercadopago'),
  apiKey TEXT NOT NULL,
  webhookSecret TEXT NOT NULL,
  webhookUrl VARCHAR(255),
  status ENUM('active', 'inactive', 'error') DEFAULT 'inactive',
  errorMessage TEXT,
  lastSync TIMESTAMP,
  config JSONB,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 14. PRÓXIMAS ETAPAS

- [ ] Testes e2e de login com todos os perfis
- [ ] Testes de isolamento de dados
- [ ] Implementar pagamento/upgrade de planos
- [ ] Dashboard de analytics por tenant
- [ ] Exportação de relatórios por tenant
- [ ] Backup automático por tenant

---

## 15. NOTAS IMPORTANTES

- Todas as operações de banco de dados são feitas usando Sequelize.
- A autenticação é feita usando JWT (JSON Web Tokens).
- O sistema suporta integração com diferentes providers ERP para gerenciar cobranças e vendas.

---

## 16. FLUXO COMPLETO DE ASSINATURA SaaS

```
┌─────────────────────────────────────────────┐
│  1. Tenant acessa página de planos          │
│     GET /api/plans (listar planos)          │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  2. Tenant escolhe um plano                 │
│     POST /api/subscriptions                 │
│     { planId: 2 }                           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  3. CreateSubscriptionService               │
│     - Busca integração ERP do tenant        │
│     - Cria fatura no ERP (VENDAERP)         │
│     - Retorna paymentUrl                    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  4. Frontend redireciona para VENDAERP      │
│     Tenant faz pagamento                    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  5. VENDAERP envia webhook                  │
│     POST /api/subscriptions/webhook         │
│     { invoiceId: "...", status: "paid" }   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  6. Backend atualiza Subscription           │
│     status: 'active'                        │
│     paidAt: NOW()                           │
│     currentPeriodEnd: +30 dias              │
└─────────────────────────────────────────────┘
```

---

## 17. SUMÁRIO DE MUDANÇAS NO BANCO DE DADOS

### ✅ CRIADAS:
- `Tenants` - Nova tabela para multi-tenancy
- `erp_providers` - Configurações de ERP por tenant
- `plans` - Planos de assinatura disponíveis
- `subscriptions` - Rastreamento de assinaturas
- `tenant_plans` - Histórico de planos usados

### ✅ MODIFICADAS (adicionado tenantId):
- `Users`
- `Tickets`
- `Contacts`
- `Messages`
- `Whatsapps`
- `Queues`
- `Settings`
- `AutoReply`

### ⏳ PENDENTES (migrations):
- `20250101000002-create-table-subscriptions.ts`
- `20250101000003-create-table-erp-providers.ts`

---

**Documento Gerado**: 16 de Dezembro de 2025  
**Versão**: 1.0 - COMPLETO  
**Status**: ✅ Relatório Atualizado com Interface + Models + Factory + ERP
**Próxima Ação**: Rodar migrations pendentes e testar fluxo de assinatura
