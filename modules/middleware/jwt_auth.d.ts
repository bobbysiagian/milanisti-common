import { NextFunction, Request, Response } from 'express';
import { JWTAuthClaims } from '../typings';
export declare const JWTMiddleware: <Tokenable extends JWTAuthClaims>(req: Request, _res: Response, next: NextFunction) => Promise<void>;
export default JWTMiddleware;
//# sourceMappingURL=jwt_auth.d.ts.map