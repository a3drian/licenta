import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { User } from '../models/User';
import { Constants } from '../shared/Constants';

export interface AuthResponseData {
    email: string;
    // response properties
    id: string;
    token: string;
    expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    isInDebugMode: boolean = Constants.isInDebugMode;

    REGISTER_URL: string = Constants.APIEndpoints.REGISTER_URL;
    LOGIN_URL: string = Constants.APIEndpoints.LOGIN_URL;
    LOGOUT_REDIRECT_URL: string = Constants.APIEndpoints.LOGOUT_REDIRECT_URL;

    LOCAL_STORAGE_USER_DATA_KEY: string = 'localStorageUser';

    private tokenExpirationTimer: any;

    // allows us to not have to use a separate "token: string" object
    // for outgoing requests, like fetching foods, etc.
    user = new BehaviorSubject<User | null>(null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'Unexpected error occurred when registering an user which is not connected to the API!';
        if (!errorResponse.error) {
            return throwError(errorMessage);
        }
        errorMessage = errorResponse.error.message;
        return throwError(errorMessage);
    }

    private handleAuthentication(responseData: AuthResponseData) {
        const timeNow = new Date().getTime();
        const tokenExpiryTime = responseData.expiresIn * 1000;
        const expirationDate = new Date(timeNow + tokenExpiryTime);
        const user = new User(
            responseData.email,
            responseData.id,
            responseData.token,
            expirationDate
        );
        console.log('AUTHENTICATION USER...');
        console.log(user);
        console.log('AUTHENTICATION USER^^^');
        this.user.next(user);
        this.autoLogout(tokenExpiryTime);
        localStorage.setItem(this.LOCAL_STORAGE_USER_DATA_KEY, JSON.stringify(user));
    }

    register(_email: string, _password: string) {
        return this.http
            .post<AuthResponseData>(
                this.REGISTER_URL,
                {
                    email: _email,
                    password: _password
                }
            )
            .pipe(
                catchError(
                    (errorResponse) => {
                        return this.handleError(errorResponse);
                    }
                ),
                tap(
                    (responseData) => {
                        return this.handleAuthentication(responseData);
                    }
                )
            )
    }

    login(_email: string, _password: string) {
        return this.http
            .post<AuthResponseData>(
                this.LOGIN_URL,
                {
                    email: _email,
                    password: _password
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(
                    (responseData) => {
                        return this.handleAuthentication(responseData);
                    }
                )
            )
    }

    logout() {
        console.log('auth.service.logout()');
        this.user.next(null);
        localStorage.removeItem(this.LOCAL_STORAGE_USER_DATA_KEY);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.router.navigate([this.LOGOUT_REDIRECT_URL]);
    }

    autoLogin() {
        console.log('Called autoLogin()');

        const localStorageUserData = localStorage.getItem(this.LOCAL_STORAGE_USER_DATA_KEY);
        if (!localStorageUserData) {
            return;
        }

        const localUserData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string
        } = JSON.parse(localStorageUserData);

        if (!localUserData) {
            return;
        }

        const loadedUser = new User(
            localUserData.email,
            localUserData.id,
            localUserData._token,
            new Date(localUserData._tokenExpirationDate)
        );

        if (loadedUser.token) {    // returns "null" if the token expired

            this.user.next(loadedUser);

            const tokenTime = new Date(localUserData._tokenExpirationDate).getTime();
            const currentTime = new Date().getTime();
            const remainingTokenTime = tokenTime - currentTime;
            this.autoLogout(remainingTokenTime);
        }
    }

    autoLogout(expirationDuration: number) {
        // amount of ms before token is invalid
        console.log(`Auto logout in: ${expirationDuration / 1000 / 60} minutes.`);
        this.tokenExpirationTimer = setTimeout(
            () => { this.logout() },
            expirationDuration
        );
    }
}