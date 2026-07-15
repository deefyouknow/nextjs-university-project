import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AXUM_API = 'http://api.deefthanawat.online';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') ?? '50';

  const res = await fetch(`${AXUM_API}/commands/history?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
