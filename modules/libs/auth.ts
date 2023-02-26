import * as bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as random from 'randomstring';

export interface RefreshToken {
    token: string;
    valid_until: string;
}

export class Auth {
    private static SALT = 10;
    private static REFRESH_TOKEN_LENGTH = 50;
    private static REFRESH_TOKEN_LIFETIME = 7; // days

    private static getKey(): { privateKey: string, publicKey: string } {
        let privateKey = String(process.env.JWT_SECRET || 'default')
        let publicKey = String(process.env.JWT_SECRET || 'default')

        if (String(process.env.JWT_USE_PAIR_KEY) == 'true') {
            const privateKeyFile = readFileSync(String(process.env.JWT_PRIVATE_KEY_PATH || ''))
            const publicKeyFile = readFileSync(String(process.env.JWT_PUBLIC_KEY_PATH || ''))
            
            privateKey = privateKeyFile.toString()
            publicKey = publicKeyFile.toString()
        }

        return { privateKey, publicKey }
    }

    public static generateToken<Claims extends Record<string, any>>(claims: Claims, withLifetime = true): { token: string; lifetime: number } {
        const lifetime = Number(process.env.JWT_LIFETIME || 3600);

        const options: jwt.SignOptions = {};
        if (withLifetime) {
            options.expiresIn = lifetime;
        }

        const token = jwt.sign(claims, this.getKey().privateKey, options);

        return {
            token,
            lifetime
        };
    }

    public static verifyJwtToken(token: string): any {
        return jwt.verify(token, this.getKey().publicKey);
    }

    public static generateRefreshToken(): RefreshToken {
        return {
            token: random.generate(Auth.REFRESH_TOKEN_LENGTH),
            valid_until: moment().add(Auth.REFRESH_TOKEN_LIFETIME, 'days').utc().format()
        };
    }

    public static generateHash(password: string): string {
        return bcrypt.hashSync(password, Auth.SALT);
    }

    public static validatePassword = (password: string, hash: string): boolean => {
        return bcrypt.compareSync(password, hash);
    };
}

export default Auth;
