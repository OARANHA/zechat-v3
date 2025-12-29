"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = exports.logWarn = exports.logError = exports.logInfo = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
// Configuração do logger com suporte a desenvolvimento e produção
const isDevelopment = process.env.NODE_ENV !== 'production';
const loggerConfig = isDevelopment
    ? {
        level: process.env.LOG_LEVEL || 'debug',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
                singleLine: false,
            },
        },
    }
    : {
        level: process.env.LOG_LEVEL || 'info',
    };
const logger = (0, pino_1.default)(loggerConfig);
exports.logger = logger;
// Função de log personalizada para facilitar uso
const logInfo = (message, meta) => {
    logger.info(message, meta);
};
exports.logInfo = logInfo;
const logError = (message, error) => {
    logger.error(message, error);
};
exports.logError = logError;
const logWarn = (message, meta) => {
    logger.warn(message, meta);
};
exports.logWarn = logWarn;
const logDebug = (message, meta) => {
    logger.debug(message, meta);
};
exports.logDebug = logDebug;
