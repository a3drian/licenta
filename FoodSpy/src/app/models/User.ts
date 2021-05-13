import { IUser } from 'foodspy-shared';

export class User implements IUser {

    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ) { }

    get token(): string | null {
        const tokenExpired = new Date() > this._tokenExpirationDate;
        if (!this._tokenExpirationDate || tokenExpired) {
            return null;
        }
        return this._token;
    }

    get tokenExpirationDate(): Date {
        return this._tokenExpirationDate;
    }

}