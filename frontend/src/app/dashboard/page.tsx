"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isAdmin, isManagerOrAdmin } from "@/lib/rbac";
import { featureFlagsApi, type FeatureFlag } from "@/lib/feature-flags-api";

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
    
    {{/* Dashboard page */}}
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

                {/* Audit Activity */}
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold">Audit Activity</h2>
                        <button className="text-sm text-slate-600 hover:text-slate-900">Export</button>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <p>• `admin@acme.com` enabled `new_billing_ui` for tenant `acme`</p>
                        <p>• rollout increased from 5% → 10% (`mobile_quick_actions`)</p>
                        <p>• `manager@acme.com` paused `smart_approval_flow` after incident check</p>
                    </div>
                </section>
            </div>
        </main>
    );
}