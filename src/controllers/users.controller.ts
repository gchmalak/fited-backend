import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import {
  errorResponse,
  paginatedResponse,
  successResponse,
} from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { getPaginationSkip, getTotalPages } from "../utils/pagination.js";

// _____________________getAllUsers______________________
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { page, limit } = req.parsedQuery as {
      page: number;
      limit: number;
    };

    const skip = getPaginationSkip(page, limit);

const {role, search} =req.query as Record<string , string | undefined>
const  filter : Record<string , unknown>={}
if(role === "admin" || role === "user"){
  filter.role = role
}
if(search){
  const regex = {$regex : search, $options:"i"}
  filter.$or =[{username: regex},{email:regex}]}

    const totalCount = await User.countDocuments(filter);
    const totalPages = getTotalPages(totalCount, limit);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(res, users, {
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
}

// _____________________updateUserRole______________________
export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, user, "User role updated!");
  } catch (err) {
    next(err);
  }
}

// _____________________deactivateUser______________________
export async function deactivateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, user, "User deactivated!");
  } catch (err) {
    next(err);
  }
}

// _____________________reactivateUser______________________
export async function reactivateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, user, "User reactivated!");
  } catch (err) {
    next(err);
  }
}