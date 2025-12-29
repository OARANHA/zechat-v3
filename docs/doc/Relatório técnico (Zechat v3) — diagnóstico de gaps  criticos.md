Relatório técnico (Zechat v3) — diagnóstico de gaps críticos, riscos de escala e plano de correção (com foco em Evolution API)
Sumário executivo (o que mais dói e por quê)
Página “Canais” hoje não tem garantias de refletir o estado real da Evolution API porque o contrato de “status” é inconsistente entre backend e frontend e porque o webhook da Evolution não consegue correlacionar de forma confiável a instância com o registro do WhatsApp no banco. Resultado típico: botões errados (ex.: “Conectar”/“QR Code” não aparecem), status “travado” e QR code “atrasado”/inexistente no UI.

Integração Evolution está “quase lá”, mas com dois bugs estruturais:

Mapeamento de instância ↔ canal: a Evolution emite instance/instanceName e o backend tenta achar o WhatsApp por name ou session — só que a instância está sendo criada usando o id do WhatsApp como nome da instância, e o model não está preparado para buscar por id (nem persistir isso num campo dedicado).

Status não padronizado: backend usa connected / qr_code / connecting / disconnected (minúsculo + snake_case) em alguns pontos; frontend espera CONNECTED / DISCONNECTED / OPENING / PAIRING / TIMEOUT e ainda checa qrcode (sem underscore). Isso quebra a UI por condição booleana, mesmo com dados corretos.

Risco de churn e custo operacional: esse tipo de instabilidade (status e QR inconsistentes) normalmente vira:

aumento de tickets (“não conecta”, “QR não aparece”, “fica desconectando”);

perda de confiança do cliente (especialmente agências e e-commerces com múltiplas sessões);

churn por percepção de “produto instável”.

Abaixo vai o diagnóstico técnico detalhado e um plano de correção priorizado por ROI.

1) Diagnóstico: “Canais” está consumindo a Evolution corretamente?
1.1 Como a tela “Canais” funciona hoje (fluxo real)
Na tela sessaoWhatsapp/Index.vue:

Lista canais via GET /whatsapp/whatsapp/ (service ListarWhatsapps).

Conecta sessão via POST /whatsapp-sessions/whatsappsession/:id.

Solicita novo QR via PUT /whatsapp-sessions/whatsappsession/:id com { isQrcode: true }, espera alguns segundos e faz GET /whatsapp/whatsapp/:id pra buscar o QR salvo no banco.

Ou seja: o frontend não consulta a Evolution diretamente; ele depende do backend persistir status e qrcode no banco e expor isso.

1.2 O backend realmente persiste status/QR vindos da Evolution?
Parcialmente — e aqui está o problema:

(A) Ao iniciar a sessão
O serviço de start atualiza status = "OPENING" e depois chama o provider. O provider (modo Evolution) cria instância e consulta connectionState. Com isso, o backend salva status e qrcode no banco. Até aqui, pode funcionar.

Mas o status salvo tende a ser algo como:

"qr_code" (com underscore) quando há QR

"connected" quando abriu

"connecting" etc.

(B) Quando a Evolution manda webhooks (QR atualizado / conexão / mensagens)
O provider configura webhook para /api/webhook/evolution e o backend tem um controller que tenta:

ler event e instance/instanceName

mapear status

salvar em Whatsapp no banco

Só que a correlação instância → Whatsapp no banco é frágil: o controller tenta encontrar o canal por name ou session, enquanto a instância está sendo criada com instanceName = whatsapp.id (string). Se o campo name do WhatsApp não for literalmente "1", "2", etc., o webhook não encontra o registro e não atualiza status/QR “ao vivo”.

Sintoma no produto: QR não “chega” via webhook, status não acompanha desconexão, etc.

2) Gap crítico #1 — Contrato de status quebrado (backend vs frontend)
2.1 Situação atual
Backend (no provider/webhook) trabalha com:
connected, disconnected, connecting, qr_code (minúsculo, snake_case)

Frontend (na tela “Canais”) checa:

item.status == 'DISCONNECTED'

