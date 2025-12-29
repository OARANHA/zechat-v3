"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppClient = void 0;
/* eslint-disable camelcase */
const whatsapp_web_js_1 = require("whatsapp-web.js");
const path_1 = __importDefault(require("path"));
const qrcode_1 = __importDefault(require("qrcode"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const WebhookService_1 = require("./WebhookService");
class WhatsAppClient {
    constructor(cfg) {
        this.status = "connecting";
        this.sessionId = cfg.sessionId;
        this.tenantId = cfg.tenantId;
        this.name = cfg.name;
        this.webhookUrl = cfg.webhookUrl;
        this.webhook = new WebhookService_1.WebhookService();
        const args = env_1.env.chromeArgs || [];
        args.unshift(`--user-agent=${whatsapp_web_js_1.DefaultOptions.userAgent}`);
        this.client = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.LocalAuth({
                clientId: `wbot-${this.sessionId}`,
                dataPath: path_1.default.resolve(env_1.env.wwebjsAuthPath)
            }),
            takeoverOnConflict: true,
            puppeteer: {
                executablePath: env_1.env.chromeBin || undefined,
                args
            },
            qrMaxRetries: 5
        });
        this.bindEvents();
    }
    bindEvents() {
        this.client.on("qr", async (qr) => {
            this.status = "qr_code";
            this.currentQrDataUrl = await qrcode_1.default.toDataURL(qr);
            await this.emitWebhook("change_state", { status: this.status });
        });
        this.client.on("authenticated", async () => {
            logger_1.logger.info({ sessionId: this.sessionId }, "authenticated");
        });
        this.client.on("auth_failure", async (msg) => {
            this.status = "error";
            this.lastError = msg;
            logger_1.logger.error({ sessionId: this.sessionId, msg }, "auth_failure");
            await this.emitWebhook("disconnected", { reason: "auth_failure", msg });
        });
        this.client.on("ready", async () => {
            this.status = "connected";
            this.phoneNumber = this.client.info?.wid?.user;
            logger_1.logger.info({ sessionId: this.sessionId, phoneNumber: this.phoneNumber }, "ready");
            await this.emitWebhook("change_state", { status: this.status, phoneNumber: this.phoneNumber });
        });
        // Eventos de mensagens (para integração com o Core via webhook)
        this.client.on("message_create", async (msg) => {
            if (msg.isStatus)
                return;
            await this.emitWebhook("message_create", {
                messageId: msg.id.id,
                from: msg.from,
                to: msg.to,
                body: msg.body,
                timestamp: msg.timestamp,
                fromMe: msg.fromMe,
                hasMedia: msg.hasMedia,
                type: msg.type
            });
        });
        this.client.on("message_ack", async (msg, ack) => {
            await this.emitWebhook("message_ack", {
                messageId: msg.id.id,
                ack
            });
        });
        this.client.on("message_edit", async (msg, newBody) => {
            await this.emitWebhook("message_edit", {
                messageId: msg.id.id,
                newBody
            });
        });
        this.client.on("message_revoke_everyone", async (_after, before) => {
            await this.emitWebhook("message_revoke_everyone", {
                body: before?.body
            });
        });
        this.client.on("change_state", async (newState) => {
            await this.emitWebhook("change_state", { newState });
        });
        this.client.on("change_battery", async (batteryInfo) => {
            await this.emitWebhook("change_battery", batteryInfo);
        });
        this.client.on("disconnected", async (reason) => {
            this.status = "disconnected";
            await this.emitWebhook("disconnected", { reason });
        });
    }
    async emitWebhook(event, data) {
        if (!this.webhookUrl)
            return;
        const payload = {
            sessionId: this.sessionId,
            event,
            data,
            timestamp: Date.now()
        };
        await this.webhook.post(this.webhookUrl, payload);
    }
    async initialize() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('WhatsApp client initialization timeout'));
            }, 60000); // 60 segundos
            // Se já está ready, resolve logo
            if (this.status === 'connected') {
                clearTimeout(timeout);
                resolve();
                return;
            }
            // Espera o evento 'ready' ou 'qr'
            const onReady = () => {
                clearTimeout(timeout);
                this.client.off('ready', onReady);
                resolve();
            };
            const onQR = () => {
                // QR code gerado, cliente está pronto para escaneamento
            };
            this.client.on('ready', onReady);
            this.client.on('qr', onQR);
            this.status = "connecting";
            this.client.initialize().catch((error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }
    /**
     * Aguardar QR code ser gerado
     */
    async waitForQRCode(timeoutMs = 60000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            // Se já temos QR code, retorna imediatamente
            if (this.currentQrDataUrl) {
                logger_1.logger.info({ sessionId: this.sessionId }, `QR code already available`);
                resolve(this.currentQrDataUrl);
                return;
            }
            const checkQRCode = () => {
                if (this.currentQrDataUrl) {
                    logger_1.logger.info({ sessionId: this.sessionId }, `QR code found after ${Date.now() - startTime}ms`);
                    resolve(this.currentQrDataUrl);
                    return;
                }
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime > timeoutMs) {
                    logger_1.logger.warn({ sessionId: this.sessionId }, `QR code timeout after ${elapsedTime}ms`);
                    resolve(undefined);
                    return;
                }
                // Verifica novamente em 500ms
                setTimeout(checkQRCode, 500);
            };
            checkQRCode();
        });
    }
    async destroy() {
        try {
            await this.client.destroy();
        }
        catch (err) {
            logger_1.logger.error({ err, sessionId: this.sessionId }, "destroy failed");
        }
    }
    /**
     * Obter o QR code atual em formato Data URL
     */
    getQRCode() {
        return this.currentQrDataUrl;
    }
    async logout() {
        try {
            await this.client.logout();
            this.status = "disconnected";
        }
        catch (err) {
            logger_1.logger.error({ err, sessionId: this.sessionId }, "logout failed");
        }
    }
    async sendMessage(to, body) {
        const chatId = to;
        const res = await this.client.sendMessage(chatId, body || "");
        return { messageId: res.id.id };
    }
    async getContacts() {
        try {
            const contacts = await this.client.getContacts();
            return contacts.map(contact => ({
                number: contact.number || contact.id?.user || contact.id?.server || contact.pushname || '',
                name: contact.name || contact.pushname || contact.number || contact.id?.user || 'Unknown'
            }));
        }
        catch (err) {
            logger_1.logger.error({ err, sessionId: this.sessionId }, "Failed to get contacts");
            throw new Error(`Failed to get contacts: ${err?.message || 'Unknown error'}`);
        }
    }
    // Métodos getters para o SessionManager
    getTenantId() {
        return this.tenantId;
    }
    getName() {
        return this.name;
    }
    /**
     * Obter status atual
     */
    getStatus() {
        return this.status;
    }
    getWebhookUrl() {
        return this.webhookUrl;
    }
    getSnapshot() {
        return {
            sessionId: this.sessionId,
            status: this.status,
            qrCode: this.currentQrDataUrl,
            phoneNumber: this.phoneNumber,
            error: this.lastError
        };
    }
}
exports.WhatsAppClient = WhatsAppClient;
