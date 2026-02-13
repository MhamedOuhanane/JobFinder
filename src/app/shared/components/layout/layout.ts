import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
    selector: 'app-layout',
    imports: [CommonModule, RouterModule],
    template: `
        <div class="min-h-screen bg-[#0f0f0f] text-white">
            <header
                class="h-16 border-b border-neutral-800 bg-[#1a1a1a]/50 backdrop-blur-md sticky top-0 z-50"
            >
                <div class="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
                    <a routerLink="/" class="flex items-center gap-2 group">
                        <div
                            class="bg-orange-500 p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all"
                        >
                            <span class="material-icons text-white text-xl">work_outline</span>
                        </div>
                        <span class="text-xl font-bold tracking-tight"
                            >JobFinder<span class="text-orange-500">.</span></span
                        >
                    </a>

                    <div class="flex items-center gap-4">
                        @if (authStore.user()) {
                            <div class="flex items-center gap-3">
                                <span class="hidden md:block text-sm text-neutral-400">{{
                                    authStore.user()?.firstName
                                }}</span>
                                <button
                                    class="h-10 w-10 rounded-full border-2 border-neutral-700 hover:border-orange-500 transition-all overflow-hidden bg-neutral-800 flex items-center justify-center"
                                >
                                    <span class="text-orange-500 font-bold">
                                        {{ authStore.user()?.firstName?.charAt(0) }}
                                    </span>
                                </button>
                            </div>
                        } @else {
                            <a
                                routerLink="/login"
                                class="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                            >
                                Sign In
                            </a>
                        }
                    </div>
                </div>
            </header>

            <main class="max-w-7xl mx-auto p-4">
                <router-outlet></router-outlet>
            </main>
        </div>
    `,
    styles: [],
})
export class Layout {
    readonly authStore = inject(AuthStore);
}
