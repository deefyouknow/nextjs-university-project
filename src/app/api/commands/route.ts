import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { CreateCommandRequest } from '@/types/command';

const AXUM_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: CreateCommandRequest = await request.json();

  const res = await fetch(`${AXUM_API}/commands`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
