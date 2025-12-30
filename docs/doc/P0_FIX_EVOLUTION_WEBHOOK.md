# P0_FIX_EVOLUTION_WEBHOOK_ROUTE.patch

## 🔴 CRÍTICO - Fix rota /api/webhook/evolution

**Tempo**: 5 minutos  
**Impacto**: 100% - desbloqueará funcionalidade completa  
**Arquivo**: backend/src/routes/index.ts

---

## INSTRUÇÕES PARA APLICAR

### Opção 1: Manual (5 minutos)
```bash
# Abra o arquivo
nano backend/src/routes/index.ts

# Mudança 1 - Procure por (linha ~40):
import adminBillingRoutes from './adminBillingRoutes';

# Adicione APÓS:
import evolutionWebhookRoutes from './evolutionWebhookRoutes';

# Mudança 2 - Procure por (linha ~75):
routes.use('/api/webhook/whatsapp', whatsappWebhookRoutes);

# Adicione APÓS:
routes.use('/api/webhook/evolution', evolutionWebhookRoutes);

# Salve e saia (Ctrl+X, Y, Enter em nano)
```

### Opção 2: Usando patch (Unix/Linux/Mac)
```bash
# Salve este arquivo como p0_fix.patch
# Depois execute:
cd /seu/projeto/zechat-v3
patch -p1 < p0_fix.patch
```

### Opção 3: Cópia/Cola (GitHub Web UI)
```
1. Abra: https://github.com/OARANHA/zechat-v3/blob/feat/evolution-api-migration/backend/src/routes/index.ts
2. Clique no lápis (Edit)
3. Procure por "adminBillingRoutes" (Ctrl+F)
4. Após a linha "import adminBillingRoutes from './adminBillingRoutes';", adicione:
   import evolutionWebhookRoutes from './evolutionWebhookRoutes';
5. Procure por "api/webhook/whatsapp" (Ctrl+F)
6. Após a linha "routes.use('/api/webhook/whatsapp', whatsappWebhookRoutes);", adicione:
   routes.use('/api/webhook/evolution', evolutionWebhookRoutes);
7. Clique "Commit changes"
8. Message: "fix: register evolution webhook route (P0 critical)"
```

---

## DIFF EXATO

```diff
--- a/backend/src/routes/index.ts
+++ b/backend/src/routes/index.ts
@@ -37,6 +37,7 @@ import erpIntegrationRoutes from './erpIntegrationRoutes';
 import erpWebhookRoutes from './erpWebhookRoutes';
 import subscriptionRoutes from './subscriptionRoutes';
 import adminBillingRoutes from './adminBillingRoutes';
+import evolutionWebhookRoutes from './evolutionWebhookRoutes';
 
 const routes = Router();
 
@@ -72,6 +73,8 @@ routes.use('/webhook/erp', erpWebhookRoutes);
 // ✅ NOVO: Compatibilidade com gateway WhatsApp que usa /webhook/whatsapp
 routes.use('/webhook/whatsapp', whatsappWebhookRoutes);
 // Alias compatível para cenários que chamam /api/webhook/whatsapp
 routes.use('/api/webhook/whatsapp', whatsappWebhookRoutes);
+// ✅ NOVO: Evolution API Webhook
+routes.use('/api/webhook/evolution', evolutionWebhookRoutes);
 
 // ========== INTEGRAÇÕES E ASSINATURAS ==========
 routes.use('/api/integrations/erp', erpIntegrationRoutes);
```

---

## VALIDAÇÃO PÓS-APLICAÇÃO

```bash
# 1. Verifique se as mudanças foram aplicadas
git diff backend/src/routes/index.ts | head -30

# 2. Reinicie o backend
docker compose down backend
docker compose up -d backend
sleep 5

# 3. Verifique logs
docker compose logs backend | grep -i "evolution\|webhook" | head -20

# 4. Teste a rota
curl -X POST http://localhost:3100/api/webhook/evolution \
  -H "Content-Type: application/json" \
  -d '{"event":"QRCODE_UPDATED","instance":"test"}' \
  -v

# Esperado: 200 OK (não 404!)
# Status: < HTTP/1.1 200 OK
```

---

## COMMIT MESSAGE

```
fix(webhook): register evolution api webhook route [P0]

- Add evolutionWebhookRoutes import to routes/index.ts
- Register POST /api/webhook/evolution endpoint
- Enables Evolution API events to be processed by backend
- Fixes issue where webhook events returned 404

This fix unblocks 100% of Evolution API functionality.
Without this route, QR codes and messages are not processed.

Fixes: Evolution API integration broken
Related: feat/evolution-api-migration
```

---

## CHECKLIST PÓS-DEPLOY

- [ ] Backend reiniciado sem erros
- [ ] evolutionWebhookRoutes foi importado corretamente
- [ ] `POST /api/webhook/evolution` responde 200 OK (não 404)
- [ ] Logs mostram "EvolutionWebhookController" quando webhook é enviado
- [ ] Criar nova sessão WhatsApp
- [ ] QR code aparece no frontend
- [ ] Escanear QR com celular
- [ ] Status muda de "Esperando QR" para "Conectado"
- [ ] Logs mostram eventos sendo processados

---

## ROLLBACK (em caso de problema)

```bash
# Se algo der errado, volte a versão anterior:
git revert HEAD
docker compose down backend
docker compose up -d backend
```

---

## PRÓXIMOS PASSOS

1. ✅ **Aplicar este patch** (5 min)
2. ✅ **Testar webhook** (30 min) - ver AUDITORIA_EVOLUTION_API.md
3. 📋 **Auditorias P1** (5h) - EvolutionWebhookController, Settings, Error Handling
4. 📋 **Auditorias P2** (4h) - Load testing, multi-tenant, production readiness

---

**Status**: READY TO APPLY  
**Auditor**: CEO & CTO Zechat  
**Data**: 29/12/2025
