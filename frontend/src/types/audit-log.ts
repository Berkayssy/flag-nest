export interface AuditLogUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuditLogItem {
    id: number;
    action: string;
    resource_type: string;
    resource_id: number;
    metadata: Record<string, unknown>;
    created_at: string;
    user: AuditLogUser;
}