['OPENING','CONNECTED','PAIRING','TIMEOUT'].includes(item.status)

item.status == 'qrcode' para exibir botão “QR Code”

Isso é uma quebra de contrato clássica: mesmo que a info esteja correta, a UI não reage.

2.2 Correção recomendada (opinião forte)
Definir um enum canônico de status do Zechat e forçar padronização no backend antes de persistir.

Sugestão de enum canônico (Zechat):

DISCONNECTED

CONNECTING

QRCODE (ou QR_CODE, mas escolha um e padronize)

CONNECTED

ERROR (opcional, mas útil)

Regra: o frontend só entende esse enum.
A Evolution pode usar o que quiser, o gateway legado também — o backend traduz para o padrão.

Onde corrigir
No StartWhatsAppSession: ao salvar sessionData.status, traduzir para o enum canônico.

No EvolutionWebhookController.handleConnectionUpdate: traduzir para o enum canônico e salvar em maiúsculo.

No frontend: remover checks “soltos” e usar o enum (ex.: QRCODE).

2.3 ROI estimado
Esforço: 6–10h dev (backend + frontend + testes manuais).

Retorno: redução imediata de tickets e “falsos negativos” de conexão.
Em SaaS de atendimento, esse tipo de bug costuma ser responsável por uma fatia desproporcional de suporte. Payback costuma ser < 30 dias só por redução de atrito e churn evitado.

3) Gap crítico #2 — Webhook da Evolution não consegue “achar” o canal no banco
3.1 Por que isso acontece
A instância da Evolution está sendo criada com instanceName derivado do sessionId/whatsappId (normalmente o id do registro). Isso é bom (estável e único).

Porém, o webhook do backend procura o WhatsApp por name ou por session. Se o banco não tiver name="17" e session="17", ele não encontra.

3.2 Correção recomendada
Implementar correlação robusta em duas camadas:

Camada 1 (mínimo viável, rápido):

Se sessionId recebido no webhook for numérico, procurar por primary key id.

Ex.: if (/^\d+$/.test(sessionId)) findByPk(Number(sessionId)).

Camada 2 (arquitetura correta, para escala):

Persistir em Whatsapp.session (ou um novo campo providerInstanceName) o instanceName efetivamente usado.

Garantir índice para lookup rápido (tenantId + providerInstanceName).

Isso elimina “estado fantasma” e torna o sistema observável.

3.3 ROI estimado
Esforço: 4–8h dev (dependendo se vai criar migração de banco).

Retorno: status e QR passam a refletir “real-time” com confiabilidade; melhora a percepção de estabilidade e reduz churn.

4) Gap operacional — QR Code via “sleep” (delay fixo) é anti-pattern
4.1 Situação atual
A geração de QR depende de:

PUT para reiniciar

esperar X segundos (frontend espera ~4s; backend ~3s)

fazer GET no banco para ver se o QR apareceu

Isso é frágil porque:

QR pode demorar mais (latência, carga, cold start, rede)

pode “aparecer e expirar” sem o UI ver

aumenta chamadas e piora UX

4.2 Correção recomendada
Trocar de polling “cego” para event-driven:

Opção A (melhor): Socket como fonte de verdade

Quando webhook receber QRCODE_UPDATED, emitir evento socket com { whatsappId, status: QRCODE }.

Frontend, ao receber evento, faz GET /whatsapp/whatsapp/:id e abre modal com QR atualizado.

Opção B (rápida): PUT retorna QR (se já existir)

O endpoint de reinício pode retornar a entidade atualizada com qrcode quando disponível, mas sem sleep fixo (usar retry interno curto com timeout e backoff).

4.3 ROI
Esforço: 8–16h dev.

Retorno: UX muito melhor (“clicou, QR aparece”), menos suporte.

5) Gaps de escalabilidade e confiabilidade (arquitetura)
Mesmo sem entrar em microserviços, existem 4 áreas que limitam escala e confiabilidade:

5.1 Idempotência e deduplicação de webhook
Webhooks (especialmente mensagens) podem chegar duplicados ou fora de ordem. Hoje, o fluxo “fila → processamento” precisa garantir:

