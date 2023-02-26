import { NextFunction, Request, Response } from 'express';
export declare const StaticAuth: ({ headerName, headerValue }: {
    headerName?: string | undefined;
    headerValue: string;
}) => (req: Request, _res: Response, next: NextFunction) => void;
export default StaticAuth;
//# sourceMappingURL=static_auth.d.ts.map