import { NextFunction, Request, Response } from "express";
import { Editorial } from "../models/editorial.js";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";

export async function getEditorials(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const editorials = await Editorial.find();
    successResponse(res, editorials);
  } catch (err) {
    next(err);
  }
}

export async function updateEditorial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slot } = req.params;

    if (slot !== "editorial-1" && slot !== "editorial-2") {
      errorResponse(res, "Invalid editorial slot", StatusCodes.BAD_REQUEST);
      return;
    }

    const editorial = await Editorial.findOneAndUpdate(
      { slot },
      { ...req.body, slot },
      { new: true, upsert: true, runValidators: true },
    );

    successResponse(res, editorial, "Editorial section updated!");
  } catch (err) {
    next(err);
  }
}