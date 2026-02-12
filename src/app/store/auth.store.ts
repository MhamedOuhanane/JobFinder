import { computed, inject } from "@angular/core";
import { RegisterRequest, User } from "../core/models/user.model";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { environment } from "../../environments/environment.development";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { AuthService } from "../core/auth/auth-service";
import { error } from "console";
import { toast } from "ngx-sonner";
import { register } from "module";

interface AuthState {
    user: User | null,
    isLoading: boolean,
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
}

export const AuthStore = signalStore(
    { providedIn: 'root'},
    withState(initialState),
    withComputed((store) => ({
        isAuthenticated: computed(() => !!(store.user())),
        userId: computed(() => store.user()?.id ?? null),
        userFullName: computed(() => {
            const user = store.user();
            return user ? `${user.firstName} ${user.lastName}` : '' ;
        }),
        userRole: computed(() => !!(store.user()) ? 'client' : 'visitor'),
    })),

    withMethods((
        store, 
        cookieService = inject(CookieService),
        router = inject(Router),
        authService = inject(AuthService),
    ) => ({
        setLoading(value: boolean) {
            patchState(store, { isLoading: value })
        },

        login(email: string, password: string) {
            this.setLoading(true);

            authService.login(email, password).subscribe({
                next: (user) => {
                    if (user) {
                        this.setLogin(user);
                        toast.success(`Welcome ${user.firstName}`);
                        router.navigate(['/']);
                    } else {
                        this.setLoading(false);
                        toast.error('Authentication Failed', {
                            description: 'Invalid email or password'
                        });
                    }
                },
                error: (error) => {
                    this.setLoading(false);

                    toast.error('Server Error', {
                        description: error.message
                    });
                    }
            })
        },

        register(registerData: RegisterRequest) {
            this.setLoading(true);

            authService.register(registerData).subscribe({
                next: () => {
                    this.setLoading(false);
                    toast.success('Account Created', {
                        description: 'You can now log in to your account'
                    });
                    router.navigate(['/login']);
                },
                error: (error) => {
                    this.setLoading(false);
                    toast.warning('Registration Issue', {
                        description: error.message
                    });
                }
            });
        },


        setLogin(user: User) {
            const isSecure = environment.secureCookie;
            cookieService.set('user', JSON.stringify(user), 7, '/', '', isSecure, 'Strict');
            patchState(store, { user, isLoading: false });
        },

        logout() {
            cookieService.deleteAll();
            patchState(store, initialState);
        }
    })),

    withHooks({
        onInit(store, cookieService = inject(CookieService)) {
            const userJson = cookieService.get('user');
            
            if (userJson) {
                try {
                    const user = JSON.parse(userJson) as User;
    
                    patchState(store, { user });
                } catch (error) {
                    store.logout();
                }
            }
        }
    })
);