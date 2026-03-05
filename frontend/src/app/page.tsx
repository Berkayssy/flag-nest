"use client";

import Link from "next/link";

export default function Home() {

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

          <Link
            href="/login"
            className="px-3 py-2 text-sm font-medium text-black transition underline"
          >
            Sign in
          </Link>
        </header>

        {/* Hero section with title, description and call to action */}
        <section className="flex flex-1 items-center py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Release Control</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Ship features safely,
              <br />
              one rollout at a time.
            </h1>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              A minimal control layer for feature flags, staged rollouts and team-safe releases.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-slate-900 px-4 py-3 text-md font-medium text-white transition hover:bg-slate-800"
              >
                Get started
              </Link>
            </div>
          </div>
        </section>

        {/* Footer with copyright and privacy policy link */}
        <footer className="border-t border-slate-200 pt-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Flag Nest</span>
            <span>Copyright policy</span>
          </div>
        </footer>
      </div>
    </main>
  );
}