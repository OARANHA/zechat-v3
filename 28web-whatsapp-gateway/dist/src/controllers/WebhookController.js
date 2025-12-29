"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRouter = void 0;
const express_1 = require("express");
const webhookRouter = (0, express_1.Router)();
exports.webhookRouter = webhookRouter;
webhookRouter.post('/', (req, res) => {
    try {
        const event = req.body;
        console.log('Received webhook event:', event);
        // Simulate event processing
        console.log('Processing event:', event.event);
        // Simulate successful processing
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Error processing webhook event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
