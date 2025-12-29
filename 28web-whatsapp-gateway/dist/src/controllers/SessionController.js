"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = require("express");
const SessionManager_1 = require("../services/SessionManager");
const logger_1 = require("../utils/logger");
const sessionRouter = (0, express_1.Router)();
exports.sessionRouter = sessionRouter;
const sessionManager = SessionManager_1.SessionManager.getInstance();
/**
 * POST /sessions
 * Criar e inicializar uma nova sessão WhatsApp
 *
 * Body esperado do backend Chatex:
 * {
 *   sessionId: "uuid",
 *   tenantId: 1,
 *   name: "Whatsapp 1",
 *   webhookUrl: "http://backend-chatex:3333/webhook/whatsapp"
 * }
 */
sessionRouter.post('/', async (req, res) => {
    try {
        const { sessionId, tenantId, name, webhookUrl } = req.body;
        // Validação
        if (!sessionId || !tenantId || !name) {
            return res.status(400).json({
                error: 'Missing required fields: sessionId, tenantId, name'
            });
        }
        logger_1.logger.info({ sessionId, tenantId }, 'Creating WhatsApp session');
        // 1. Criar configuração
        const config = {
            sessionId,
            tenantId,
            name,
            webhookUrl
        };
        // 2. Criar e inicializar cliente (isso pode demorar)
        const client = await sessionManager.createSession(config);
        logger_1.logger.info({ sessionId }, 'WhatsApp client initialized, waiting for QR code');
        // 3. Aguardar QR code ser gerado (máximo 60 segundos)
        const qrCode = await client.waitForQRCode(60000);
        // 4. Retornar resposta
        res.status(201).json({
            sessionId,
            status: client.getStatus(),
            qrCode, // ✅ RETORNA O QR CODE!
            phoneNumber: sessionManager.getSessionPhoneNumber(sessionId),
            message: qrCode
                ? 'QR code generated, scan with WhatsApp'
                : 'Session created, but QR code not generated yet'
        });
    }
    catch (error) {
        logger_1.logger.error(error, 'Error creating WhatsApp session');
        res.status(500).json({
            error: 'Failed to create WhatsApp session',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * GET /sessions/:sessionId/qrcode
 * Obter o QR code atual de uma sessão
 */
sessionRouter.get('/:sessionId/qrcode', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const client = sessionManager.getSession(sessionId);
        if (!client) {
            return res.status(404).json({ error: 'Session not found' });
        }
        const qrCode = client.getQRCode();
        if (!qrCode) {
            return res.status(202).json({
                message: 'QR code not available yet',
                status: client.getStatus()
            });
        }
        res.json({ qrCode, status: client.getStatus() });
    }
    catch (error) {
        logger_1.logger.error(error, 'Error getting QR code');
        res.status(500).json({ error: 'Failed to get QR code' });
    }
});
/**
 * GET /sessions/:sessionId/status
 * Obter status de uma sessão
 */
sessionRouter.get('/:sessionId/status', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const client = sessionManager.getSession(sessionId);
        if (!client) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json({
            sessionId,
            status: client.getStatus(),
            phoneNumber: sessionManager.getSessionPhoneNumber(sessionId),
            hasQRCode: !!client.getQRCode()
        });
    }
    catch (error) {
        logger_1.logger.error(error, 'Error getting session status');
        res.status(500).json({ error: 'Failed to get session status' });
    }
});
/**
 * DELETE /sessions/:sessionId
 * Encerrar uma sessão
 */
sessionRouter.delete('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        sessionManager.removeSession(sessionId);
        res.json({ message: 'Session terminated' });
    }
    catch (error) {
        logger_1.logger.error(error, 'Error deleting session');
        res.status(500).json({ error: 'Failed to delete session' });
    }
});
