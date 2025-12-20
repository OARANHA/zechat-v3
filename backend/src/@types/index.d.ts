import { Request } from "express";
import { User, Whatsapp } from "../models";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string | number;
        email: string;
        profile: string;
      };
      APIAuth?: {
        id: string;
        tenantId: string | number;
        name: string;
        token: string;
        sessionId?: string;
        apiId?: string;
      };
    }
  }
}

// Tipos WABA360
export interface WabaMessage {
  timestamp: number;
  type: string;
  from?: string;
  to?: string;
  fromMe?: boolean;
  recipient_type?: string;
  id?: string;
  message_id?: string;
  text?: {
    body: string;
  };
  image?: {
    id: string;
    caption?: string;
    mime_type?: string;
  };
  audio?: {
    id: string;
    mime_type?: string;
  };
  video?: {
    id: string;
    caption?: string;
    mime_type?: string;
  };
  document?: {
    id: string;
    caption?: string;
    filename?: string;
    mime_type?: string;
  };
  voice?: {
    id: string;
    mime_type?: string;
  };
  interactive?: {
    type: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface WABAContact {
  profile: {
    name: string;
  } | string;
  wa_id: string;
}

export interface WabaContext {
  id: string;
  from: string;
  to: string;
  timestamp: string;
  contacts?: Array<{
    profile_name?: string;
    profile?: string;
    wa_id: string;
  }>;
  messages?: Array<{
    id: string;
    from: string;
    text?: {
      body: string;
    };
    type: string;
  }>;
  [key: string]: any;
}

export interface WabaResponse {
  messages?: Array<{
    id: string;
    status: string;
  }>;
  contacts?: Array<{
    input: string;
    wa_id: string;
  }>;
  errors?: Array<{
    code: number;
    title: string;
    details?: string;
  }>;
  [key: string]: any;
}

export {};
