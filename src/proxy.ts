// src/proxy.ts — Next.js 16 proxy convention (ใช้ function ชื่อ "proxy" แทน "middleware")
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ⚠️ Production: ต้อง set AXUM_API_URL เป็น HTTPS tunnel URL (ห้ามใช้ 127.0.0.1 ใน Docker)
const AXUM_API = process.env.AXUM_API_URL ?? 'https://api.deefthanawat.online';

// Paths ที่ต้อง proxy ไปยัง Axum โดยตรง
const PROXY_PREFIXES = ['/api/sensors', '/api/commands'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Proxy: /api/sensors/** และ /api/commands/** → Axum ─────────────────────
  const isProxy = PROXY_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProxy) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ตัด /api ออกแล้ว forward ไป Axum (เช่น /api/sensors/latest → /sensors/latest)
    const upstreamPath = pathname.replace(/^\/api/, '');
    const upstreamUrl = `${AXUM_API}${upstreamPath}${request.nextUrl.search}`;

    try {
      const upstreamRes = await fetch(upstreamUrl, {
        method: request.method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: ['POST', 'PUT', 'PATCH'].includes(request.method)
          ? await request.text()
          : undefined,
        cache: 'no-store',
      });

      const data = await upstreamRes.text();

      return new NextResponse(data, {
        status: upstreamRes.status,
        headers: {
          'Content-Type': upstreamRes.headers.get('Content-Type') ?? 'application/json',
        },
      });
    } catch (err) {
      console.error(`[Proxy] Error forwarding ${upstreamUrl}:`, err);
      return NextResponse.json({ error: 'Upstream unreachable' }, { status: 502 });
    }
  }

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const token = request.cookies.get('token')?.value;

  // ถ้าเป็นหน้าแรก (/) ปล่อยผ่านเลย
  if (pathname === '/') {
    return NextResponse.next();
  }

  // ถ้ามี Token แล้วพยายามเข้า login/register → redirect ไปหน้าหลัก
  if (token && pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (token && pathname.startsWith('/auth/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proxy API routes ไปยัง Axum
    '/api/sensors/:path*',
    '/api/commands/:path*',
    // Page routes ทั้งหมด (ยกเว้น Next.js internals)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
