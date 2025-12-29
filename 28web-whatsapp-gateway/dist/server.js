"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const requireApiKey_1 = require("./middleware/requireApiKey");
const SessionManager_1 = require("./services/SessionManager");
const MessageQueue_1 = require("./queue/MessageQueue");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "20mb" }));
app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
// Segurança: API Key para todas as rotas da API
app.use("/api", requireApiKey_1.requireApiKey);
const sessionManager = new SessionManager_1.SessionManager();
const messageQueue = new MessageQueue_1.MessageQueue(sessionManager);
app.post("/api/v1/sessions", async (req, res) => {
    const body = req.body;
    if (!body?.tenantId || !body?.name) {
        res.status(400).json({ error: "tenantId and name are required" });
        return;
    }
    const session = await sessionManager.createSession({
        tenantId: body.tenantId,
        name: body.name,
        webhookUrl: body.webhookUrl,
        sessionId: body.sessionId
    });
    // Retorna snapshot imediato (QR pode vir logo em seguida, mas normalmente já aparece rápido)
    const snapshot = session.getSnapshot();
    const response = {
        sessionId: snapshot.sessionId,
        status: snapshot.status,
        qrCode: snapshot.qrCode,
        phoneNumber: snapshot.phoneNumber,
        error: snapshot.error
    };
    res.status(201).json(response);
});
app.get("/api/v1/sessions/:sessionId", async (req, res) => {
    const session = sessionManager.getSession(req.params.sessionId);
    if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
    }
    res.json(session.getSnapshot());
});
app.delete("/api/v1/sessions/:sessionId", async (req, res) => {
    await sessionManager.deleteSession(req.params.sessionId);
    res.status(204).send();
});
app.post("/api/v1/sessions/:sessionId/disconnect", async (req, res) => {
    await sessionManager.disconnectSession(req.params.sessionId);
    res.status(204).send();
});
app.post("/api/v1/sessions/:sessionId/messages", async (req, res) => {
    const sessionId = req.params.sessionId;
    const body = req.body;
    if (!body?.to || (!body.body && !body.mediaUrl)) {
        res.status(400).json({ error: "to and (body or mediaUrl) are required" });
        return;
    }
    const session = sessionManager.getSession(sessionId);
    if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
    }
    try {
        if (messageQueue.isEnabled()) {
            await messageQueue.enqueueSendMessage({ sessionId, to: body.to, body: body.body });
            const response = {
                messageId: `queued_${Date.now()}`,
                status: "sent",
                timestamp: Date.now()
            };
            res.status(202).json(response);
            return;
        }
        const result = await session.sendMessage(body.to, body.body);
        const response = {
            messageId: result.messageId,
            status: "sent",
            timestamp: Date.now()
        };
        res.status(201).json(response);
    }
    catch (err) {
        const response = {
            messageId: "",
            status: "failed",
            timestamp: Date.now(),
            error: err?.message || "unknown"
        };
        res.status(500).json(response);
    }
});
app.get("/api/v1/sessions/:sessionId/contacts", async (req, res) => {
    const session = sessionManager.getSession(req.params.sessionId);
    if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
    }
    try {
        const contacts = await session.getContacts();
        res.status(200).json({ contacts });
    }
    catch (err) {
        logger_1.logger.error({ err, sessionId: req.params.sessionId }, "Failed to get contacts");
        res.status(500).json({ error: "Failed to get contacts", details: err?.message });
    }
});
// Error handler
app.use((err, _req, res, _next) => {
    logger_1.logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: "Internal Server Error" });
});
app.listen(env_1.env.port, () => {
    logger_1.logger.info({ port: env_1.env.port }, "28web WhatsApp Gateway listening");
});
