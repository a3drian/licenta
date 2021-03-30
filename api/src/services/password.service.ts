import * as bcrypt from 'bcrypt';

export { encryptPassword, decryptPassword }

const SALT_ROUNDS = 10;

function encryptPassword(password: string): string {
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    return hash;
}

function decryptPassword(password: string, hash: string): boolean {
    const match = bcrypt.compareSync(password, hash);
    return match;
}