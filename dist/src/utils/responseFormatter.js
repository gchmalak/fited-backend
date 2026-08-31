import { StatusCodes } from "http-status-codes";
export function successResponse(res, data, message = "Success", statusCode = StatusCodes.OK, token) {
    res.status(statusCode).json({ success: true, message, data, token });
}
export function errorResponse(res, message = "Error occurred", statusCode = StatusCodes.INTERNAL_SERVER_ERROR, field) {
    const body = { error: message };
    if (field)
        body.field = field;
    res.status(statusCode).json(body);
}
export function paginatedResponse(res, data, pagination, message = "Success") {
    res.status(StatusCodes.OK).json({
        success: true,
        message,
        data,
        totalCount: pagination.totalCount,
        totalPages: pagination.totalPages,
        currentPage: pagination.currentPage,
    });
}
export function noContentResponse(res) {
    res.status(StatusCodes.NO_CONTENT).send();
}
