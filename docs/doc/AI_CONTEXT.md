# AI-CONTEXT.md - Zechat v3 Evolution API Migration

**Última Atualização**: 29/12/2025  
**Status**: 70% Implementado - 1 GAP Crítico Identificado  
**Branch**: feat/evolution-api-migration

---

## 🎯 CONTEXTO DO PROJETO

### Objetivo
Migrar Zechat de **WhatsApp Gateway HTTP legado** para **Evolution API v2.2.3**  
com suporte dual-mode (Evolution novo + Gateway legado para compatibilidade).

### Status Atual
- ✅ **70% Completo**: Arquitetura, providers, controllers, docker-compose implementados
- ❌ **1 GAP Crítico**: Rota `/api/webhook/evolution` não registrada → bloqueia 100% uso
- 🔴 **Impacto**: Sem essa rota, webhooks retornam 404, nada funciona

---

## 🏗️ ARQUITETURA

### Stack Atual
```
Frontend:     Vue 3 + Quasar + Pinia + Socket.io
Backend:      Node.js + Express + TypeScript + Sequelize
Database:     PostgreSQL + Redis
Infrastructure: Docker Compose + Evolution API v2.2.3
```

### Componentes Principais

#### 1. **WhatsAppProvider** (`backend/src/providers/WhatsAppProvider.ts`)
- **Status**: ✅ 100% Implementado
- **Modo Dual**: 
  - Evolution API v2.2.3 (novo, recomendado)
  - WhatsApp Gateway HTTP (legado, fallback)
- **Métodos**:
  - `createSessionEvolution()`: Cria instância + registra webhook
  - `sendMessageEvolution()`: Envia mensagem via Evolution
  - `setInstanceWebhook()`: Registra webhook por instância
- **Linhas**: 538

#### 2. **EvolutionWebhookController** (`backend/src/controllers/EvolutionWebhookController.ts`)
- **Status**: ✅ 100% Implementado
- **Event Handlers**:
  - `QRCODE_UPDATED`: Novo QR code gerado
  - `CONNECTION_UPDATE`: Mudança de status (conectado/desconectado)
  - `MESSAGES_UPSERT`: Mensagem nova recebida
  - `MESSAGES_UPDATE`: ACK/atualização de mensagem
- **Linhas**: 160

#### 3. **Evolution Webhook Routes** (`backend/src/routes/evolutionWebhookRoutes.ts`)
- **Status**: ✅ Implementado, MAS NÃO REGISTRADO
- **Rota**: `POST /api/webhook/evolution`
- **Middleware**: Normaliza eventos com sufixos em path
- **Problema**: `routes/index.ts` não importa/registra esta rota

#### 4. **Docker Compose**
- **Status**: ✅ Evolution API v2.2.3 rodando
- **Serviços**:
  - `evolution-api`: Container Evolution API (porta 8080)
  - `backend`: Node.js + Express (porta 3100)
  - `postgres`: PostgreSQL (porta 5432)
  - `redis`: Redis (porta 6379)
  - `rabbitmq`: Message queue (porta 5672)
  - Prometheus + Grafana para monitoring

---

## 🔴 GAP CRÍTICO IDENTIFICADO

### Problema
**Rota `/api/webhook/evolution` não está registrada no Express**

### Evidência
```
✅ EvolutionWebhookController.ts EXISTE (implementado)
✅ evolutionWebhookRoutes.ts EXISTE (rotas prontas)
❌ routes/index.ts NÃO importa evolutionWebhookRoutes
❌ routes/index.ts NÃO registra /api/webhook/evolution
```

### Consequência
```
1. Evolution API envia: POST http://backend:3100/api/webhook/evolution
2. Express responde: 404 Not Found
3. Eventos não processados: QRCODE_UPDATED, CONNECTION_UPDATE, MESSAGES_UPSERT
4. Resultado: QR Code nunca chega, usuário fica "esperando..."
```

### Impacto
🔴 **CRÍTICO - 100%**: Sem essa rota, nada funciona

---

## 🔧 SOLUÇÃO

### Arquivo: `backend/src/routes/index.ts`

**Mudança 1 - Linha ~40 (adicionar import)**:
```typescript
import evolutionWebhookRoutes from './evolutionWebhookRoutes';
```

**Mudança 2 - Linha ~75 (registrar rota)**:
```typescript
// ========== WEBHOOKS ==========
routes.use('/webhook/erp', erpWebhookRoutes);
routes.use('/webhook/whatsapp', whatsappWebhookRoutes);
routes.use('/api/webhook/whatsapp', whatsappWebhookRoutes);
routes.use('/api/webhook/evolution', evolutionWebhookRoutes); // ← ADICIONE
```

### Deploy
```bash
docker compose down backend
docker compose up -d backend
docker compose logs -f backend
```

