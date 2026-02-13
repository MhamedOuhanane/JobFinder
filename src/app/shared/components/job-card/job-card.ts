import { Component, inject, input, output, signal } from '@angular/core';
import { Job } from '../../../core/models/job.model';
import { AuthStore } from '../../../store/auth.store';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../../core/services/favorite-service';
import { Favorite } from '../../../core/models/favorite.model';
import { FavoriteButton } from '../favorite-button/favorite-button';

@Component({
    selector: 'app-job-card',
    imports: [CommonModule, FavoriteButton],
    templateUrl: './job-card.html',
    styles: ``,
})
export class JobCard {
    job = input.required<Job>();
    authStore = inject(AuthStore);

    isAuth = this.authStore.isAuthenticated();

    stripHtml(html: string) {
        return html?.replace(/<[^>]*>?/gm, '') || '';
    }
}
