import { ApiError, ApiSuccess, FeatureFlag } from "@/types/feature-flag";
import { csrfHeaders } from "@/lib/csrf";

const API_BASE_URL = "/api/v1";

async function request<T>( path: string, init?: RequestInit ) : Promise<T> {
    const method = (init?.method || "GET").toUpperCase();
    const needCsrf = method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: 'include',
        headers: { 
            "Content-Type": "application/json",
            ...(needCsrf ? csrfHeaders() : {}),
            ...(init?.headers || {}),
        },
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
        request<FeatureFlag>("/feature_flags", {
            method: "POST",
            body: JSON.stringify({ feature_flag: body }),
        }
    ),
};