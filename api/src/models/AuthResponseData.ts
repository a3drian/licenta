import { IAuthResponseData } from 'foodspy-shared';

export class AuthResponseData implements IAuthResponseData {
    email!: string;
    id!: string;
    targetCalories!: number;
    token!: string;
    expiresIn!: number;
 
    public constructor(partial?: Partial<AuthResponseData>) {
       Object.assign(this, partial);
    }
 }