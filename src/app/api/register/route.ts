// app/api/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const rustResponse = await fetch('http://127.0.0.1:4000/add/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await rustResponse.text();

    if (!rustResponse.ok) {
      return NextResponse.json({ error: 'มีชื่อผู้ใช้ซ้ำ', details: data }, { status: rustResponse.status });
    }

    return NextResponse.json({ message: 'Success', serverResponse: data });
    
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
