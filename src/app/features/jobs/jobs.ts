import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job-service';
import { JobSearchParams, JobSearchResult } from '../../core/models/job.model';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-jobs',
    imports: [CommonModule, FormsModule],
    templateUrl: './jobs.html',
    styles: ``,
})
export class Jobs {
    private jobService = inject(JobService);
    searchResult = signal<JobSearchResult | null>(null);
    isLoading = signal(false);

    params = signal<JobSearchParams>({
        keywords: '',
        location: '',
        page: 0,
    });

    ngOnInit() {
        this.loadJobs();
    }

    loadJobs() {
        this.isLoading.set(true);
        this.jobService.getJobs(this.params()).subscribe({
            next: (res) => {
                this.searchResult.set(res);
                this.isLoading.set(false);

                if (res.jobs.length === 0) {
                    toast.info('No jobs found for your search.');
                }
            },

            error: (err) => {
                this.isLoading.set(false);
                toast.error('Failed to fetch jobs. Please check your connection.');
            },
        });
    }

    onSearch() {
        this.params.update((p) => ({ ...p, page: 0 }));
        this.loadJobs();
    }

    changePage(newPage: number) {
        this.params.update((p) => ({ ...p, page: newPage }));
        this.loadJobs();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    stripHtml(html: string) {
        return html?.replace(/<[^>]*>?/gm, '') || '';
    }

    
}
