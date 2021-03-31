export class User {

    constructor(
        public email: string,
        public password: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ) { }

    get getToken() {
        const tokenExpired = new Date() > this._tokenExpirationDate;
        if (!this._tokenExpirationDate || tokenExpired) {
            return null;
        }
        return this._token;
    }

    get getTokenExpirationDate() {
        return this._tokenExpirationDate;
    }

}