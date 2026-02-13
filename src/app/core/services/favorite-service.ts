import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, Subject, tap } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { Job } from '../models/job.model';

@Injectable({
    providedIn: 'root',
})
export class FavoriteService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.jsonServerUrl}/favoritesOffers`;

    private favoriteUpdate = new Subject<void>();
    favoriteUpdate$ = this.favoriteUpdate.asObservable();

    notifyRefresh() {
        this.favoriteUpdate.next();
    }

    getFavoritesByUserId(userId: string | number): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addToFavorites(userId: string, job: Job): Observable<Favorite> {
        const newFavorite: Favorite = {
            userId,
            job,
            dateAdded: new Date().toISOString(),
        };

        return this.http.post<Favorite>(this.apiUrl, newFavorite).pipe(
            tap(() => this.notifyRefresh())
        );
    }

    removeFromFavorites(favoriteId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`).pipe(
            tap(() => this.notifyRefresh())
        );
    }

    checkIfFavorited(userId: string, jobId: string): Observable<Favorite | null> {
        return this.http
            .get<Favorite[]>(`${this.apiUrl}?userId=${userId}&job.id=${jobId}`)
            .pipe(map((favorites) => (favorites.length > 0 ? favorites[0] : null)));
    }
}
