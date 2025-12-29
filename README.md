# Zechat v3 - Sistema de Atendimento Multicanal

**Repositório limpo com Evolution API e integração completa**

## 🚀 Visão Geral

Zechat v3 é a evolução do sistema de atendimento multicanal, agora com **Evolution API v2.2.3** como solução principal de WhatsApp, arquitetura Docker Compose e integração completa com webhooks.

## ✨ Funcionalidades Principais

### ✅ Integração Evolution API (WhatsApp)
- Webhooks configuráveis: QR Code, Conexão, Mensagens
- Suporte a múltiplas instâncias simultâneas
- Fallback para gateway legado (compatibilidade)
- Processamento assíncrono com Redis Queue

### ✅ Canais Suportados
- WhatsApp (via Evolution API)
- Instagram (via Facebook HUB)
- Telegram (Webhook/Bot)
- Messenger (via Facebook HUB)

### ✅ Sistema Multi-tenant
- Isolamento completo entre tenants
- Billing com rastreamento de uso
- Planos: Starter, Professional, Enterprise
- Controle granular de acesso (RBAC)

### ✅ Interface Moderna
- Vue 3 + Quasar Framework
- WebSocket para atualização em tempo real
- Dashboard de métricas e uso
- Gerenciamento de usuários e permissões

## 📦 Stack Tecnológica

### Backend (Node.js/TypeScript)
- **Framework:** Express.js
- **ORM:** Sequelize (PostgreSQL)
- **Cache:** Redis
- **Mensageria:** Bull Queue (Redis)
- **WebSockets:** Socket.io
- **Logging:** Winston
- **Validação:** Joi + class-validator

### Frontend (Vue 3/Quasar)
- **Framework:** Vue 3 + Composition API
- **UI:** Quasar Material Design
- **State Management:** Pinia
- **HTTP Client:** Axios
- **Formulários:** Vuelidate
- **Icons:** Material Icons

### Infraestrutura (Docker Compose)
```yaml
- backend (Express.js)
- frontend (Quasar dev server)  
- evolution-api (v2.2.3)
- postgres (PostgreSQL 15)
- redis (Redis 7)
- nginx (proxy reverso)
- prometheus (monitoramento)
- grafana (dashboard)
- rabbitmq (message queue)
```

## 🔧 Instalação Rápida

### 1. Clone o repositório
```bash
git clone https://github.com/OARANHA/zechat-v3.git
cd zechat-v3
```

### 2. Configure ambiente
```bash
cp .env.example .env
# Edite .env com suas variáveis
```

### 3. Inicie com Docker Compose
```bash
docker-compose up -d --build
```

### 4. Acesse a aplicação
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3100
- **Evolution API:** http://localhost:8080
- **Grafana:** http://localhost:3001

## ⚙️ Configuração do Environment

### Arquivo `.env`
```env
# Aplicação
NODE_ENV=development
BACKEND_URL=http://backend:3100
FRONTEND_URL=http://localhost:3000

# Evolution API
USE_EVOLUTION_API=true
EVOLUTION_API_URL=http://evolution-api:8080
EVOLUTION_API_AUTH_TYPE=apikey
EVOLUTION_API_KEY=seu_token_aqui

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
JWT_SECRET=seu_jwt_secret
JWT_REFRESH_SECRET=seu_refresh_secret
```

### Evolution API Webhooks
```env
WEBHOOK_GLOBAL_URL=http://backend:3100/api/webhook/evolution
WEBHOOK_GLOBAL_ENABLED=true
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false
GLOBAL_WEBHOOK_EVENTS=connection.update,QRCODE_UPDATED,MESSAGES_UPSERT
```

## 🔄 Fluxo Evolution API

### Conexão WhatsApp
```
1. Frontend → POST /api/whatsapp-sessions
2. Backend → WhatsAppProvider.createSessionEvolution()
3. Evolution API → Cria instância + webhook
4. Evolution → POST /api/webhook/evolution (QR Code)
5. Backend → Processa QR → WebSocket → Frontend
6. Usuário escaneia QR no WhatsApp
7. Evolution → POST /api/webhook/evolution (Connected)
8. Sessão pronta para mensagens
```

### Recebimento de Mensagens
```
1. WhatsApp → Evolution API
2. Evolution → POST /api/webhook/evolution (MESSAGES_UPSERT)
3. Backend → EvolutionWebhookController.handleIncomingMessage()
4. Queue.add() → Processa mensagem
5. Socket.io → Frontend (atualização em tempo real)
```

## 📁 Estrutura do Projeto

```
zechat-v3/
├── backend/                    # API Backend
│   ├── src/
│   │   ├── controllers/       # Controllers REST
│   │   │   ├── WhatsAppSessionController.ts
│   │   │   ├── EvolutionWebhookController.ts
│   │   │   └── WebhookController.ts
│   │   ├── providers/         # Provedores de canal
│   │   │   └── WhatsAppProvider.ts (Evolution + Gateway)
│   │   ├── services/          # Serviços de negócio
│   │   │   ├── StartWhatsAppSession.ts
│   │   │   ├── SyncContactsGatewayService.ts
│   │   │   └── WhatsAppWebhookService.ts
│   │   ├── routes/           # Rotas
│   │   │   ├── whatsappSessionRoutes.ts
│   │   │   ├── webhookRoutes.ts
│   │   │   └── evolutionWebhookRoutes.ts
│   │   ├── models/           # Modelos Sequelize
│   │   └── database/         # Migrações e seeds
├── frontend/                  # Vue 3 + Quasar
│   ├── src/
│   │   ├── pages/
│   │   │   ├── sessaoWhatsapp/
│   │   │   ├── api/          # API Service management
│   │   │   └── ...
│   │   ├── components/
│   │   ├── store/            # Pinia stores
│   │   └── api/              # Clientes API
│   │       └── sessoesWhatsapp.js
├── docker/                   # Configuração Docker
│   ├── postgres/
│   └── redis/
├── evolution-manager-v2/     # Frontend Evolution Manager
└── docs/                    # Documentação
```

