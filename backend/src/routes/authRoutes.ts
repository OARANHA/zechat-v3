import { Router } from "express";
import * as SessionController from "../controllers/SessionController";
import * as UserController from "../controllers/UserController";
import CreateUserService from "../services/UserServices/CreateUserService";

const authRoutes = Router();

// Signup não precisa de autenticação
authRoutes.post("/signup", async (req, res) => {
  try {
    const { email, password, name, profile = "user" } = req.body;
    
    // Para signup, usar tenantId padrão 1
    const tenantId = 1;
    
    const user = await CreateUserService({
      email,
      password,
      name,
      profile,
      tenantId
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ 
      error: error.message || "ERR_USER_CREATION_FAILED" 
    });
  }
});

authRoutes.post("/login", SessionController.store);
authRoutes.post("/logout", SessionController.logout);

authRoutes.post("/refresh_token", SessionController.update);

export default authRoutes;
