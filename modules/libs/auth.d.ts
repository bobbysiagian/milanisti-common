export interface RefreshToken {
    token: string;
    valid_until: string;
}
export declare class Auth {
    private static SALT;
    private static REFRESH_TOKEN_LENGTH;
    private static REFRESH_TOKEN_LIFETIME;
    private static getKey;
    static generateToken<Claims extends Record<string, any>>(claims: Claims, withLifetime?: boolean): {
        token: string;
        lifetime: number;
    };
    static verifyJwtToken(token: string): any;
    static generateRefreshToken(): RefreshToken;
    static generateHash(password: string): string;
    static validatePassword: (password: string, hash: string) => boolean;
}
export default Auth;
//# sourceMappingURL=auth.d.ts.map