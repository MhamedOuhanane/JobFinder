import { inject, Injectable } from '@angular/core';
import { RegisterRequest, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private apiUrl = `${environment.jsonServerUrl}/users`;

    register(registerData: RegisterRequest): Observable<User | null> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${registerData.email}`).pipe(
            switchMap((users) => {
                if (users.length > 0) {
                    throw new Error('This email is already registered!');
                }
                return this.http.post<User>(this.apiUrl, registerData);
            }),
        );
    }

    login(email: string, password: string): Observable<User | null> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
            map((users) => {
                if (users.length > 0) {
                    return users[0];
                }
                return null;
            }),
        );
    }
}
