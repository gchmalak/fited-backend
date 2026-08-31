import * as z from "zod/v4";
/**
 * Validate request body against a Zod schema
 */
export function validateBodySchema(schema) {
    return async function (req, res, next) {
        const parsed = schema.safeParse(req.body);
        if (parsed.success) {
            req.body = parsed.data; // apply transforms (e.g. string → Date)
            next();
        }
        else {
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
export function validateQuerySchema(schema) {
    return async function (req, res, next) {
        const parsed = schema.safeParse(req.query);
        if (parsed.success) {
            req.parsedQuery = parsed.data;
            next();
        }
        else {
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
export function validateParamsSchema(schema) {
    return async function (req, res, next) {
        const parsed = schema.safeParse(req.params);
        if (parsed.success) {
            next();
        }
        else {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: z.prettifyError(parsed.error),
            });
        }
    };
}
