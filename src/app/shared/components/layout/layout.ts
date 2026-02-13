import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

                    <div class="flex items-center gap-6">
                        @if (authStore.user()) {
                            <div class="flex items-center gap-4">
                                <nav
                                    class="hidden md:flex items-center gap-4 border-r border-neutral-800 pr-4"
                                >
                                    <a
                                        routerLink="/favorites"
                                        routerLinkActive="text-orange-500 border-orange-500/20"
                                        [routerLinkActiveOptions]="{ exact: true }"
                                        class="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        <span class="material-icons text-sm">favorite</span>
                                        Favorites
                                    </a>
                                    <a
                                        routerLink="/applications"
                                        routerLinkActive="text-orange-500 border-orange-500/20"
                                        [routerLinkActiveOptions]="{ exact: true }"
                                        class="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        <span class="material-icons text-sm">send</span> My Apps
                                    </a>
                                </nav>

                                <div class="flex items-center gap-3">
                                    <span
                                        class="hidden md:block text-sm text-neutral-400 font-medium"
                                    >
                                        {{ authStore.user()?.firstName }}
                                        {{ authStore.user()?.lastName }}
                                    </span>

                                    <div class="relative group">
                                        <button
                                            class="h-10 w-10 rounded-full border-2 border-neutral-700 group-hover:border-orange-500 transition-all overflow-hidden bg-neutral-800 flex items-center justify-center"
                                        >
                                            <span class="text-orange-500 font-bold">
                                                {{ authStore.user()?.firstName?.charAt(0) }}
                                            </span>
                                        </button>

                                        <div
                                            class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-100 p-1"
                                        >
                                            <button
                                                (click)="onLogout()"
                                                class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <span class="material-icons text-sm">logout</span>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } @else {
                            <div class="flex items-center gap-3">
                                <a
                                    routerLink="/login"
                                    class="text-sm font-bold text-neutral-400 hover:text-white transition-colors px-4 py-2"
                                >
                                    Sign In
                                </a>

                                <a
                                    routerLink="/register"
                                    class="px-6 py-2 bg-orange-500 text-black text-sm font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                                >
                                    Sign Up
                                </a>
                            </div>
                        }
                    </div>
                </div>
            </header>

            <main class="max-w-7xl mx-auto p-4">
                <router-outlet></router-outlet>
            </main>
        </div>
    `,
})
export class Layout {
    readonly authStore = inject(AuthStore);
    private router = inject(Router);

    onLogout() {
        this.authStore.logout();
        this.router.navigate(['/login']);
    }
}
