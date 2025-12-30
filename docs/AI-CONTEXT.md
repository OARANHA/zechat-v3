# 28web AI Context - Evolution API Migration

**Data:** 28 de Dezembro de 2025  
**Status:** Em Andamento  
**Prioridade:** CRÍTICA

---

## 📋 Visão Geral

O projeto **28web** (saas de comunicação multi-canal) está migrando do **WhatsApp Gateway legado** para a **Evolution API v2.2.3** como solução primária de WhatsApp.

**Estrutura:** Backend Express.js + Frontend Vue 3/Quasar + Docker Compose com Evolution API, PostgreSQL, Redis

---

## 🎯 Objetivos da Migração

1. ✅ Backend inicia SEM crash
2. ✅ QR Code gera corretamente
3. ✅ WhatsApp conecta via Evolution
4. ✅ Webhooks processam eventos (QRCODE_UPDATED, CONNECTION_UPDATE, MESSAGES_UPSERT)
5. ✅ Compatibilidade com sistema multi-tenant existente

---

## ⚙️ Stack Técnico Atual

### Infra (docker-compose.yml)
```yaml
Services:
- nginx (proxy reverso, porta 80/443)
- backend (Express.js, porta 3100)
- frontend-dev (Quasar dev server, porta 3000) 
- evolution-api (v2.2.3, porta 8080)
- postgres (15-alpine, porta 5432)
- redis (7-alpine, porta 6379)
- prometheus (metrics)
- grafana (dashboards)
- rabbitmq (message queue)

Network: 28web-network (bridge)
```

### Backend
- **Framework:** Express.js + TypeScript
- **ORM:** Sequelize (PostgreSQL)
- **Cache:** Redis
- **Estrutura:** Controllers → Services → Providers
- **Provider WhatsApp:** `WhatsAppProvider.ts` (interface `IChannelProvider`)

### Frontend
- **Framework:** Vue 3 + Quasar (Material Design)
- **State:** Pinia
- **HTTP Client:** Axios
- **Página:** `src/pages/sessaoWhatsapp/Index.vue` (gerencia sessões)
- **API:** `src/api/sessoesWhatsapp.js` (cliente REST)

---

## 🔧 Configuração Atual (docker-compose.yml)

### Backend Environment
```env
NODE_ENV=development
BACKEND_URL=http://backend:3100
USE_EVOLUTION_API=true
EVOLUTION_API_URL=http://evolution-api:8080
EVOLUTION_API_AUTH_TYPE=apikey
EVOLUTION_API_KEY=${EVOLUTION_API_KEY}
FRONTEND_URL=http://nginx:80

# Removidos (legacy):
# WHATSAPP_GATEWAY_URL (deletado)
# WHATSAPP_GATEWAY_API_KEY (deletado)

DB_HOST=postgres
DB_PORT=5432
DB_USER=chatex
DB_PASS=chatex
DB_NAME=chatex
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=chatex
```

### Evolution API Environment
```env
SERVER_URL=http://evolution-api:8080
AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=${EVOLUTION_DATABASE_URL}

# CRÍTICO: Webhooks para backend
WEBHOOK_GLOBAL_URL=http://backend:3100/api/webhook/evolution
WEBHOOK_GLOBAL_ENABLED=true
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false  # ← IMPORTANTE: false!
GLOBAL_WEBHOOK_EVENTS=connection.update,QRCODE_UPDATED,MESSAGES_UPSERT
WEBHOOK_EVENTS_QRCODE_UPDATED=true

# Cache & Database
REDIS_URI=redis://:chatex@redis:6379
CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://:chatex@redis:6379/1
```

### .env (raiz)
```env
EVOLUTION_API_KEY=467b9ca6680621bfa5350c221ef452c71eb07109ee9a3597cd85890c8d0fde8f
EVOLUTION_DATABASE_URL=postgresql://chatex:chatex@postgres:5432/chatex
```

---

## 🚨 Problemas Encontrados & Soluções

### 1. **WHATSAPP_GATEWAY_URL sempre validado** ❌
**Problema:** `WhatsAppProvider.ts` L36 sempre valida `WHATSAPP_GATEWAY_URL` no constructor, causando crash mesmo com `USE_EVOLUTION_API=true`

