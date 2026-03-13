import type { FlagNestClientOptions, FlagNestClient } from "@/types/flag-nest-client";

export function createFlagNestClient({ baseUrl, token }: FlagNestClientOptions): FlagNestClient {
    async function isEnabled(flagKey: string, userId: string): Promise<boolean> {
       const res = await fetch(`${baseUrl}/api/v1/flags/${flagKey}/evaluate?user_id=${encodeURIComponent(userId)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: "no-store",
        });

        const json = await res.json();
        if (!res.ok) {
            throw new Error(json?.error || "Evaluation failed");
        }
        return Boolean(json?.data?.enabled);
    }

    return { isEnabled };
}
