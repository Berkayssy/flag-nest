import type { RolloutRule, CreateRolloutRuleInput, UpdateRolloutRuleInput } from "@/types/rollout-rule";

// Shared response parser: keeps JSON/error handling in one place to avoid repeating the same logic in each API function.
async function readJson<T>(res: Response): Promise<T> {
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json?.error);
    }
    return json as T;
}

export async function listRolloutRules(featureFlagId: number): Promise<RolloutRule[]> {
    const res = await fetch(`/api/v1/feature_flags/${featureFlagId}/rollout_rules`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });

    const json = await readJson<{ data: RolloutRule[] }>(res);
    return json.data;
}

export async function createRolloutRule(featureFlagId: number, input: CreateRolloutRuleInput,): Promise<RolloutRule> {
    const res = await fetch(`/api/v1/feature_flags/${featureFlagId}/rollout_rules`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollout_rule: input }),
    });

    const json = await readJson<{ data: RolloutRule }>(res);
    return json.data;
}

export async function updateRolloutRule( id: number, input: UpdateRolloutRuleInput,): Promise<RolloutRule> {
    const res = await fetch(`/api/v1/rollout_rules/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollout_rule: input }),
    });

    const json = await readJson<{ data: RolloutRule }>(res);
    return json.data;
}

export async function deleteRolloutRule(id: number): Promise<void> {
    const res = await fetch(`/api/v1/rollout_rules/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    await readJson<{ data: { deleted?: boolean; message?: string }}>(res);
}