**Stack Trace:**
```
WhatsAppSessionController.update → SyncContactsGatewayService → WhatsAppProvider
Error: WHATSAPP_GATEWAY_URL inválida. Defina uma URL com protocolo... (vazio)
```

**Solução (Rovo implementou):**
```typescript
// WhatsAppProvider.ts - Constructor
private constructor() {
  if (process.env.USE_EVOLUTION_API === 'true') {
    this.isEvolutionMode = true;
    this.httpEvolution = axios.create({
      baseURL: process.env.EVOLUTION_API_URL,
      headers: { 'apikey': process.env.EVOLUTION_API_KEY }
    });
    logger.info('✅ WhatsAppProvider: Evolution API mode enabled');
    return; // Pula validação gateway antigo
  }
  
  // Código gateway antigo (fallback)
  const raw = process.env.WHATSAPP_GATEWAY_URL || "";
  // ... resto da validação
}
```

### 2. **WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=true** ❌
**Problema:** Quando habilitado, Evolution manda webhooks em URLs diferentes por evento:
- `POST /api/webhook/evolution/qrcode-updated`
- `POST /api/webhook/evolution/connection-update`
- `POST /api/webhook/evolution/messages-upsert`

Exige N rotas diferentes no backend.

**Solução:** Configurar `WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false`

Com `false`, TODOS eventos vão para **UM ÚNICO endpoint:**
```
POST /api/webhook/evolution
Payload: { "event": "QRCODE_UPDATED", "instanceKey": "...", "data": {...} }
```

### 3. **Frontend 404 no QR Code** ❌
**Problema:** `sessoesWhatsapp.js` L32 chama URL legacy:
```javascript
PUT http://localhost/api/whatsapp-sessions/whatsappsession/42  ← 404!
```

**Esperado:**
```javascript
PUT http://localhost/api/whatsapp-sessions/42
```

**Solução:** Rovo adicionou alias legacy no `whatsappSessionRoutes.ts`:
```typescript
// Nova rota Evolution
router.put('/:whatsappId', controller.update);

// Legacy (compatibilidade frontend)
router.put('/whatsappsession/:whatsappId', controller.update);
```

### 4. **Health Check Evolution 404** ❌
**Problema:** Evolution v2.2.3 não tem endpoint `/health`

**Teste correto:**
```bash
curl -f http://evolution-api:8080/  # Retorna JSON welcome message
```

---

## 📡 Endpoints Evolution API v2.2.3

### Instâncias
```
POST   /manager/instances/{instanceKey}
PUT    /manager/instances/{instanceKey}
GET    /manager/instances/{instanceKey}
DELETE /manager/instances/{instanceKey}
POST   /manager/instances/{instanceKey}/disconnect
```

### Status/Estado
```
GET /instance/connectionState/{instanceKey}
```

### Webhooks (por instância)
```
POST /manager/instances/{instanceKey}/webhook
```

### Mensagens
```
POST /message/sendText/{instanceKey}/{number}
POST /message/sendMedia/{instanceKey}/{number}
```

### Documentação Oficial
https://doc.evolution-api.com/v2/pt

---

## 🔌 Webhook Evolution → Backend

### Configuração Automática (em `createSessionEvolution`)
```typescript
await this.setInstanceWebhook(instanceKey, {
  url: `${backendBase}/api/webhook/evolution`,
  byEvents: false,
  base64: true,
  headers: { "Content-Type": "application/json" },
  events: ["QRCODE_UPDATED", "CONNECTION_UPDATE", "MESSAGES_UPSERT"]
});
```

### Eventos Processados
```
QRCODE_UPDATED → Salvar QR Code, notificar frontend via WebSocket
CONNECTION_UPDATE → Atualizar status sessão (connected/disconnected)
MESSAGES_UPSERT → Criar Message no banco, abrir ticket, business logic
```

