"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
class WebhookService {
    async post(webhookUrl, payload) {
        try {
            await axios_1.default.post(webhookUrl, payload, {
                timeout: 10000,
                headers: {
                    "content-type": "application/json",
                    ...(env_1.env.appWebhookApiKey ? { "x-28web-gateway-key": env_1.env.appWebhookApiKey } : {})
                }
            });
        }
        catch (err) {
            logger_1.logger.error({ err, webhookUrl }, "WebhookService.post failed");
        }
    }
}
exports.WebhookService = WebhookService;
