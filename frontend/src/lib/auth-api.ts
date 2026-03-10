import type { ApiError, ApiSuccess, LoginPayload, LoginResponse, MeResponse } from "@/types/auth";
import { csrfHeaders } from "@/lib/csrf";

const API_BASE_URL = "/api/v1";

async function request<T>( path: string, init?: RequestInit ): Promise<T> {
    const method = (init?.method || "GET").toUpperCase();
    const needCsrf = method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(needCsrf ? csrfHeaders(): {}),
            ...(init?.headers || {}),
        },
        ...init,
    });

    const payload = (await response.json().catch( () => null )) as ApiSuccess<T> | ApiError | null;

    if (!response.ok) {
        const message = payload && "error" in payload ? payload.error : "Request failed";
        throw new Error(message);
    }

    if (!payload || !("data" in payload)) {
        throw new Error("Invalid API response");
    }

    return payload.data;
}

export const authApi = {
    login: (body: LoginPayload) => 
        request<LoginResponse>("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }),
    me: () => request<MeResponse>("/auth/me"),
    logout: () => request<{ message?: string }>("/auth/logout", { method: "POST" }),
};