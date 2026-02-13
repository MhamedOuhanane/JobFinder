import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Application } from '../models/application.model';
import { Job } from '../models/job.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
    private apiUrl = `${environment.jsonServerUrl}/applications`;
    
    apply(userId: number, job: Job): Observable<Application> {
        const newApp: Application = {
            userId,
            offerId: job.id,
            apiSource: 'The Muse',
            title: job.name,
            company: job.company.name,
            location: job.locations[0]?.name || 'Remote',
            url: job.refs.landing_page,
            status: 'en_attente',
            notes: '',
            dateAdded: new Date().toISOString()
        };
        return this.http.post<Application>(this.apiUrl, newApp);
    }

    checkIfApplied(userId: number, offerId: string): Observable<Application | null> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`)
            .pipe(map(apps => apps.length > 0 ? apps[0] : null));
    }
}
