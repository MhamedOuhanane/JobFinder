import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
    selector: 'app-unauthorized',
    imports: [CommonModule, RouterModule],
    template: `
        <div
            class="min-h-screen flex flex-col justify-center items-center bg-[#0f0f0f] p-4 text-center"
        >
            <div class="bg-red-500/10 p-6 rounded-full mb-6">
                <span class="material-icons text-red-500 text-6xl">lock_person</span>
            </div>

            <h1 class="text-3xl font-bold text-white mb-2">Access Denied</h1>
            <p class="text-neutral-400 max-w-sm mb-8">
                Sorry, you don't have the required permissions to view this page.
            </p>

            <div class="flex gap-4">
                <button
                    (click)="goBack()"
                    class="px-6 py-2.5 border border-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-all"
                >
                    Go Back
                </button>
                <a
                    routerLink="/"
                    class="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all"
                >
                    {{ isAuth ? 'Return Home' : 'Sing In' }}
                </a>
            </div>
        </div>
    `,
    styles: ``,
})
export class Unauthorized {
    private location = inject(Location);
    private authStore = inject(AuthStore);

    isAuth = this.authStore.isAuthenticated();

    goBack() {
        this.location.back();
    }
}
