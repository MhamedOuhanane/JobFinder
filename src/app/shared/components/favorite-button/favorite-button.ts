import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Job } from '../../../core/models/job.model';
import { FavoriteService } from '../../../core/services/favorite-service';
import { CommonModule } from '@angular/common';
import { Favorite } from '../../../core/models/favorite.model';
import { AuthStore } from '../../../store/auth.store';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-favorite-button',
    imports: [CommonModule],
    template: `
        <button
            (click)="toggleFavorite($event)"
            [disabled]="isProcessing()"
            class="p-2.5 rounded-xl border border-white/10 transition-all flex items-center justify-center min-w-[45px]"
            [ngClass]="
                favoriteData()
                    ? 'text-red-500 border-red-500/30 bg-red-500/5'
                    : 'text-neutral-500 hover:text-red-500'
            "
            [title]="favoriteData() ? 'Remove from Favorites' : 'Add to Favorites'"
        >
            @if (isProcessing()) {
                <div
                    class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                ></div>
            } @else {
                <span class="material-icons text-[20px]">
                    {{ favoriteData() ? 'favorite' : 'favorite_border' }}
                </span>
            }
        </button>
    `,
    styles: ``,
})
export class FavoriteButton implements OnInit {
    job = input.required<Job>();
    private authStore = inject(AuthStore);
    private favoriteService = inject(FavoriteService);

    favoriteData = signal<Favorite | null>(null);
    isProcessing = signal<boolean>(false);

    ngOnInit() {
        this.checkStatus();
    }

    checkStatus() {
        const user = this.authStore.user();
        if (user?.id) {
            this.favoriteService.checkIfFavorited(user.id, this.job().id).subscribe({
                next: (fav) => this.favoriteData.set(fav),
            });
        }
    }

    toggleFavorite(event: Event) {
        event.stopPropagation();
        const user = this.authStore.user();

        if (!user) {
            toast.error('Please login to save favorites');
            return;
        }

        if (this.isProcessing()) return;
        this.isProcessing.set(true);

        const currentFav = this.favoriteData();

        if (currentFav?.id) {
            this.favoriteService.removeFromFavorites(currentFav.id.toString()).subscribe({
                next: () => {
                    this.favoriteData.set(null);
                    this.isProcessing.set(false);
                    toast.success('Removed from favorites');
                },
                error: () => this.isProcessing.set(false),
            });
        } else {
            this.favoriteService.addToFavorites(user.id!, this.job()).subscribe({
                next: (newFav) => {
                    this.favoriteData.set(newFav);
                    this.isProcessing.set(false);
                    toast.success('Added to favorites');
                },
                error: () => this.isProcessing.set(false),
            });
        }
    }
}
