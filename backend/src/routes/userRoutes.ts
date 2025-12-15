import { Router } from "express";

import * as UserController from "../controllers/UserController";
import isAuth from "../middleware/isAuth";

const userRoutes = Router();

// prefixo /users já vem de routes.use('/users', userRoutes)

userRoutes.get(
  "/",
  isAuth,
  UserController.index
);

userRoutes.post(
  "/",
  isAuth,
  UserController.store
);

userRoutes.put(
  "/:userId",
  isAuth,
  UserController.update
);

userRoutes.put(
  "/:userId/configs",
  isAuth,
  UserController.updateConfigs
);

userRoutes.get(
  "/:userId",
  isAuth,
  UserController.show
);

userRoutes.delete(
  "/:userId",
  isAuth,
  UserController.remove
);

export default userRoutes;
