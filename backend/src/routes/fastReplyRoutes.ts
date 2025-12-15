import express from "express";
import isAuth from "../middleware/isAuth";

import * as FastReplyController from "../controllers/FastReplyController";

const fastReplyRoutes = express.Router();

fastReplyRoutes.post("/", isAuth, FastReplyController.store);
fastReplyRoutes.get("/", isAuth, FastReplyController.index);
fastReplyRoutes.put(
  "/:fastReplyId",
  isAuth,
  FastReplyController.update
);
fastReplyRoutes.delete(
  "/:fastReplyId",
  isAuth,
  FastReplyController.remove
);

export default fastReplyRoutes;
