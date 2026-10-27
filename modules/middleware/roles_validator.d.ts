import { Request } from 'express';
import { IObject } from '../typings';
export declare const getRoles: <Tokenable extends IObject>(req: Request) => Promise<string[]>;
export declare const RolesValidator: (roles: string[]) => any;
export default RolesValidator;
//# sourceMappingURL=roles_validator.d.ts.map