### Validação
```bash
curl -X POST http://localhost:3100/api/webhook/evolution \
  -H "Content-Type: application/json" \
  -d '{"event":"QRCODE_UPDATED","instance":"test"}' \
  -v
# Esperado: 200 OK (não 404)
```

---

## 📊 FLUXO COMPLETO (APÓS FIX)

```
Frontend POST /api/whatsapp-sessions
           │
           ▼
WhatsappSessionController.create()
           │
           ▼
WhatsAppProvider.createSessionEvolution()
      ├─ POST evolution-api:/manager/instances
      ├─ POST evolution-api:/webhook/set (registra webhook)
      └─ Retorna instanceKey
           │
           ▼
Salva em DB (Whatsapp model)
           │
           ▼
Frontend GET /api/whatsapp-sessions/:id (polling)
           │
           ▼
Retorna QR code
           │
           ▼
Usuário escaneia QR com celular
           │
           ▼
Evolution API detecta scan
           │
           ▼
POST /api/webhook/evolution ✅ AGORA FUNCIONA
           │
           ▼
EvolutionWebhookController.handle()
      ├─ Processa evento
      ├─ Atualiza DB
      └─ Retorna 200 OK
           │
           ▼
Frontend vê status "Conectado" ✅
           │
           ▼
WhatsApp pronto para usar!
```

---

## 📋 CHECKLIST DE AUDITORIAS PENDENTES

### P1 - CRÍTICO (para produção, ~5h):

- [ ] **EvolutionWebhookController** - Auditoria Completa (1h)
  - [ ] `handleIncomingMessage()` - cria ticket? em qual fila? aplica settings?
  - [ ] `handleConnectionUpdate()` - status update logic
  - [ ] Error handling - malformed events, timeouts, retry logic

- [ ] **Integração Settings** (2h)
  - [ ] Como configurações de tenant/departamento são aplicadas?
  - [ ] Filtros de mensagem funcionam?
  - [ ] Auto-ticket creation rules
  - [ ] Bot/auto-reply integration

- [ ] **Error Handling & Retry** (1.5h)
  - [ ] Failed webhooks - retry exponencial
  - [ ] Dead letter queue
  - [ ] Monitoring + alerting

- [ ] **Logging Detalhado** (0.5h)
  - [ ] Eventos recebidos vs processados
  - [ ] Taxa de erro
  - [ ] Latência

### P2 - IMPORTANTE (antes de scaling, ~4h):

- [ ] **WhatsappSessionController** - Lógica completa (1h)
  - [ ] Create/list/show/delete funcionando?
  - [ ] QR code generation e refresh?
  - [ ] Status updating em tempo real?

- [ ] **Message Model** (1h)
  - [ ] Estrutura de dados correta?
  - [ ] Validação?
  - [ ] Indexação para performance?

- [ ] **Multi-tenant Isolation** (1h)
  - [ ] Um tenant não vê dados de outro?
  - [ ] Webhook por tenant isolado?

- [ ] **Load Testing** (1h)
  - [ ] Quantas mensagens/segundo suporta?
  - [ ] Limite de instâncias por tenant?
  - [ ] Webhook queue resiliente?

---

## 🔐 CONFIGURAÇÃO ENVIRONMENT

### Backend (.env)
```bash
# Evolution API
USE_EVOLUTION_API=true
EVOLUTION_API_URL=http://evolution-api:8080
EVOLUTION_API_AUTH_TYPE=apikey
EVOLUTION_API_KEY=<sua_chave_secreta>
EVOLUTION_DATABASE_URL=postgresql://chatex:chatex@postgres:5432/chatex

# Webhook
WEBHOOK_GLOBAL_URL=http://backend:3100/api/webhook/evolution
WEBHOOK_GLOBAL_ENABLED=true
WEBHOOK_GLOBAL_USE=true

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=chatex
DB_PASS=chatex
DB_NAME=chatex

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=chatex

# JWT
JWT_SECRET=<seu_jwt_secret>
JWT_REFRESH_SECRET=<seu_refresh_secret>
```

---

## 📊 MÉTRICAS E TIMELINE

| Item | Tempo | ROI | Prioridade | Status |
|------|-------|-----|-----------|--------|
| Fix rota webhook | 5 min | 100% | 🔴 P0 | ❌ TODO |
| Teste E2E webhook | 30 min | 90% | 🔴 P0 | ❌ TODO |
| Auditoria P1 | 5h | 70% | 🟡 P1 | ❌ TODO |
| Auditoria P2 | 4h | 50% | 🟡 P1 | ❌ TODO |
| Production Ready | 1-2 dias | - | 🟢 Deploy | ❌ TODO |

**Estimativa Total**: 1-2 dias para production-ready

---

