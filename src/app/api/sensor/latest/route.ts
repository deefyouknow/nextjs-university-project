import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AXUM_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${AXUM_API}/sensors/latest`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
