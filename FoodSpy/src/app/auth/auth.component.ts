import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
// rxjs:
import { Observable } from 'rxjs';
// Models:
import { AuthResponseData } from '../models/AuthResponseData';
// Services:
import { AuthService } from './auth.service';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

    isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

    DASHBOARD_URL: string = '';

    authForm: FormGroup;

    isLoading: boolean = false;
    isInLoginMode: boolean = false;

    loginButtonText: string = 'Log in';
    registerButtonText: string = 'Register';
    existingAccountButtonText: string = 'Already have an account? Log in';
    noAccountButtonText: string = 'No account? Register';

    error: string | null = null;
    errorResponse: HttpErrorResponse | null = null;

    onSwitchBetweenLoggedInAndOut(): void {
        this.isInLoginMode = !this.isInLoginMode;
    }

    isFormValid(): boolean {
        return this.authForm.valid;
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
                    password: ['', Validators.required],
                    targetCalories: [Constants.TARGET_CALORIES, Validators.required]
                }
            );
    }

    onSubmit(): void {

        if (!this.isFormValid()) {
            return;
        }

        const form = this.authForm.value;
        log('auth.ts', this.onSubmit.name, 'Form data:', form);

        const email = form.email;
        const password = form.password;
        const targetCalories = form.targetCalories;

        this.isLoading = true;

        // allows us to change what observable it holds based on the request,
        // if it's a log in or a sign up one
        let authObservable: Observable<AuthResponseData>;
        if (this.isInLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.register(email, password, targetCalories);
        }

        authObservable
            .subscribe(
                (responseData) => {
                    log('auth.ts', this.onSubmit.name, 'Response data for log in / sign up request:', responseData);
                    this.isLoading = false;
                    // navigation from inside the code, not from inside the template
                    this.router
                        .navigate([this.DASHBOARD_URL])
                        .catch(
                            (error) => {
                                log('add-meal.ts', this.onSubmit.name, `Could not navigate to: ${this.DASHBOARD_URL}`, error);
                            }
                        );
                },
                // we always throwError(errorMessage) in the service => we can simply display the message here
                (errorMessage) => {
                    log('auth.ts', this.onSubmit.name, 'Error when trying to log in / sign up:', errorMessage);

                    this.error = errorMessage;
                    this.errorResponse = errorMessage;
                    this.isLoading = false;
                }
            );

        this.authForm.reset();
    }
}