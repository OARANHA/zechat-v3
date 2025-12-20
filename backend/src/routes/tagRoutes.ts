import express from "express";
import isAuth from "../middleware/isAuth";

import * as TagController from "../controllers/TagController";

const tagRoutes = express.Router();

/**
 * Rotas de Tags
 *
 * Prefixo em routes/index.ts:
 *   routes.use('/api/tags', tagRoutes);
 *
 * Endpoints finais:
 *   POST   /api/tags
 *   GET    /api/tags
 *   PUT    /api/tags/:tagId
 *   DELETE /api/tags/:tagId
 */

tagRoutes.post("/", isAuth, TagController.store);
tagRoutes.get("/", isAuth, TagController.index);
tagRoutes.put("/:tagId", isAuth, TagController.update);
tagRoutes.delete("/:tagId", isAuth, TagController.remove);

export default tagRoutes;
