import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application-service';
import { AuthStore } from '../../../store/auth.store';
import { Application } from '../../../core/models/application.model';

@Component({
    selector: 'app-applications',
    imports: [CommonModule, RouterModule],
    template: `
        <div class="max-w-7xl mx-auto px-4 py-10">
            <div class="mb-8">
                <h1 class="text-3xl font-black text-white">
                    My <span class="text-orange-500">Applications</span>
                </h1>
                <p class="text-neutral-500 mt-2">Track the status of your sent job applications.</p>
            </div>

            @if (isLoading()) {
                <div class="flex justify-center py-20">
                    <div
                        class="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"
                    ></div>
                </div>
            } @else {
                <div
                    class="overflow-x-auto bg-[#1a1a1a] rounded-2xl border border-neutral-800 shadow-2xl"
                >
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-neutral-800 bg-neutral-900/50">
                                <th class="p-5 text-sm font-bold text-neutral-400">
                                    Position & Company
                                </th>
                                <th class="p-5 text-sm font-bold text-neutral-400">Date Applied</th>
                                <th class="p-5 text-sm font-bold text-neutral-400">Status</th>
                                <th class="p-5 text-sm font-bold text-neutral-400 text-right">
                                    Link
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (app of applications(); track app.id) {
                                <tr
                                    class="border-b border-neutral-800/50 hover:bg-white/5 transition-all group"
                                >
                                    <td class="p-5">
                                        <div
                                            class="font-bold text-white group-hover:text-orange-500 transition-colors"
                                        >
                                            {{ app.title }}
                                        </div>
                                        <div class="text-sm text-neutral-500">
                                            {{ app.company }} • {{ app.location }}
                                        </div>
                                    </td>
                                    <td class="p-5 text-neutral-400 text-sm">
                                        {{ app.dateAdded | date: 'mediumDate' }}
                                    </td>
                                    <td class="p-5">
                                        <span
                                            [ngClass]="getStatusClasses(app.status)"
                                            class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                                        >
                                            {{ app.status }}
                                        </span>
                                    </td>
                                    <td class="p-5 text-right">
                                        <a
                                            [href]="app.url"
                                            target="_blank"
                                            class="text-neutral-500 hover:text-white transition-colors"
                                        >
                                            <span class="material-icons text-xl">open_in_new</span>
                                        </a>
                                    </td>
                                </tr>
                            } @empty {
                                <tr>
                                    <td colspan="4" class="p-20 text-center text-neutral-600">
                                        <span class="material-icons text-5xl mb-3 block"
                                            >history</span
                                        >
                                        <p>No applications found yet. Start applying!</p>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    `,
    styles: ``,
})
export class Applications {
    private appService = inject(ApplicationService);
    private authStore = inject(AuthStore);

    applications = signal<Application[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        const user = this.authStore.user();
        if (user?.id) {
            this.appService.getUserApplications(user.id).subscribe({
                next: (data) => {
                    this.applications.set(data);
                    this.isLoading.set(false);
                },
                error: () => this.isLoading.set(false),
            });
        }
    }

    getStatusClasses(status: string) {
        switch (status) {
            case 'accepted':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    }
}
