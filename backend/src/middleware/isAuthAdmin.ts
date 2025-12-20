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

const isAuthAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const adminDomain = process.env.ADMIN_DOMAIN;

  if (!authHeader) {
    throw new AppError("Token was not provided.", 403);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.secret);
    const { id, profile, tenantId, username } = decoded as TokenPayload;
    const user = await User.findByPk(id);
    
    // Super admin tem acesso, ou validar domínio admin
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    if (profile === "super") {
      // Super admin sempre tem acesso
      req.user = {
        id,
        profile,
        tenantId,
        email: user.email
      };
    } else if (!adminDomain || user.email.indexOf(adminDomain) === -1) {
      throw new AppError("Not admin permission", 403);
    } else {
      req.user = {
        id,
        profile,
        tenantId,
        email: user.email
      };
    }
  } catch (err: any) {
    if (err.statusCode) {
      throw err;
    }
    throw new AppError("Invalid token or not Admin", 403);
  }

  return next();
};

export default isAuthAdmin;