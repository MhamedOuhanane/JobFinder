import { CanActivateFn } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { inject } from '@angular/core';
import { Router } from 'express';
import { toast } from 'ngx-sonner';

export const roleGuard: CanActivateFn = (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const userRole = authStore.userRole();
    const expectedRole = route.data['roles'] as Array<string>;

    if (expectedRole.includes(userRole!)) {
        return true;
    }

    toast.error('Permission Denied', {
        description: "You don't have the required permissions for this area.",
    });

    return router.createUrlTree(['/unauthorized']);
};
