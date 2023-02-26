import { NextFunction, Request, Response } from 'express';
import Auth from '../libs/auth';
import { IObject } from '../typings';
import { ForbiddenError } from '../utils/http_error';

export const getRoles = async <Tokenable extends IObject>(req: Request): Promise<string[]> => {
    const authorizationToken: string | undefined = req.headers.authorization;
    if (!authorizationToken) {
        return [];
    }

    const [type, token] = authorizationToken.split(' ');
    if (!token || type !== 'Bearer') {
        return [];
    }

    try {
        const tokenPayload: Tokenable = await Auth.verifyJwtToken(token);
        return tokenPayload?.roles;
    } catch (err) {
        return [];
    }
};

export const RolesValidator = (roles: string[]): any => (req: Request, _res: Response, next: NextFunction): void => {
    getRoles(req)
        .then((userRoles): void => {
            for (const role of roles) {
                for (const userRole of userRoles) {
                    if (userRole.trim().toLowerCase() === role.trim().toLowerCase()) {
                        return next();
                    }
                }
            }
            throw new ForbiddenError('your roles are not allowed to hit this endpoint', 'FORBIDDEN');
        })
        .catch((err): void => next(err));
};


export default RolesValidator;
