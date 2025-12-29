"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const logger_1 = require("../utils/logger");
class HealthService {
    constructor(sessionManager, messageQueue, redis) {
        this.sessionManager = sessionManager;
        this.messageQueue = messageQueue;
        this.redis = redis;
        this.startTime = Date.now();
        this.metrics = {
            totalMessagesProcessed: 0,
            totalResponseTime: 0,
            totalRequests: 0,
            totalErrors: 0,
            lastMetricsReset: Date.now()
        };
    }
    // Métodos existentes...
    async getDiskUsage() {
        const disk = require('diskusage');
        const path = process.platform === 'win32' ? 'c:' : '/';
        const { total, free } = disk.checkSync(path);
        return {
            total,
            free,
            used: total - free
        };
    }
    resetMetrics() {
        this.metrics = {
            totalMessagesProcessed: 0,
            totalResponseTime: 0,
            totalRequests: 0,
            totalErrors: 0,
            lastMetricsReset: Date.now()
        };
        logger_1.logger.info('Métricas resetadas');
    }
    calculateAverageResponseTime() {
        if (this.metrics.totalRequests === 0)
            return 0;
        return Math.round(this.metrics.totalResponseTime / this.metrics.totalRequests);
    }
    calculateErrorRate() {
        if (this.metrics.totalRequests === 0)
            return 0;
        return Math.round((this.metrics.totalErrors / this.metrics.totalRequests) * 100);
    }
}
exports.HealthService = HealthService;
