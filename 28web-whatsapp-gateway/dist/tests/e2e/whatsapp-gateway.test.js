"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../src/server"));
describe('WhatsApp Gateway E2E Tests', () => {
    it('should create a session', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/api/sessions')
            .send({ apiKey: 'test-key' });
        expect(response.status).toBe(201);
        expect(response.body.sessionId).toBeDefined();
    });
    it('should receive webhook events', async () => {
        const event = {
            sessionId: 'test-session-id',
            event: 'message_create',
            timestamp: Date.now(),
            data: {
                message: {
                    id: 'message-id',
                    from: 'sender-id',
                    to: 'recipient-id',
                    text: 'Hello World'
                }
            }
        };
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/api/webhook')
            .send(event);
        expect(response.status).toBe(200);
    });
});
