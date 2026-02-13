export interface Job {
    id: string;
    name: string;
    contents: string;
    publication_date: string;
    locations: { name: string }[];
    categories: { name: string }[];
    levels: { name: string }[];
    company: { name: string };
    refs: { landing_page: string };
}

export interface JobSearchParams {
    keywords: string;
    location: string;
    page: number;
    category?: string;
    level?: string;
}

export interface JobSearchResult {
    jobs: Job[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}