### Endpoint Backend
```
POST /api/webhook/evolution

Payload genérico:
{
  "event": "QRCODE_UPDATED|CONNECTION_UPDATE|MESSAGES_UPSERT",
  "instanceKey": "minha-instancia",
  "data": { ... event-specific data ... }
}
```

---

## 📝 Arquivos Principais a Ajustar

### Backend (`backend/src/`)

#### 1. `providers/WhatsAppProvider.ts` (CRÍTICO)
- ✅ **Status:** Rovo já ajustou
- **Mudanças:**
  - Constructor com verificação `USE_EVOLUTION_API`
  - Método `createSessionEvolution()` com suporte a endpoints Evolution
  - Método `setInstanceWebhook()` para configurar webhooks por instância
  - Fallback para gateway antigo se `USE_EVOLUTION_API=false`

#### 2. `routes/whatsappSessionRoutes.ts`
- **Mudanças necessárias:**
  - Adicionar alias legacy: `router.put('/whatsappsession/:whatsappId', ...)`
  - Garantir rota evolution padrão: `router.put('/:whatsappId', ...)`

#### 3. `routes/webhookRoutes.ts` (NOVO)
- **Criar arquivo:**
  ```typescript
  POST /api/webhook/evolution
  ```
- Handler genérico que roteia por `event.type`

#### 4. `controllers/WebhookController.ts` (NOVO)
- Processar payload Evolution
- Rotear por tipo de evento (QRCODE_UPDATED, CONNECTION_UPDATE, MESSAGES_UPSERT)
- Responder sempre 200 OK

#### 5. `services/EvolutionWebhookService.ts` (NOVO)
- `handleQrCodeUpdated()` → Salvar QR, notificar frontend
- `handleConnectionUpdate()` → Atualizar status sessão
- `handleMessagesUpsert()` → Criar Message, business logic

### Frontend (`frontend/src/`)

#### 1. `api/sessoesWhatsapp.js`
- **Status:** Está usando URLs corretas após alias legacy
- Endpoints:
  - `POST /api/whatsapp-sessions` (criar)
  - `PUT /api/whatsapp-sessions/{id}` (atualizar QR)
  - `GET /api/whatsapp-sessions` (listar)
  - `DELETE /api/whatsapp-sessions/{id}` (deletar)

#### 2. `pages/sessaoWhatsapp/Index.vue`
- **WebSocket listeners** para eventos de QR Code
- Atualização de UI baseado em status (connecting → connected)

---

## 🧪 Teste End-to-End

### 1. Backend Inicia OK
```bash
docker compose up -d --force-recreate backend evolution-api
docker compose logs backend --tail=20
# Não deve ter erros de WHATSAPP_GATEWAY_URL
```

### 2. Evolution Está Healthy
```bash
docker compose exec backend curl -f http://evolution-api:8080/
# Retorna: { "status": 200, "message": "Welcome...", "version": "2.2.3" }
```

### 3. Criar Instância WhatsApp
```bash
curl -X POST "http://localhost:3100/api/whatsapp-sessions" \
  -H "Content-Type: application/json" \
  -d '{"whatsappId": "teste-evolution-001"}'

# Response esperado: 201 Created com sessionId, status, qrCode
```

### 4. Ativar QR Code
```bash
curl -X PUT "http://localhost:3100/api/whatsapp-sessions/teste-evolution-001" \
  -H "Content-Type: application/json" \
  -d '{"isQrcode": true}'

# Response: QR Code base64 ou em logs
```

### 5. Escanear QR no Frontend
- Navegar para "Canais" → "WhatsApp"
- Clicar "Gerar QR Code"
- Escanear com WhatsApp

### 6. Webhook Dispara
```bash
docker compose logs evolution-api --tail=20
# Deve mostrar: "QRCODE_UPDATED" e webhook sendo enviado

docker compose logs backend --tail=20
# Deve mostrar: POST /api/webhook/evolution recebido (200 OK)
```

### 7. Status Conectado
```bash
# Após escanear e conectar
curl -X GET "http://localhost:3100/api/whatsapp-sessions/teste-evolution-001"
# Status deve mudar: qr_code → connected
```

---

## 🔄 Fluxo Atual (Architecture)

