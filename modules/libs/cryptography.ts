import Cryptr = require('cryptr')

export class Cryptography {
    public static encrypt( key: string, value: string ): string {
        const cryptr = new Cryptr(key);
        return  cryptr.encrypt(value);
    }

    public static decrypt( key: string, value: string ): string {
        const cryptr = new Cryptr(key);
        return  cryptr.decrypt(value);
    }
}

export default Cryptography
