import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError";
import authConfig from "../config/auth";
import User from "../models/User";

interface TokenPayload {
  id: string;
  username: string;
  profile: string;
  tenantId: number;
  iat: number;
  exp: number;
}

/**
 * Middleware para validar Super Admin
 * Verifica se usuário é 'super' e está autenticado
 */
export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
      const decoded = verify(token, authConfig.secret);
      const { id, profile, tenantId, username } = decoded as TokenPayload;

      // Validar se é super admin
      if (profile !== "super") {
        throw new AppError("Acesso restrito a Super Admin", 403);
      }

      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      req.user = {
        id,
        profile,
        tenantId,
        email: `${username}@default.com`
      };

      return next();
    } catch (err: any) {
      if (err.statusCode) throw err;
      throw new AppError("Token inválido ou expirado", 401);
    }
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      error: error.message || "Erro de autenticação"
    });
  }
};

/**
 * Middleware para validar Admin (não super)
 * Verifica se usuário é 'admin' e está autenticado
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
      const decoded = verify(token, authConfig.secret);
      const { id, profile, tenantId, username } = decoded as TokenPayload;

      // Validar se é admin
      if (!["admin", "super"].includes(profile)) {
        throw new AppError("Acesso restrito a Admin", 403);
      }

      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      req.user = {
        id,
        profile,
        tenantId,
        email: `${username}@default.com`
      };

      return next();
    } catch (err: any) {
      if (err.statusCode) throw err;
      throw new AppError("Token inválido ou expirado", 401);
    }
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      error: error.message || "Erro de autenticação"
    });
  }
};

/**
 * Middleware para validar qualquer usuário autenticado
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
      const decoded = verify(token, authConfig.secret);
      const { id, profile, tenantId, username } = decoded as TokenPayload;

      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      req.user = {
        id,
        profile,
        tenantId,
        email: `${username}@default.com`
      };

      return next();
    } catch (err: any) {
      if (err.statusCode) throw err;
      throw new AppError("Token inválido ou expirado", 401);
    }
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      error: error.message || "Erro de autenticação"
    });
  }
};
