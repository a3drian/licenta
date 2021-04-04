import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { User } from '../models/User';

export interface AuthResponseData {

}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User | null>(null);
    REGISTER_URL: string = '/auth/register';
    LOGIN_URL: string = '/auth/login';

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
                )
            );
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
                catchError(this.handleError)
            );
    }
}