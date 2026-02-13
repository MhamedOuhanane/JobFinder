import { Component, inject, signal } from '@angular/core';
import { FavoriteService } from '../../../core/services/favorite-service';
import { AuthStore } from '../../../store/auth.store';
import { Favorite } from '../../../core/models/favorite.model';
import { JobCard } from '../../components/job-card/job-card';

@Component({
  selector: 'app-favorites',
  imports: [JobCard],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-10">
        <h1 class="text-3xl font-black text-white mb-2">My Saved <span class="text-orange-500">Jobs</span></h1>
        <p class="text-neutral-500">You have {{ favorites().length }} opportunities saved in your list.</p>
    </div>

    @if (isLoading()) {
        <div class="flex justify-center py-20">
            <div class="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
    }

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (fav of favorites(); track fav.id) {
            <app-job-card [job]="fav.job"></app-job-card>
        } @empty {
            @if (!isLoading()) {
                <div class="col-span-full flex flex-col items-center justify-center py-20 bg-[#1a1a1a] rounded-3xl border border-dashed border-white/10">
                    <span class="material-icons text-6xl text-neutral-800 mb-4">favorite_border</span>
                    <h2 class="text-xl font-bold text-neutral-400 mb-4">Your list is empty</h2>
                </div>
            }
        }
    </div>
</div>
  `,
  styles: ``,
})
export class Favorites {
private favoriteService = inject(FavoriteService);
  private authStore = inject(AuthStore);

  favorites = signal<Favorite[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadFavorites();
    
    this.favoriteService.favoriteUpdate$.subscribe(() => {
      this.loadFavorites();
    });
  }

  loadFavorites() {
    const userId = this.authStore.user()?.id;
    if (userId) {
      this.favoriteService.getFavoritesByUserId(userId).subscribe({
        next: (data) => {
          this.favorites.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }
}
