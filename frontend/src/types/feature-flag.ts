export interface FeatureFlag {
    id: number;
    name: string;
    key: string;
    enabled: boolean;
    description?: string;
    created_by_id: number;
    created_at: string;
    updated_at: string;
}

export interface ApiSuccess<T> {
    data: T;
}

export interface ApiError {
    error: string;
}