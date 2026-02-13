import { Job } from './job.model';

export interface Favorite {
    id?: string;
    userId: string;
    job: Job;
    dateAdded: string;
}
