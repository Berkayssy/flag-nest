import { describe, it, expect, vi } from "vitest";
import { createFlagNestClient } from "./flag-nest-client-api";

describe("flag-nest-client-api", () => {
    it("returns enabled true when API returns enabled", async () => {
        const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ data: { enabled: true } }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        );

        const client = createFlagNestClient({ baseUrl: "http://localhost:3001", token: "token" });
        const enabled = await client.isEnabled("payments_v2", "u1");

        expect(enabled).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("throws on non-200 response", async () => {
        vi.spyOn(global, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }),
        );

        const client = createFlagNestClient({ baseUrl: "http://localhost:3001", token: "bad" });
        await expect(client.isEnabled("payments_v2", "u1")).rejects.toThrow("Unauthorized");
    });
});
