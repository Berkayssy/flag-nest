import { describe, it, expect, vi, beforeEach } from "vitest";
import { featureFlagsApi } from "./feature-flags-api";

describe("featureFlagsApi CSRF", () => {
    beforeEach(() => {
        vi.restoreAllMocks();

        // fake csrf cookie
        Object.defineProperty(document, 'cookie', {
            writable: true,
            value: '_csrf_token=test_csrf_token'
        });
    });

    it("sends X-CSRF-Token header on create", async () => {
        const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
            new Response(
                JSON.stringify({
                    data: { 
                        id: 1, 
                        name: "Test", 
                        key: "test_key", 
                        enabled: false,
                        created_by_id: 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    } 
                }),
                { status: 201, headers: { "Content-Type": "application/json" } },
            ),
        );

        await featureFlagsApi.create({
            name: "Test", 
            key: "test_key", 
            enabled: false,
            description: "",
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);

        const [, options] = fetchMock.mock.calls[0];
        const headers = new Headers((options as RequestInit).headers as HeadersInit);
        
        expect(headers.get("X-CSRF-Token")).toBe("test_csrf_token");
    });
});