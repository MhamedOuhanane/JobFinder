import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Job } from '../../../core/models/job.model';
import { ApplicationService } from '../../../core/services/application-service';
import { AuthStore } from '../../../store/auth.store';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-apply-button',
    imports: [CommonModule],
    template: `
        <button
            (click)="handleApply()"
            [disabled]="isApplied() || isLoading()"
            class="flex-none px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px]"
            [ngClass]="{
                'bg-green-500/10 text-green-500 border border-green-500/20 cursor-not-allowed':
                    isApplied(),
                'bg-orange-500 hover:bg-orange-600 text-black shadow-lg shadow-orange-500/20 active:scale-95':
                    !isApplied() && !isLoading(),
                'opacity-70 cursor-wait': isLoading(),
            }"
        >
            @if (isLoading()) {
                <div
                    class="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"
                ></div>
                <span>Sending...</span>
            } @else if (isApplied()) {
                <span class="material-icons text-lg">task_alt</span>
                <span class="font-bold text-sm uppercase tracking-tighter">Applied</span>
            } @else {
                <span class="material-icons text-lg -rotate-45 -translate-y-0.5">send</span>
                <span class="font-bold text-sm uppercase tracking-tighter text-black"
                    >Quick Apply</span
                >
            }
        </button>
    `,
    styles: ``,
})
export class ApplyButton {
    job = input.required<Job>();

    private appService = inject(ApplicationService);
    private authStore = inject(AuthStore);

    isApplied = signal<boolean>(false);
    isLoading = signal<boolean>(false);

    ngOnInit() {
        this.checkIfAlreadyApplied();
    }

    checkIfAlreadyApplied() {
        const user = this.authStore.user();
        if (user?.id) {
            this.appService
                .checkIfApplied(Number(user.id), this.job().id)
                .subscribe((application) => {
                    if (application) this.isApplied.set(true);
                });
        }
    }

    handleApply() {
        const user = this.authStore.user();

        if (!user) {
            toast.error('Please login to apply for this job');
            return;
        }

        if (this.isLoading() || this.isApplied()) return;

        this.isLoading.set(true);

        this.appService.apply(Number(user.id), this.job()).subscribe({
            next: () => {
                this.isApplied.set(true);
                this.isLoading.set(false);
                toast.success(`Successfully applied to ${this.job().company.name}!`);
            },
            error: (err) => {
                this.isLoading.set(false);
                toast.error('Something went wrong. Please try again.');
                console.error(err);
            },
        });
    }
}
