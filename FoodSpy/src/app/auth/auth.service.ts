import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// rxjs:
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
// Interfaces:
import { IAuthResponseData } from 'foodspy-shared';
// Models:
import { AuthResponseData } from '../models/AuthResponseData';
import { User } from '../models/User';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Injectable({ providedIn: 'root' })
export class AuthService {

    isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

    REGISTER_URL: string = Constants.APIEndpoints.REGISTER_URL;
    LOGIN_URL: string = Constants.APIEndpoints.LOGIN_URL;
    LOGOUT_REDIRECT_URL: string = Constants.APIEndpoints.LOGOUT_REDIRECT_URL;

    LOCAL_STORAGE_USER_DATA_KEY: string = 'localStorageUser';
    LOCAL_STORAGE_USER_EMAIL_KEY: string = 'localStorageUserEmail';

    private tokenExpirationTimer: any;

    // allows us to not have to use a separate "token: string" object
    // for outgoing requests, like fetching foods, etc.
    user = new BehaviorSubject<User | null>(null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    // /*
    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage: string = 'Unexpected error occurred when registering an user which is not connected to the API!';
        if (!errorResponse.error) {
            return throwError(errorMessage);
        }
        errorMessage = errorResponse.error.message;
        return throwError(errorMessage);
    }
    // */

    // private handleError(errorResponse: HttpErrorResponse) {
    //     return throwError(errorResponse);
    // }

    private handleAuthentication(responseData: AuthResponseData): void {
        const timeNow = new Date().getTime();
        const tokenExpiryTime = responseData.expiresIn * 1000;
        const expirationDate = new Date(timeNow + tokenExpiryTime);
        const user = new User(
            responseData.email,
            responseData.id,
            responseData.targetCalories,
            responseData.token,
            expirationDate
        );
        log('auth.service.ts', this.handleAuthentication.name, 'Authenticated user:', user);
        this.user.next(user);
        this.autoLogout(tokenExpiryTime);
        localStorage.setItem(this.LOCAL_STORAGE_USER_DATA_KEY, JSON.stringify(user));
    }

    register(_email: string, _password: string, _targetCalories: number): Observable<IAuthResponseData> {
        return this.http
            .post<AuthResponseData>(
                this.REGISTER_URL,
                {
                    email: _email,
                    password: _password,
                    targetCalories: _targetCalories
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

    login(_email: string, _password: string): Observable<IAuthResponseData> {
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

    logout(): void {
        log('auth.service', this.logout.name, '');
        this.user.next(null);
        localStorage.removeItem(this.LOCAL_STORAGE_USER_DATA_KEY);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.router
            .navigate([this.LOGOUT_REDIRECT_URL])
            .catch(
                (error) => {
                    log('auth.service.ts', this.logout.name, `Could not navigate to: ${this.LOGOUT_REDIRECT_URL}`, error);
                }
            );
    }

    autoLogin(): void {
        log('auth.service', this.autoLogin.name, '');

        const localStorageUserData = localStorage.getItem(this.LOCAL_STORAGE_USER_DATA_KEY);
        if (!localStorageUserData) {
            return;
        }

        const localUserData: {
            email: string;
            id: string;
            _targetCalories: number;
            _token: string;
            _tokenExpirationDate: string
        } = JSON.parse(localStorageUserData);

        if (!localUserData) {
            return;
        }

        const loadedUser = new User(
            localUserData.email,
            localUserData.id,
            localUserData._targetCalories,
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

    autoLogout(expirationDuration: number): void {
        // amount of ms before token is invalid
        log('auth.service.ts', this.autoLogout.name, `Auto logout in: ${expirationDuration / 1000 / 60} minutes.`);
        this.tokenExpirationTimer = setTimeout(
            () => { this.logout() },
            expirationDuration
        );
    }
}