import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/responseFormatter.js";
export function notFoundMiddleware(req, res) {
    errorResponse(res, `Route not found: ${req.originalUrl}`, StatusCodes.NOT_FOUND);
}
