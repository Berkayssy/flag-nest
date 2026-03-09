import type { AuditLogItem } from "@/types/audit-log";

async function readJson<T>(res: Response): Promise<T> {
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json?.error);
    }
    return json as T;
}

export async function listAuditLogs(): Promise<AuditLogItem[]> {
    const res = await fetch(`/api/v1/audit_logs`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });

    const json = await readJson<{ data: AuditLogItem[] }>(res);
    return json.data;
}