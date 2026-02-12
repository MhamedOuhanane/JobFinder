import { computed, inject } from "@angular/core";
import { User } from "../core/models/user.model";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { environment } from "../../environments/environment.development";
import { CookieService } from "ngx-cookie-service";

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

    withMethods((store, cookieService = inject(CookieService)) => ({
        setLoading(value: boolean) {
            patchState(store, { isLoading: value })
        },

        setLogin(user: User) {
            patchState(store, { isLoading: true })

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