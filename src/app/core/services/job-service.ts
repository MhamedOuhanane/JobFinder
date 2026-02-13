import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { JobSearchParams, JobSearchResult } from '../models/job.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class JobService {
    private http = inject(HttpClient);
    private apiUrl = environment.theMuseApiUrl;

    getJobs(params: JobSearchParams): Observable<JobSearchResult> {
        let httpParams = new HttpParams().set('page', params.page.toString());

        if (params.keywords) httpParams = httpParams.set('category', params.keywords);
        if (params.location) httpParams = httpParams.set('location', params.location);
        if (params.level) httpParams = httpParams.set('level', params.level);

        return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
            map((response) => ({
                jobs: response.results,
                totalResults: response.total,
                currentPage: response.page,
                totalPages: response.page_count,
                itemsPerPage: response.items_per_page,
            })),
        );
    }
}
