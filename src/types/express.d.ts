import type { Types } from "mongoose";
import type { Request } from "express";
import { IUser } from "./models/user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        email: string;
        username: string;
        role: "owner" | "admin" | "user";
        /** Virtual: true when role === 'admin' or 'owner'. Populated by Mongoose virtual. */
        isAdmin: boolean;
        /** Virtual: true when role === 'owner'. Populated by Mongoose virtual. */
        isOwner: boolean;
        isActive: boolean;
        avatarUrl?: string;
        bio?: string;
        updatedAt: Date;
        createdAt: Date;
      };
      parsedQuery?: unknown;
    }
  }
}

export type {};