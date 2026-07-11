import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AXUM_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') ?? '';
  const limit = searchParams.get('limit') ?? '100';

  const params = new URLSearchParams();
  if (date) params.set('date', date);
  params.set('limit', limit);

  const res = await fetch(`${AXUM_API}/sensors/history?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
