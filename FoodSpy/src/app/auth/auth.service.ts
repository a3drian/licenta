import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { User } from '../models/User';

interface AuthResponseData {

}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User>({ email: null, password: null });
    REGISTER_URL: string = '/api/register';
    LOGIN_URL: string = '/api/login';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    register(_email: string, _password: string) {
        return this.http
            .post<AuthResponseData>(
                this.REGISTER_URL,
                {
                    email: _email,
                    password: _password
                }
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
            );
    }
}