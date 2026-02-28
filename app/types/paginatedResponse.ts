export interface PaginatedResponse<T> {
    data: T;
    status: number;
    page: number;
    limit: number;
    total: number;
}