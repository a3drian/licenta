import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";
import { Constants } from '../shared/Constants';
import { log } from "../shared/Logger";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    isInDebugMode: boolean = Constants.isInDebugMode;

    DASHBOARD_URL: string = '';

    authForm: FormGroup;

    isInLoadingMode: boolean = false;
    isInLoginMode: boolean = false;

    loginButtonText: string = 'Log in';
    registerButtonText: string = 'Register';
    existingAccountButtonText: string = 'Already have an account? Log in';
    noAccountButtonText: string = 'No account? Register';

    error: string | null = null;

    onSwitchBetweenLoggedInAndOut(): void {
        this.isInLoginMode = !this.isInLoginMode;
    }

    isFormValid(): boolean {
        return this.authForm.valid;
    }

    isLoading(): boolean {
        return this.isInLoadingMode;
    }

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.authForm = this.formBuilder
            .group(
                {
                    email: ['', Validators.required],
                    password: ['', Validators.required]
                }
            );
    }

    onSubmit(): void {

        if (!this.isFormValid()) {
            return;
        }

        const form = this.authForm.value;
        log('auth.component.ts', 'onSubmit()', 'Form data:', form);

        const email = form.email;
        const password = form.password;

        this.isInLoadingMode = true;

        // allows us to change what observable it holds based on the request,
        // if it's a log in or a sign up one
        let authObservable: Observable<AuthResponseData>;
        if (this.isInLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.register(email, password);
        }

        authObservable
            .subscribe(
                (responseData) => {
                    log('auth.component', 'onSubmit()', 'Response data for log in / sign up request:', responseData);
                    this.isInLoadingMode = false;
                    // navigation from inside the code, not from inside the template
                    this.router.navigate([this.DASHBOARD_URL]);
                },
                // we always throwError(errorMessage) in the service => we can simply display the message here
                (errorMessage) => {
                    log('auth.component', 'onSubmit()', 'Error when trying to log in / sign up:', errorMessage);

                    this.error = errorMessage;
                    this.isInLoadingMode = false;
                }
            );

        this.authForm.reset();
    }
}