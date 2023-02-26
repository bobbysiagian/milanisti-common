import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/http_error';
export declare const GlobalExceptionHandler: (error: HttpError, req: Request, res: Response, _next: NextFunction) => Response;
export default GlobalExceptionHandler;
//# sourceMappingURL=exception.d.ts.map