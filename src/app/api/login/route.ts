// app/api/login/route.js
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('http://127.0.0.1:4000/add/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify(body),
    });

    // เนื่องจาก Backend ส่งมาเป็น String (JWT) ตรงๆ ไม่ได้เป็น JSON
    const token = await response.text(); 

    if (response.status === 202 || response.ok) {
      // ส่ง Token กลับไปในรูปแบบที่เข้าถึงง่าย
      return NextResponse.json({ token: token.replace(/"/g, '') }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Login Failed" }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
