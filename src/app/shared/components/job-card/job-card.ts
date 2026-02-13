import { Component, inject, input, output } from '@angular/core';
import { Job } from '../../../core/models/job.model';
import { AuthStore } from '../../../store/auth.store';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-job-card',
    imports: [CommonModule],
    templateUrl: './job-card.html',
    styles: ``,
})
export class JobCard {
    job = input.required<Job>();
    authStore = inject(AuthStore);

    isAuth = this.authStore.isAuthenticated();

    //   onFavorite = output<Job>();
    //   onApply = output<Job>();

    stripHtml(html: string) {
        return html?.replace(/<[^>]*>?/gm, '') || '';
    }
}
