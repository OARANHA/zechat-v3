import express from "express";
import isAuth from "../middleware/isAuth";

import * as ChatFlowController from "../controllers/ChatFlowController";

const chatFlowRoutes = express.Router();

chatFlowRoutes.post("/", isAuth, ChatFlowController.store);
chatFlowRoutes.get("/", isAuth, ChatFlowController.index);
chatFlowRoutes.put("/:chatFlowId", isAuth, ChatFlowController.update);
chatFlowRoutes.delete(
  "/:chatFlowId",
  isAuth,
  ChatFlowController.remove
);
// chatFlowRoutes.delete(
//   "/auto-reply/:autoReplyId",
//   isAuth,
//   AutoReplyController.remove
// );

export default chatFlowRoutes;
