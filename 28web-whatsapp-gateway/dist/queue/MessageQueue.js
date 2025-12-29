"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
class MessageQueue {
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
        if (!env_1.env.redisUrl) {
            logger_1.logger.warn("REDIS_URL não configurado. MessageQueue desabilitada (envio será síncrono).");
            return;
        }
        this.queue = new bull_1.default("28web_whatsapp_send_message", env_1.env.redisUrl);
        this.queue.process(async (job) => {
            const session = this.sessionManager.getSession(job.data.sessionId);
            if (!session)
                throw new Error("Session not found");
            await session.sendMessage(job.data.to, job.data.body);
        });
    }
    isEnabled() {
        return Boolean(this.queue);
    }
    async enqueueSendMessage(data) {
        if (!this.queue)
            throw new Error("Queue disabled");
        await this.queue.add(data, {
            attempts: 3,
            backoff: 5000,
            removeOnComplete: true,
            removeOnFail: true
        });
    }
}
exports.MessageQueue = MessageQueue;
