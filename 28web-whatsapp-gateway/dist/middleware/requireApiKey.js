"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireApiKey = void 0;
const env_1 = require("../config/env");
function requireApiKey(req, res, next) {
    // Se não houver API_KEY configurada, roda "aberto" (útil em dev local), mas loga.
    if (!env_1.env.apiKey)
        return next();
    const provided = req.header("x-api-key");
    if (!provided || provided !== env_1.env.apiKey) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    next();
}
exports.requireApiKey = requireApiKey;
