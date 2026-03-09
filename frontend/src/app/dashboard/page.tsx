"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isAdmin, isManagerOrAdmin } from "@/lib/rbac";
import { featureFlagsApi, type FeatureFlag } from "@/lib/feature-flags-api";
import type { RolloutRule } from "@/types/rollout-rule";
import { listRolloutRules, createRolloutRule, updateRolloutRule, deleteRolloutRule } from "@/lib/rollout-rules-api";
import { AuditLogItem } from "@/types/audit-log";
import { listAuditLogs } from "@/lib/audit-logs-api";

export default function DashboardPage() {
    // State for auth
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    // State for feature flags
    const [ flags, setFlags ] = useState<FeatureFlag[]>([]);
    const [ flagsLoading, setFlagsLoading ] = useState(true);
    const [ flagsError, setFlagsError ] = useState("");

    const [ name, setName ] = useState("");
    const [ key, setKey ] = useState("");
    const [ enabled, setEnabled ] = useState(false);
    const [ description, setDescription ] = useState("");
    const [ creating, setCreating ] = useState(false);

    // State for rollout rules
    const [ selectedFlagId, setSelectedFlagId ] = useState<number | null>(null);
    const [ rules, setRules ] = useState<RolloutRule[]>([]);
    const [ rulesLoading, setRulesLoading ] = useState(false);
    const [ rulesError, setRulesError ] = useState("");

    const [ showCreateRule, setShowCreateRule ] = useState(false);
    const [ newPercentage, setNewPercentage ] = useState("50");
    const [ newActive, setNewActive ] = useState(true);

    const canReadRules = isManagerOrAdmin(user?.role);
    const canWriteRules = isAdmin(user?.role);

    // State for audit logs
    const [ auditLogs, setAuditLogs ] = useState<AuditLogItem[]>([]);
    const [ auditLoading, setAuditLoading ] = useState(false);
    const [ auditError, setAuditError ] = useState("");

    // Hide-hidden create form
    const [ showCreate, setShowCreate ] = useState(false);

    // Redirect to login if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    // Get feature flags list function
    const getFlags = async () => {
        setFlagsLoading(true);
        setFlagsError("");

        try {
            const data = await featureFlagsApi.list();
            setFlags(data);
        }   catch (err) {
            setFlagsError(err instanceof Error ? err.message : "Failed to fetch feature flags");
        }   finally {
            setFlagsLoading(false);
        }
    };

    // Get feature flags on load
    useEffect(() => {
        if (!loading && user) {
            getFlags();
        }
    }, [loading, user]);

    // Create feature flag
    const createFlag = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setFlagsError("");

        try {
            await featureFlagsApi.create({ name, key, enabled, description });
            setName("");
            setKey("");
            setEnabled(false);
            setDescription("");
            await getFlags();
        }   catch (err) {
            setFlagsError(err instanceof Error ? err.message : "Failed to create feature flag");
        }   finally {
            setCreating(false);
        }
    };

    // Load rollout rules, if feature flag is selected and user has permission
    const loadRules = useCallback(async ( featureFlagId: number ) => {
        setRulesLoading(true);
        setRulesError("");
        try {
            const data = await listRolloutRules(featureFlagId);
            setRules(data);
        }   catch (err) {
            setRulesError(err instanceof Error ? err.message : "Failed to fetch rollout rules");
        }   finally {
            setRulesLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!selectedFlagId || selectedFlagId < 1 || !canReadRules) return;
        loadRules(selectedFlagId);
    },  [selectedFlagId, canReadRules, loadRules]);

    async function onCreateRule(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedFlagId) return;

        const percentage = Number(newPercentage);
        if (Number.isNaN(percentage) || percentage < 0 || percentage > 100) return;

        try {
            await createRolloutRule(selectedFlagId, { 
                rule_type: "percentage",
                value: null,
                percentage,
                active: newActive
            });
            setShowCreateRule(false);
            setNewPercentage("50");
            setNewActive(true);
            await loadRules(selectedFlagId);
        }   catch (err) {
            setRulesError(err instanceof Error ? err.message : "Failed to create rollout rule");
        }
    }

    async function onToggleRule(rule: RolloutRule) {
        if (!canWriteRules || !selectedFlagId) return;
        try {
            await updateRolloutRule(rule.id, { active: !rule.active });
            await loadRules(selectedFlagId);
        }   catch (err) {
            setRulesError(err instanceof Error ? err.message : "Failed to update rollout rule");
        }
    }

    async function onDeleteRule(ruleId: number) {
        if (!canWriteRules || !selectedFlagId) return;
        try {
            await deleteRolloutRule(ruleId);
            await loadRules(selectedFlagId);
        }   catch (err) {
            setRulesError(err instanceof Error ? err.message : "Failed to delete rollout rule");
        }
    }

    // Get load audit logs functions
    const loadAuditLogs = useCallback(async () => {
        if (!isManagerOrAdmin(user?.role)) return;

        setAuditLoading(true);
        setAuditError("");

        try {
            const data = await listAuditLogs();
            setAuditLogs(data);
        }   catch (err) {
            setAuditError(err instanceof Error ? err.message : "Failed to fetch audit logs");
        }   finally {
            setAuditLoading(false);
        }
    }, [user?.role]);

    useEffect(() => {
        if (!loading && user &&!isManagerOrAdmin(user?.role)) {
            loadAuditLogs();
        }
    }, [loading, user, loadAuditLogs]);

    // Loading screen
    if (loading || !user) {
        
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
                <div className="mx-auto w-full max-w-3xl rounded-xl p-6 text-center">
                    <p className="text-sm font-medium text-slate-700">Loading...</p>
                    <div className="mt-3 h-1.5 w-32 mx-auto overflow-hidden rounded bg-slate-200">
                        <div className="h-full w-1/2 animate-pulse rounded bg-slate-500" />
                    </div>
                </div>
            </main>
        );
    }
    
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">

                {/* Header with app name, logo, new feature button and logout */}
                <header className="flex w-full items-center justify-between border-b border-slate-200 pb-4">
                    <div className="inline-flex items-center gap-2">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="text-slate-700"
                        >
                            <circle cx="4" cy="3" r="2" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="4" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
                            <path
                                d="M4 5v4c0 1.1.9 2 2 2h4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div>
                            <Link href="/dashboard" className="text-sm font-semibold tracking-wide">
                                Flag Nest
                            </Link>
                            <p className="text-xs text-slate-500">Workspace dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {(isAdmin(user.role) ? (
                            <button
                                className="px-3 py-2 text-sm font-medium text-slate-700 rounded-md border border-slate-300 transition hover:bg-slate-100 hover:text-slate-900"
                                type="button"
                                onClick={() => setShowCreate((prev) => !prev)}
                            >
                                + Create
                            </button>
                        ): null)}
                        <button
                            onClick={async () => {
                                await logout();
                                router.push("/login");
                            }}
                            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-rose-700"
                            type="button"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {(isManagerOrAdmin(user.role) ? (
                    <>
                        {/* Workspace stats */}    
                        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <article className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Active Flags</p>
                                <p className="mt-2 text-2xl font-semibold">12</p>
                            </article>
                            <article className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Live Rollouts</p>
                                <p className="mt-2 text-2xl font-semibold">4</p>
                            </article>
                            <article className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Change Fail Rate</p>
                                <p className="mt-2 text-2xl font-semibold">0.8%</p>
                            </article>
                            <article className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Last Deploy</p>
                                <p className="mt-2 text-2xl font-semibold">2h ago</p>
                            </article>
                        </section>

                        {/* Recent Rollouts and Current Session */}
                        <section className="mt-6 grid gap-4 lg:grid-cols-3">
                            <article className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-semibold">Recent Rollouts</h2>
                                    <button className="text-sm text-slate-600 hover:text-slate-900 underline">View all</button>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {[
                                        { name: "new_billing_ui", audience: "10% of tenants", status: "monitoring" },
                                        { name: "smart_approval_flow", audience: "Managers only", status: "active" },
                                        { name: "mobile_quick_actions", audience: "5% of users", status: "paused" },
                                    ].map((item) => (
                                        <div key={item.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <div>
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.audience}</p>
                                            </div>
                                            <span className="rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-700">
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                    
                            <article className="rounded-xl border border-slate-200 bg-white p-5">
                                <h2 className="text-base font-semibold">Current Session</h2>
                                <div className="mt-4 space-y-2 text-sm">
                                    <p><span className="text-slate-500">Name:</span> {user.name}</p>
                                    <p><span className="text-slate-500">Email:</span> {user.email}</p>
                                    <p><span className="text-slate-500">Role:</span> {user.role}</p>
                                </div>

                                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Next milestone</p>
                                    <p className="mt-2 text-sm text-slate-700">RBAC + flag ownership + audit trail</p>
                                </div>
                            </article>
                        </section>
                    </>
                ) : null )}

                {isAdmin(user.role) && showCreate && (
                    <form onSubmit={createFlag} className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-5">
                        <h3 className="text-sm font-semibold">Create a new flag</h3>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Flag name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" required />
                        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="flag_key" className="rounded-md border border-slate-300 px-3 py-2 text-sm" required />
                        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />

                        <div className="mt-4 flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                                    Enabled
                            </label>

                            <button type="submit" disabled={creating} className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
                                {creating ? "Creating..." : "Create flag"}
                            </button>
                        </div>
                    </form>
                )}
                
                {/* Feature flags list */}
                <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-semibold">Feature Flags</h3>
                    {flagsLoading ? <p className="mt-2 text-sm text-slate-600">Loading flags...</p> : null}
                    {flagsError ? <p className="mt-2 text-sm text-red-600">{flagsError}</p> : null}

                    {!flagsLoading && !flagsError && (
                        <ul className="mt-3 space-y-2">
                            {flags.map((f) => (
                                <li key={f.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium">{f.name}</p>
                                        <p className="text-xs text-slate-500">{f.key}</p>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-xs ${f.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                                        {f.enabled ? "enabled" : "disabled"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {canReadRules && (
                    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Rollout Rules</h3>
                            { canWriteRules && (
                                <button type="button" onClick={() => setShowCreateRule((prev) => !prev)} className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100">
                                    {showCreateRule ? "Close" : "+ Add Rule"}
                                </button>
                            )}
                        </div>

                        <div className="mt-3">
                            <label className="text-xs text-slate-600"> Selected flag id</label>
                            <input 
                                type="number"
                                value={selectedFlagId ?? ""}
                                onChange={(e) => setSelectedFlagId(Number(e.target.value) || null)}
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Feature flag id"
                            />
                        </div>

                        {canWriteRules && showCreateRule && (
                            <form onSubmit={onCreateRule} className="mt-3 grid gap-2 sm:grid-cols-3">
                                <input 
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={newPercentage}
                                    onChange={(e) => setNewPercentage(e.target.value)}
                                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                                    placeholder="Percentage"
                                />

                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input 
                                        type="checkbox"
                                        checked={newActive}
                                        onChange={(e) => setNewActive(e.target.checked)}
                                    />
                                    Active
                                </label>
                                    <button 
                                        type="submit" 
                                        className="rounded-md bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-700"
                                    >
                                        Save
                                    </button>
                            </form>
                            
                        )}

                        {rulesLoading && <p className="mt-3 text-sm text-slate-600">Loading rules...</p>}
                        {rulesError && <p className="mt-3 text-sm text-rose-600">{rulesError}</p>}

                        {!rulesLoading && !rulesError && (
                            <div className="mt-3 space-y-2">
                                {rules.length === 0 ? (
                                    <p className="text-sm text-slate-500">No rollout rules yet.</p>
                                    ) : (
                                    rules.map((r) => (
                                        <div
                                            key={r.id}
                                            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                            <p className="text-sm text-slate-800">
                                                {r.rule_type} - {r.percentage}% - {r.active ? "active" : "inactive"}
                                            </p>

                                            {canWriteRules && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onToggleRule(r)}
                                                        className="text-sm text-slate-600 hover:text-slate-900"
                                                    >
                                                        Toggle
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteRule(r.id)}
                                                        className="text-sm text-rose-600 hover:text-rose-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* Audit Activity */}
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold">Audit Activity</h2>
                        <button className="text-sm text-slate-600 hover:text-slate-900">Export</button>
                    </div>

                    {auditLoading && <p className="mt-3 text-sm text-slate-600">Loading activity...</p>}
                    {auditError && <p className="mt-3 text-sm text-rose-600">{auditError}</p>}

                    {!auditLoading && !auditError && (
                        <div className="mt-3 space-y-2">
                            {auditLogs.length === 0 ? (
                                <p className="text-sm text-slate-500">No audit activity yet.</p>
                                ) : (
                                auditLogs.slice(0, 8).map((l) => (
                                    <div key={l.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                        <p className="text-sm text-slate-800">
                                           - {l.user.email} {l.action} ({l.resource_type} #{l.resource_id})
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}