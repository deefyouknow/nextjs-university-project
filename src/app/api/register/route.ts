// app/api/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // ใช้ AXUM_API_URL จาก .env.local แทนการ hardcode — แก้ได้จุดเดียวไม่ต้องมาแก้ทุกไฟล์
    const apiUrl = process.env.NEXT_PUBLIC_AXUM_API_URL ?? 'http://127.0.0.1:4000';
    const rustResponse = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    // แก้ parsing: Axum ส่งกลับเป็น JSON { "token": "..." } ไม่ใช่ plain string
    // จึง parse JSON แทนการใช้ .text()
    const data = await rustResponse.json();

    if (!rustResponse.ok) {
      return NextResponse.json({ error: 'มีชื่อผู้ใช้ซ้ำ', details: data }, { status: rustResponse.status });
    }

    return NextResponse.json({ message: 'Success', serverResponse: data });

  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