chave idempotente por message_id + tenantId

“at least once delivery” sem duplicar tickets/mensagens no banco

Recomendação: no worker que processa mensagens, aplicar dedupe com Redis (SETNX com TTL) ou constraint única no banco.

5.2 Contratos e tipagem (redução de bugs silenciosos)
O projeto mistura padrões e estados (“connected” vs “CONNECTED”), e isso é o tipo de bug que cresce com features.

Recomendação:

criar um módulo domain/channelStatus.ts no backend e src/types/channelStatus.ts no frontend

centralizar mapeamentos Evolution→Zechat

validar status na borda (controller) antes de persistir

5.3 Observabilidade “orientada a negócio”
Vocês já têm Prometheus/Grafana na infra; o que falta é instrumentar métricas que respondam:

Connect Success Rate por tenant

Tempo médio até QR (p50/p95)

Tempo até CONNECTED (p50/p95)

Mensagens perdidas / retries

Fila: tamanho, latência, taxa de erro

Isso vira argumento de venda (Enterprise) e reduz tempo de diagnóstico.

5.4 Multi-tenant: limites e billing precisam ser “fonte de verdade”
Há um passo na direção certa com checkPlanLimits("whatsappSessions") e UsageService.incrementWhatsappSessions, mas:

“incrementar sessões” no start, sem garantir reconciliação, pode gerar drift.

falta métrica e trilha auditável por tenant.

Recomendação: criar reconciliação periódica:

fonte: banco (quantos canais ativos por tenant)

comparar com Redis/Usage

corrigir e registrar log

Isso habilita cobrança por uso com confiança (upsell).

6) Recomendações priorizadas (Impacto x Esforço x ROI)
Prioridade	Item	Problema que resolve	Esforço (estim.)	Impacto no negócio
P0	Padronizar status (enum canônico) e alinhar UI	“Canais” não reflete estado real; botões errados	6–10h	Reduz suporte + melhora retenção
P0	Webhook correlacionar instância→WhatsApp por id e/ou campo dedicado	Status/QR não atualiza “ao vivo”	4–8h	Estabilidade percebida ↑
P1	Substituir sleep por evento (socket/webhook) para QR	QR “some”, latência, UX ruim	8–16h	UX ↑, menos churn
P1	Idempotência/dedupe em mensagens	Duplicidade/bugs em carga	12–24h	Confiabilidade ↑ (Enterprise)
P2	Métricas e alertas (QR time, connect rate, fila)	Diagnóstico lento, falta visibilidade	16–32h	Menos incidentes + argumento comercial
7) Próximos passos (executáveis em 7 dias)
Sprint 1 (1 semana, foco em estabilizar “Canais” e Evolution)
Definir enum canônico de status (backend e frontend).

Ajustar backend para sempre persistir status no padrão canônico:

no start

no webhook de conexão

Ajustar webhook para localizar WhatsApp por id quando instanceName for numérico.

Ajustar frontend:

trocar checks por enum

exibir QR quando status === QRCODE

Teste de regressão orientado a cenário:

criar canal → iniciar sessão → QR aparece → conectar → status CONNECTED → desconectar → DISCONNECTED

repetir com latência simulada (delay artificial) para validar que não depende de sleep

Critério de sucesso (métricas):

95%+ dos connects exibindo QR e indo para CONNECTED sem intervenção manual

tempo p95 até exibir QR < 10s

redução de tickets de conexão/QR na semana seguinte

8) Observação final (cautela e honestidade técnica)
O diagnóstico acima foca no que está objetivamente visível no fluxo atual: tela de Canais → rotas de sessão → provider Evolution → webhook. O principal “gap” não é a Evolution em si, e sim o contrato de estado (status) e a correlação instância↔registro. Corrigindo isso, a plataforma sobe um degrau inteiro em confiabilidade percebida — e confiabilidade é diretamente proporcional a LTV em produto de atendimento.

Se quiser, o próximo passo natural é: após estabilizar “Canais”, partir para idempotência de mensagens + métricas + reconciliação de billing por uso — que é onde vocês transformam estabilidade em monetização (Enterprise/overage) com segurança.