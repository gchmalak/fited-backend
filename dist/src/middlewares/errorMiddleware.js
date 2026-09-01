import { errorResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
export function errorMiddleware(err, req, res, next) {
    console.log(err);
    // zod validation error
    if (err instanceof ZodError) {
        errorResponse(res, "Validation failed", StatusCodes.BAD_REQUEST);
        return;
    }
    //mongoose duplicate key error(if email  already exists for ex)
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
        errorResponse(res, "This value already exists ", StatusCodes.CONFLICT);
        return;
    }
    errorResponse(res, "Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
}
