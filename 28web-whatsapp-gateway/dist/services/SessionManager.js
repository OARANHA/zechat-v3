"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const uuid_1 = require("uuid");
const WhatsAppClient_1 = require("./WhatsAppClient");
const logger_1 = require("../utils/logger");
class SessionManager {
    constructor() {
        this.sessions = new Map();
    }
    async createSession(params) {
        const sessionId = params.sessionId || `sess_${(0, uuid_1.v4)().replace(/-/g, "").slice(0, 12)}`;
        const existing = this.sessions.get(sessionId);
        if (existing)
            return existing;
        const client = new WhatsAppClient_1.WhatsAppClient({
            sessionId,
            tenantId: params.tenantId,
            name: params.name,
            webhookUrl: params.webhookUrl
        });
        this.sessions.set(sessionId, client);
        await client.initialize();
        logger_1.logger.info({ sessionId, tenantId: params.tenantId }, "Session created");
        return client;
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    async deleteSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        await session.destroy();
        this.sessions.delete(sessionId);
    }
    async disconnectSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        await session.logout();
    }
}
exports.SessionManager = SessionManager;
