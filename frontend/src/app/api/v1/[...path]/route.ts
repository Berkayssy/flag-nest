import { NextRequest, NextResponse } from 'next/server';

const backend = process.env.NEXT_SERVER_API_BASE || 'http://localhost:3001';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSetCookies(headers: Headers): string[] {
    const h = headers as Headers & { getSetCookie: () => string[]; raw?: () => Record<string, string[]>; };
    if (typeof h.getSetCookie === 'function') return h.getSetCookie();
    if (typeof h.raw === 'function') return h.raw()['set-cookie'] || [];
    const c = headers.get('set-cookie');
    return c ? c.split(/,(?=\s*[^;,\s]+=)/g).map(v => v.trim()) : [];
}

async function proxy(req: NextRequest, path: string[]) {
    const url = `${backend}/api/v1/${path.join("/")}${req.nextUrl.search}`;
    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('content-length');

    const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer();
    const upstream = await fetch(url, { method: req.method, headers, body, redirect: 'manual' });

    const res = new NextResponse(upstream.body, { status: upstream.status });
    upstream.headers.forEach((v, k) => {
        const key = k.toLowerCase();
        if (key !== 'set-cookie' && key !== 'content-length') res.headers.set(k, v);
    });

    for (const cookie of getSetCookies(upstream.headers)) {
        res.headers.append('Set-Cookie', cookie);
    }

    return res;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params; return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params; return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params; return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params; return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params; return proxy(req, path);
}