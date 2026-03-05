"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("berkay@test.com");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login({ email, password });
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-6">

                {/* Header with app logo,name and sign in link */}
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
                        <div className="text-md font-semibold tracking-wide">Flag Nest</div>
                    </div>
                </header>

                {/* Login form section */}
                <section className="flex flex-1 items-center justify-center py-12">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <Link
                            href="/"
                            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700"
                        >
                            <span aria-hidden>←</span>
                            <span>Back</span>
                        </Link>

                        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Use your account credentials.</p>

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-5 text-xs text-slate-500">{"Let's"} join the Flag Nest and manage your features quickly.</p>
                    </div>
                </section>
            </div>
        </main>
    );
}