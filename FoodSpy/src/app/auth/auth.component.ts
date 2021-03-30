import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    isInDebugMode: boolean = true;
    isInLoginMode: boolean = false;
    authForm: FormGroup;
    loginButtonText: string = 'Log in';
    registerButtonText: string = 'Register';
    existingAccountButtonText: string = 'Already have an account? Log in';
    noAccountButtonText: string = 'No account? Register';

    onSwitchBetweenLoggedInAndOut(): void {
        this.isInLoginMode = !this.isInLoginMode;
    }

    isFormValid(): boolean {
        return this.authForm.valid;
    }

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService
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
        console.log('onSubmit():');

        if (!this.isFormValid()) {
            return;
        }

        const form = this.authForm.value;
        console.log(form);

        const email = form.email;
        const password = form.password;

        this.authService
            .login(email, password)
            .subscribe();

        this.authForm.reset();
    }
}