## 🔌 API Principais

### WhatsApp Sessions
```http
POST    /api/whatsapp-sessions          # Criar sessão
GET     /api/whatsapp-sessions          # Listar sessões
GET     /api/whatsapp-sessions/:id     # Obter sessão
PUT     /api/whatsapp-sessions/:id     # Atualizar sessão (gerar QR)
DELETE  /api/whatsapp-sessions/:id     # Deletar sessão
```

### Webhooks
```http
POST    /api/webhook/evolution*         # Webhooks Evolution API
POST    /api/webhook/whatsapp          # Webhooks gateway legado
```

### API Service Management
```http
POST    /api/api-config                 # Criar API config
GET     /api/api-config                # Listar APIs
GET     /api/api-config/:id            # Obter API
PUT     /api/api-config/:id            # Atualizar API
DELETE  /api/api-config/:id            # Deletar API
POST    /api/api-config/:id/renew-token # Renovar token
```

## 🧪 Testes de Integração

### 1. Criar instância WhatsApp
```bash
curl -X POST "http://localhost:3100/api/whatsapp-sessions" \
  -H "Content-Type: application/json" \
  -d '{"whatsappId": "test-evolution-001"}'
```

### 2. Gerar QR Code
```bash
curl -X PUT "http://localhost:3100/api/whatsapp-sessions/test-evolution-001" \
  -H "Content-Type: application/json" \
  -d '{"isQrcode": true}'
```

### 3. Testar webhook Connection
```bash
curl -X POST "http://localhost:3100/api/webhook/evolution" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "CONNECTION_UPDATE",
    "instance": "test-evolution-001",
    "data": {"state": "open", "phone": "5511999999999"}
  }'
```

## 📊 Monitoramento

### Prometheus Metrics
```
- http_requests_total
- whatsapp_sessions_active
- messages_processed_total
- queue_jobs_total
- database_connections
```

### Grafana Dashboards
- **WhatsApp Sessions**: Status, uptime, mensagens
- **Performance**: Tempo de resposta, latência
- **Business**: Tickets, usuários, uso do plano

## 🔒 Segurança

### Implementado
- JWT com refresh tokens
- RBAC (Role-Based Access Control)
- Rate limiting por tenant
- Validação de input Joi/class-validator
- CSRF protection
- CORS configurado

### Recomendações de Produção
1. Usar HTTPS em todos endpoints
2. Rotacionar tokens Evolution API periodicamente
3. Monitorar logs de autenticação
4. Restringir acesso ao Evolution API (firewall)

## 🚀 Deploy em Produção

### Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes (Exemplo)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zechat-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: zechat/backend:latest
        envFrom:
        - configMapRef:
            name: zechat-config
```

## 📝 Roadmap

### v3.1 (Q1 2026)
- [ ] WhatsApp Business API integration
- [ ] Analytics dashboard aprimorado
- [ ] Mobile app (React Native)
- [ ] Exportação de relatórios (PDF/Excel)

### v3.2 (Q2 2026)
- [ ] Chatbot com IA (OpenAI/Gemini)
- [ ] Atendimento automático 24/7
- [ ] Integração com CRM (HubSpot, Salesforce)
- [ ] WhatsApp Payments

## 🐛 Troubleshooting

### Problemas Comuns

#### Evolution API não conecta
```bash
# Verificar logs
docker compose logs evolution-api

# Verificar saúde
curl -f http://localhost:8080/

# Verificar webhook config
docker compose exec backend cat /usr/src/app/.env | grep EVOLUTION
```

#### Backend crash
```bash
# Verificar logs
docker compose logs backend --tail=50

# Verificar variáveis
docker compose exec backend env | grep WHATSAPP

# Reiniciar serviços
docker compose restart backend evolution-api
```

#### QR Code não aparece
```bash
# Verificar frontend WebSocket
docker compose logs backend --grep "WebSocket"

# Verificar webhook recebido
docker compose logs backend --grep "QRCODE_UPDATED"
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este software é proprietário e está protegido por direitos autorais.

© 2025 Zechat. Todos os direitos reservados.

## ⚠️ Aviso Legal

Este projeto não é afiliado, associado, autorizado, endossado por, ou de qualquer forma oficialmente ligado ao WhatsApp, Meta, Telegram ou qualquer uma das suas filiais. As marcas utilizadas são propriedade de seus respectivos donos.

---

**Repositório:** https://github.com/OARANHA/zechat-v3  
**Documentação:** Consulte a pasta `docs/` para documentação detalhada  
**Suporte:** Criar issue no GitHub
