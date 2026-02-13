import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../store/auth.store';

@Component({
    selector: 'app-not-found',
    imports: [],
    template: `
        <div
            class="min-h-screen flex flex-col justify-center items-center bg-[#0f0f0f] p-4 text-center"
        >
            <span class="text-9xl font-black text-neutral-800 absolute select-none">404</span>

            <div class="relative z-10">
                <div class="bg-orange-500/10 p-6 rounded-full mb-6 inline-block">
                    <span class="material-icons text-orange-500 text-6xl">explore_off</span>
                </div>

                <h1 class="text-3xl font-bold text-white mb-2">Lost in Space?</h1>
                <p class="text-neutral-400 max-w-sm mb-8">
                    The page you're looking for doesn't exist or has been moved to another galaxy.
                </p>

                <a
                    routerLink="/"
                    class="px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                >
                    <span class="material-icons">
                        {{ isAuth ? 'home' : 'login' }}
                    </span>

                    <span>
                        {{ isAuth ? 'Return Home' : 'Sign In' }}
                    </span>
                </a>
            </div>
        </div>
    `,
    styles: ``,
})
export class NotFound {
    private authStore = inject(AuthStore);

    isAuth = this.authStore.isAuthenticated();
}
