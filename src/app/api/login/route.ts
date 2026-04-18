// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ใช้ AXUM_API_URL จาก .env.local แทนการ hardcode — แก้ได้จุดเดียวไม่ต้องมาแก้ทุกไฟล์
    const apiUrl = process.env.AXUM_API_URL ?? 'http://127.0.0.1:4000';
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify(body),
    });

    // แก้ parsing: Axum ส่งกลับเป็น JSON { "token": "eyJ..." } ไม่ใช่ plain string
    // จึง parse JSON แล้วดึง .token ออกมาแทนการใช้ .text() + .replace()
    const data = await response.json();

    // แก้ condition: ใช้ response.ok อย่างเดียวพอ เพราะ Axum คืน 200 ปกติ ไม่ใช่ 202
    if (response.ok) {
      // ส่ง Token กลับไปในรูปแบบที่เข้าถึงง่าย
      return NextResponse.json({ token: data.token }, { status: 200 });
    } else {
      // แก้ error handling: พยายาม parse JSON error จาก Axum ({ "error": "..." }) ก่อน
      // แล้ว fallback เป็น "Login Failed" ถ้าไม่มี
      return NextResponse.json({ message: data.error ?? "Login Failed" }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}