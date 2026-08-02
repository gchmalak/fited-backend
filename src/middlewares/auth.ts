import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/responseFormatter.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

interface AccessTokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function CheckAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      errorResponse(res, "No authorization header", StatusCodes.UNAUTHORIZED);
      return;
    }

    // extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      errorResponse(res, "No token provided", StatusCodes.UNAUTHORIZED);
      return;
    }

    // Verify token
    const payload = jwt.verify(
      token,
      process.env.AUTH_SECRET!,
    ) as AccessTokenPayload;
    if (!payload) {
      errorResponse(res, "Unverified token used", StatusCodes.UNAUTHORIZED);
      return;
    }

    // Find user and attach to request
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      errorResponse(res, "User not found or deleted", StatusCodes.UNAUTHORIZED);
      return;
    }

    if (!user.isActive) {
      errorResponse(res, "Your account has been deactivated", StatusCodes.FORBIDDEN);
      return;
    }

    req.user = user.toObject() as Express.Request["user"];
    next();
  } catch (err) {
    next(err);
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.isAdmin) {
    next();
  } else {
    errorResponse(
      res,
      "You are not an admin, you can't access this route",
      StatusCodes.FORBIDDEN,
    );
  }
}
