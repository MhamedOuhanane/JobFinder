import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../store/auth.store';
import { RegisterRequest } from '../../../core/models/user.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register {
    private fb = inject(FormBuilder);
    readonly authStore = inject(AuthStore);

    showPassword = signal(false);

    registerForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
            '',
            [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[!@#$%^&*])/)],
        ],
    });

    onRegister() {
        if (this.registerForm.valid) {
            const registerData = this.registerForm.getRawValue() as RegisterRequest;
            this.authStore.register(registerData);
            this.registerForm.get('password')?.reset();
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    togglePassword() {
        this.showPassword.update((v) => !v);
    }

    isInvalid(controlName: string): boolean {
        const control = this.registerForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}
