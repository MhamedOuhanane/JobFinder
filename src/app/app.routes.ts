import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/auth/home-redirect/home-redirect').then((m) => m.HomeRedirect),
    },

    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        canActivate: [roleGuard],
        data: { roles: ['visitor'] },
    },

    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
        canActivate: [roleGuard],
        data: { roles: ['visitor'] },
    },

    {
        path: 'unauthorized',
        loadComponent: () =>
            import('./features/auth/unauthorized/unauthorized').then((m) => m.Unauthorized),
    },

    {
        path: '**',
        loadComponent: () => import('./features/auth/not-found/not-found').then((m) => m.NotFound),
    },
];