```
Frontend (Vue 3)
    ↓
    POST /api/whatsapp-sessions
    ↓
Backend (Express.js)
    ↓ (routed)
WhatsAppSessionController.create()
    ↓ (uses)
WhatsAppProvider.createSessionEvolution()
    ↓ (calls)
Evolution API: POST /manager/instances/{key}
    ↓ (webhook callback)
Evolution API: POST http://backend:3100/api/webhook/evolution
    ↓ (routed)
WebhookController.handleEvolutionWebhook()
    ↓ (routed by event type)
    ├─ QRCODE_UPDATED → handleQrCode()
    ├─ CONNECTION_UPDATE → handleConnection()
    └─ MESSAGES_UPSERT → handleMessage()
    ↓
Backend DB (update session, create message)
    ↓
Frontend (WebSocket listener) ← QR Code atualizado
```

---

## 📊 Status da Migração

| Componente | Status | Notas |
|-----------|--------|-------|
| docker-compose.yml | ✅ OK | Evolution vars + webhook correto |
| .env | ✅ OK | EVOLUTION_API_KEY definida |
| WhatsAppProvider.ts | ✅ OK | Rovo: modo Evolution implementado |
| whatsappSessionRoutes.ts | ⚠️ Ajuste | Adicionar alias legacy |
| webhookRoutes.ts | ❌ TODO | Criar rota /api/webhook/evolution |
| WebhookController.ts | ❌ TODO | Processar eventos |
| Frontend sessoesWhatsapp.js | ✅ OK | URLs funcionam com alias |
| Frontend Index.vue | ⚠️ Validar | WebSocket listeners |

---

## 🚀 Próximos Passos

### Imediatos (TODAY)
1. Rovo: Ajustar `whatsappSessionRoutes.ts` (adicionar alias)
2. Rovo: Criar `webhookRoutes.ts` + `WebhookController.ts`
3. Testar E2E: criar instância → gerar QR → escanear

### Curto Prazo
1. Refinar MESSAGES_UPSERT (processar mídias, grupos)
2. Implementar business logic de tickets
3. Adicionar retry logic para webhooks

### Médio Prazo
1. Performance testing com múltiplas instâncias
2. Documentar no Confluence
3. Treinar equipe
4. Migrar instâncias de produção

---

## 📚 Referências

- **Evolution API Docs:** https://doc.evolution-api.com/v2/pt
- **Webhooks Config:** https://doc.evolution-api.com/v2/pt/configuration/webhooks
- **GitHub Evolution:** https://github.com/EvolutionAPI/evolution-api
- **Conversa Completa:** `conversa_zechat.md` (no projeto)

---

## 🎯 Definições Chave

- **Evolution API:** Nova solução WhatsApp (v2.2.3) - mais estável que gateway legado
- **instanceKey:** Identificador único da sessão WhatsApp (ex: "tenant-123-whatsapp-1")
- **WEBHOOK_BY_EVENTS=false:** Envia todos webhooks em 1 URL, roteia por `event.type`
- **IChannelProvider:** Interface que padroniza provedores (WhatsApp, Telegram, etc)
- **Fallback:** Se Evolution falhar, código tenta gateway antigo automaticamente

---

## ⚡ Quick Commands

```bash
# Ver status geral
docker compose ps

# Logs backend
docker compose logs -f backend --tail=50

# Logs Evolution
docker compose logs -f evolution-api --tail=50

# Teste saúde
docker compose exec backend curl -f http://localhost:3100/health
docker compose exec backend curl -f http://evolution-api:8080/

# Verifique vars no backend
docker compose exec backend env | grep EVOLUTION

# Restart backend
docker compose down backend && docker compose up -d backend

# Rebuild + restart tudo
docker compose up -d --build --force-recreate
```

---

## 👤 Responsáveis

- **Rovo:** Desenvolvimento backend (WhatsAppProvider, controllers)
- **Você:** QA, orquestração, integração Evolution
- **Stack:** Dev full-stack + DevOps

---

**Última atualização:** 2025-12-29 05:00 -03  
**Versão:** 1.0  
**Confidencial:** Sim (28web interno)
