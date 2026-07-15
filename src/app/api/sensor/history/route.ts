import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AXUM_API = 'http://api.deefthanawat.online';

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

  try {
    const res = await fetch(`${AXUM_API}/sensors/history?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error', status: res.status }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Fetch history error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
