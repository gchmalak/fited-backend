import { NextFunction, Request, Response } from "express";
import { User } from"../models/user.js"
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { registrationSchema } from "../validation/users.js";
// _______________________LOGIN_________________________________________________________________
export async function login(req: Request, res: Response, next: NextFunction) {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      errorResponse(res, "Invalid email or password", StatusCodes.UNAUTHORIZED);
      return;
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      errorResponse(res, "Invalid email or password", StatusCodes.UNAUTHORIZED);
      return;
    }

    if (!user.isActive) {
      errorResponse(res, "Your account has been deactivated", StatusCodes.FORBIDDEN);
      return;
    }

    const userInfo = { id: user._id.toString(), role: user.role };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET!, {
      expiresIn: process.env.TOKEN_EXPIRY || "7d",
    } as jwt.SignOptions);

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;

    successResponse(res, userObj, "Login successful", StatusCodes.OK, token);
  } catch (error) {
    next(error);
  }
}
// _______________________REGISTER_________________________________________________________________
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
    const user = req.body;
    try {

  const createdUser = new User(user);
await createdUser.save();

    const userInfo = { id: createdUser._id.toString(), role: createdUser.role };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET!, {
      expiresIn: process.env.TOKEN_EXPIRY || "7d",
    } as jwt.SignOptions);

    const userObj = createdUser.toObject() as unknown as Record<
      string,
      unknown
    >;
    delete userObj.password;

    successResponse(
      res,
      userObj,
      "Registration successful",
      StatusCodes.CREATED,
      token,
    );
  } catch (error) {
    next(error);
  }
}

// ___________________CHECKUSER_________________________________________________________________
export async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;
  try {
    if (!user) {
      throw new Error("User not found");
    }
    successResponse(res, user, "User is authenticated");
  } catch (error) {
    next(error);
  }
}