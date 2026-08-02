

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
        role: "admin" | "user";
        /** Virtual: true when role === 'admin'. Populated by Mongoose virtual. */
        isAdmin: boolean;
        isActive:boolean;
        avatarUrl?: string;
        bio?: string;
        updatedAt: Date;
        createdAt: Date ;
      };
      parsedQuery?: unknown;
    }
  }
}

export type {};

// export interface AuthenticatedRequest extends Request {
//   /** Authenticated user attached by auth middleware */
//   user: IUserDocument;
// }