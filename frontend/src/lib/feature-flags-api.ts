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

interface ApiSuccess<T> {
    data: T;
}

interface ApiError {
    error: string;
}

async function request<T>( path: string, init?: RequestInit ) : Promise<T> {
    const response = await fetch(`/api/v1/${path}`, {
        credentials: 'include',
        headers: { "Conbtent-Type": "application/json" },
        ...init,
    });

    const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiError | null;

    if (!response.ok) {
        const message = payload && "error" in payload ? payload.error : "Request failed";
        throw new Error(message);
    }

    if (!payload || !("data" in payload)) {
        throw new Error("Invalid response format");
    }

    return payload.data;
}

export const featureFlagsApi = {
    list: () => request<FeatureFlag[]>("/feature_flags"),
    create: ( body: { name: string; key: string; enabled: boolean; description?: string }) =>
        request<FeatureFlag>("/feature-flags", {
            method: "POST",
            body: JSON.stringify({ feature_flag: body }),
        }
    ),
};