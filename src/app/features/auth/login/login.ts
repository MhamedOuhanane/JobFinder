import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private fb = inject(FormBuilder);
    readonly authStore = inject(AuthStore);

    showPassword = signal(false);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    onLogin() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.getRawValue();
            this.authStore.login(email ?? '', password ?? '');
        }
        this.loginForm.get('password')?.reset();
    }

    togglePassword() {
        this.showPassword.update((v) => !v);
    }

    isInvalid(controlName: string): boolean {
        const control = this.loginForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}