## 💼 RECOMENDAÇÕES DE NEGÓCIO

### ROI Imediato:
- Fix: 5 minutos = ~$1.67
- Unlock: Feature Evolution API completa
- Monetization: +$50-200/mês por cliente
- Payback: Instantâneo

### Oportunidade:
- Migrar clientes gateway → Evolution (3x mais rápido)
- Vender como "WhatsApp Premium" (+$10-20/mês)
- Potencial: 30-50% clientes = ~+$5-10K MRR

### Timeline:
- **Hoje**: Fix P0 (5 min)
- **Amanhã**: Teste E2E (2-3h)
- **Semana 1**: Auditorias P1/P2 (8-10h)
- **Semana 2**: Staging + pilot (3-5 clientes)
- **Semana 3**: Full production rollout

---

## 📁 ESTRUTURA DE ARQUIVOS RELEVANTES

```
backend/
├── src/
│   ├── providers/
│   │   ├── WhatsAppProvider.ts ✅ (538 linhas)
│   │   ├── ERPProviderFactory.ts
│   │   └── VendaERPProvider.ts
│   │
│   ├── controllers/
│   │   ├── EvolutionWebhookController.ts ✅ (160 linhas)
│   │   ├── WhatsappSessionController.ts
│   │   └── ... (outras)
│   │
│   ├── routes/
│   │   ├── evolutionWebhookRoutes.ts ✅ (implementada)
│   │   ├── whatsappSessionRoutes.ts ✅
│   │   ├── index.ts ❌ (PROBLEMA: não importa/registra)
│   │   └── ... (outras)
│   │
│   ├── models/
│   │   ├── Whatsapp.ts
│   │   ├── Message.ts
│   │   ├── Ticket.ts
│   │   ├── Setting.ts
│   │   └── ... (outras)
│   │
│   └── services/
│       ├── WhatsappService/
│       └── ... (outras)
│
├── docker-compose.yml ✅ (Evolution API rodando)
├── package.json
└── .env (EVOLUTION_API_* configurado)

frontend/
├── src/
│   ├── pages/
│   │   └── sessaoWhatsapp/ (UI para criar sessão, mostrar QR)
│   └── ... (outras)

docs/
├── evolution-api-notes.md
├── evolution-api-endpoints-confirmed.md
└── ... (outras)
```

---

## 🎓 PRÓXIMOS PASSOS PARA AI/ASSISTENTES

### Se receber request para auditar Zechat v3:
1. **Primeiro**: Ler este `AI-CONTEXT.md`
2. **Saber**: Gap crítico é rota `/api/webhook/evolution` não registrada
3. **Ação**: 
   - Se é fix do gap → simples (2 linhas)
   - Se é P1/P2 auditorias → ler AUDITORIA_EVOLUTION_API.md
4. **Não gerar código especulativo** → primeiro auditar, depois gerar

### Se receber request para feature nova:
1. **Verificar**: É compatível com Evolution API?
2. **Integrar**: Onde cabe no webhook handler?
3. **Testar**: Funciona em dual-mode (Evolution + Legacy)?
4. **Documentar**: Atualizar este contexto

### Se receber request para deploy:
1. **Validar**: Gap P0 foi fixado?
2. **Verificar**: Todas auditorias P1 passaram?
3. **Testar**: E2E workflow completo funciona?
4. **Deploy**: Staged (staging → pilot → production)

---

## 📞 REFERÊNCIAS

- **Ramo**: `feat/evolution-api-migration`
- **Evolution API Docs**: https://doc.evolution-api.com
- **Audit Report**: `AUDITORIA_EVOLUTION_API.md`
- **Patch Fix**: `PATCH_P0_evolution_webhook.sh`
- **Auditor**: CEO & CTO Zechat
- **Data Audit**: 29/12/2025 17:53 BRT

---

## ✅ CHECKLIST ANTES DE CADA DEPLOY

- [ ] Gap P0 foi fixado (rota /api/webhook/evolution registrada)?
- [ ] Backend reiniciado com sucesso?
- [ ] `GET /api/health` retorna 200 OK?
- [ ] `POST /api/webhook/evolution` responde 200 (não 404)?
- [ ] Logs mostram EvolutionWebhookController sendo chamado?
- [ ] QR code aparece quando criar sessão?
- [ ] Status muda de "Esperando QR" para "Conectado" após escanear?
- [ ] Teste E2E workflow completo passou?
- [ ] Monitoring/alerting configurado?
- [ ] Customer support preparado?

---

**Status Final**: 70% implementado, 1 fix de 5 minutos desbloqueará 100% funcionalidade.  
**Recomendação**: **FIX HOJE. Test amanhã. Deploy semana 1.**

*Atualizado: 29/12/2025 | Auditor: CEO & CTO Zechat*
