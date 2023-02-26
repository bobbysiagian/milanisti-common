import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils/http_error';
import { COMMON_ERRORS, LOG_SOURCE, MANDATORY_REQUEST_HEADER } from '../utils/constant';
import { createLogerInstance } from '../factory';
import { isServerError } from '../utils/helpers';

const getDataFromRequest = (req: Request): Record<string, any> => ({
    query: req.query,
    params: req.params,
    body: req.body
});

export const GlobalExceptionHandler = (error: HttpError, req: Request, res: Response, _next: NextFunction): Response => {
    const { message, httpStatus = StatusCodes.INTERNAL_SERVER_ERROR, name, data, code } = error;
    const logger = createLogerInstance({ source: LOG_SOURCE.GLOBAL });

    if (error && error.stack) {
        if (isServerError(httpStatus)) {
            logger.error(message, { error, data: getDataFromRequest(req), context: req.context });
        } else {
            logger.warn('%s: %s', name, message);
        }
    }

    const response = {
        error_name: httpStatus === StatusCodes.INTERNAL_SERVER_ERROR ? COMMON_ERRORS.SERVER_ERROR : name,
        error_message: message,
        error_code: code || httpStatus,
        error_data: data
    };

    return res.status(httpStatus)
        .set(MANDATORY_REQUEST_HEADER.REQUEST_ID, req.context?.request_id || '')
        .json(response);
};

export default GlobalExceptionHandler;
