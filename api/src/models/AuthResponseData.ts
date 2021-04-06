import { IAuthResponseData } from '../interfaces/IAuthResponseData';

export class AuthResponseData implements IAuthResponseData {
    email!: string;
    // response properties
    id!: string;
    token!: string;
    expiresIn!: number;
}