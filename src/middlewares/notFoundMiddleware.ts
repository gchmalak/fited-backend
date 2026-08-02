import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/responseFormatter.js";

export function notFoundMiddleware(req: Request, res: Response): void {
  errorResponse(res, `Route not found: ${req.originalUrl}`, StatusCodes.NOT_FOUND);
}