"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT || 3001),
    apiKey: process.env.API_KEY,
    appWebhookApiKey: process.env.APP_WEBHOOK_API_KEY,
    redisUrl: process.env.REDIS_URL,
    chromeBin: process.env.CHROME_BIN,
    chromeArgs: process.env.CHROME_ARGS ? process.env.CHROME_ARGS.split(",") : undefined,
    wwebjsAuthPath: process.env.WWEBJS_AUTH_PATH || `${process.cwd()}/.wwebjs_auth`
};
