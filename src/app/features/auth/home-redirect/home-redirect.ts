import { Component, effect, inject } from '@angular/core';
import { AuthStore } from '../../../store/auth.store';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-redirect',
    template: ``,
    styles: ``,
})
export class HomeRedirect {
    private authStore = inject(AuthStore);
    private router = inject(Router);

    constructor() {
        effect(() => {
            if (this.authStore.isAuthenticated()) {
                this.router.navigate(['/jobs']);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }
}
