import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AXUM_API = 'http://api.deefthanawat.online';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${AXUM_API}/sensors/latest`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
  }

  // Axum returns { reading: SensorReading | null } — unwrap for frontend
  const data = await res.json();
  return NextResponse.json(data.reading ?? null, { status: 200 });
}
