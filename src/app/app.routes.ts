import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout').then((m) => m.Layout),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./features/auth/home-redirect/home-redirect').then(
                        (m) => m.HomeRedirect,
                    ),
            },
            {
                path: 'jobs',
                loadComponent: () => import('./features/jobs/jobs').then((m) => m.Jobs),
            },
            {
                path: 'favorites',
                loadComponent: () =>
                    import('./shared/pages/favorites/favorites').then((c) => c.Favorites),
                canActivate: [roleGuard],
                data: { roles: ['client'] },
            },
        ],
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
