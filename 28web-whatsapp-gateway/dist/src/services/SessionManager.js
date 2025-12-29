"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const WhatsAppClient_1 = require("./WhatsAppClient");
const logger_1 = require("../utils/logger");
class SessionManager {
    constructor() {
        this.sessions = new Map();
    }
    // Singleton pattern
    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }
    /**
     * Criar e inicializar uma nova sessão WhatsApp
     */
    async createSession(config) {
        // 1. Verificar se já existe
        if (this.sessions.has(config.sessionId)) {
            logger_1.logger.info({ sessionId: config.sessionId }, 'Session already exists, returning existing');
            return this.sessions.get(config.sessionId);
        }
        // 2. Criar instância do cliente
        logger_1.logger.info({ sessionId: config.sessionId, tenantId: config.tenantId }, 'Creating new WhatsApp client');
        const client = new WhatsAppClient_1.WhatsAppClient(config);
        // 3. Inicializar o cliente (inicia o navegador, aguarda QR)
        await client.initialize();
        // 4. Armazenar no Map
        this.sessions.set(config.sessionId, client);
        logger_1.logger.info({ sessionId: config.sessionId }, 'WhatsApp client created and initialized');
        return client;
    }
    /**
     * Obter uma sessão existente
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    /**
     * Obter o QR code atual de uma sessão
     */
    getSessionQRCode(sessionId) {
        return this.sessions.get(sessionId)?.getQRCode();
    }
    /**
     * Remover uma sessão
     */
    removeSession(sessionId) {
        const client = this.sessions.get(sessionId);
        if (client) {
            logger_1.logger.info({ sessionId }, 'Removing WhatsApp session');
            client.destroy();
            this.sessions.delete(sessionId);
        }
    }
    /**
     * Listar todas as sessões
     */
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
    /**
     * Obter status de uma sessão
     */
    getSessionStatus(sessionId) {
        return this.sessions.get(sessionId)?.getStatus();
    }
    /**
     * Obter número de telefone de uma sessão conectada
     */
    getSessionPhoneNumber(sessionId) {
        const client = this.sessions.get(sessionId);
        if (client) {
            const snapshot = client.getSnapshot();
            return snapshot.phoneNumber;
        }
        return undefined;
    }
}
exports.SessionManager = SessionManager;
