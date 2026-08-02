import type { Request, Response, NextFunction } from "express";
import * as z from "zod/v4";

/**
 * Extended request with parsed query
 */
interface RequestWithParsedQuery extends Request {
  parsedQuery?: unknown;
}

/**
 * Validate request body against a Zod schema
 */
export function validateBodySchema<T extends z.ZodTypeAny>(schema: T) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const parsed = schema.safeParse(req.body);
    if (parsed.success) {
      req.body = parsed.data; // apply transforms (e.g. string → Date)
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: z.prettifyError(parsed.error),
      });
    }
  };
}

/**
 * Validate request query parameters against a Zod schema
 * Attaches parsed data to req.parsedQuery
 */
export function validateQuerySchema<T extends z.ZodTypeAny>(schema: T) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const parsed = schema.safeParse(req.query);
    if (parsed.success) {
      (req as RequestWithParsedQuery).parsedQuery = parsed.data;
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: z.prettifyError(parsed.error),
      });
    }
  };
}

/**
 * Validate URL parameters against a Zod schema
 */
export function validateParamsSchema<T extends z.ZodTypeAny>(schema: T) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const parsed = schema.safeParse(req.params);
    if (parsed.success) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: z.prettifyError(parsed.error),
      });
    }
  };
}