import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
// rxjs:
import { Observable, Subscription } from 'rxjs';
// Models:
import { AuthResponseData } from '../models/AuthResponseData';
// Services:
import { AuthService } from './auth.service';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';
import { STATUS_CODES } from 'foodspy-shared';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

    isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

    defaultTargetCalories: number = Constants.DEFAULT_TARGET_CALORIES;
    defaultPasswordLength: number = Constants.MIN_PASSWORD_LENGTH;
    defaultMinCalories = Constants.MIN_CALORIES;
    defaultMaxCalories = Constants.MAX_CALORIES;

    showPassword: boolean = false;
    targetCaloriesFormControlName: string = 'targetCalories';
    emailFormControlName: string = 'email';
    passwordFormControlName: string = 'password';

    authForm: FormGroup;

    isLoading: boolean = false;
    isInLoginMode: boolean = false;

    targetCaloriesSubscription: Subscription = new Subscription();

    loginButtonText: string = 'Log in';
    registerButtonText: string = 'Register';
    existingAccountButtonText: string = 'Already have an account? Log in';
    noAccountButtonText: string = 'No account? Register';

    error: string | null = null;
    info: string | null = null;
    errorResponse: HttpErrorResponse | null = null;

    onSwitchBetweenLoggedInAndOut(): void {
        this.isInLoginMode = !this.isInLoginMode;
    }

    onShowPassword(): void {
        this.showPassword = !this.showPassword;
    }

    isFormValid(): boolean {
        return this.authForm.valid;
    }

    emailValid(): boolean {
        const email = this.authForm.get(this.emailFormControlName);
        if (email) {
            if (email.errors) {
                return false;
            }
        }
        return true;
    }

    hasTypedPassword(): boolean {
        const password = this.authForm.get(this.passwordFormControlName);
        if (password) {
            if (password.value) {
                return true;
            }
        }
        return false;
    }

    private targetCaloriesFormControlValueChanged() {
        const calories: AbstractControl | null = this.authForm.get(this.targetCaloriesFormControlName);
        if (calories) {
            this.targetCaloriesSubscription = calories
                .valueChanges
                .subscribe(
                    (targetCalories: number) => {
                        if (!this.isInLoginMode) {
                            if (targetCalories === null) {
                                log('auth.ts', this.targetCaloriesFormControlValueChanged.name, 'targetCalories is null');
                                this.authForm.patchValue({ 'targetCalories': this.defaultMinCalories });
                            }
                        }
                    }
                );
        }
    }

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.error = null;
        this.errorResponse = null;
        this.info = null;
        this.authForm = this.formBuilder
            .group(
                {
                    email: ['',
                        [
                            Validators.required,
                            Validators.email,
                            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                        ]
                    ],
                    password: ['',
                        [
                            Validators.required,
                            Validators.minLength(this.defaultPasswordLength)
                        ]
                    ],
                    targetCalories: [this.defaultTargetCalories, Validators.required]
                }
            );
    }

    ngOnInit(): void {
        this.targetCaloriesFormControlValueChanged();
    }

    ngOnDestroy(): void {
        if (this.targetCaloriesSubscription) {
            log('add-meal.ts', this.ngOnDestroy.name, 'Unsubscribing from target calories subscription...');
            this.targetCaloriesSubscription.unsubscribe();
        }
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
                    if (this.isInLoginMode) {
                        this.router
                            .navigate([Constants.DASHBOARD_URL])
                            .catch(
                                (error) => {
                                    log('add-meal.ts', this.onSubmit.name, `Could not navigate to: ${Constants.DASHBOARD_URL}`, error);
                                }
                            );
                    } else {
                        this.router
                            .navigate([Constants.APIEndpoints.AUTH_URL])
                            .catch(
                                (error) => {
                                    log('add-meal.ts', this.onSubmit.name, `Could not navigate to: ${Constants.APIEndpoints.AUTH_URL}`, error);
                                }
                            );
                        this.info = 'Account created! You can log in now!';
                        this.error = null;
                        this.isInLoginMode = true;
                    }
                },
                // we always throwError(errorMessage) in the service => we can simply display the message here
                (error: HttpErrorResponse) => {
                    log('auth.ts', this.onSubmit.name, 'Error when trying to log in / sign up:', error);
                    if (error.status == STATUS_CODES.GATEWAY_TIMEOUT) {
                        this.error = 'Error connecting to the FoodSpy servers!';
                    } else {
                        this.error = error.error.message;
                        this.errorResponse = error;
                    }
                    this.info = null;
                    this.isLoading = false;
                }
            );

        this.authForm.reset();
    }
}