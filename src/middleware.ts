// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // เพิ่มเงื่อนไข: ถ้าเป็นหน้าแรก (/) ให้ปล่อยผ่านไปเลย ไม่ต้องเช็ค Token
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 1. ถ้าไม่มี Token และกำลังจะเข้าหน้าอื่นที่ไม่ใช่หน้า Login/Register
  // if (!token && !pathname.startsWith('/auth')) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  // 2. ถ้ามี Token แล้วแต่อยากจะกลับไปหน้า Login อีก ก็ให้ดีดไปหน้าหลักแทน
  if (token && pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (token && pathname.startsWith('/auth/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// กำหนดว่าให้ Middleware ทำงานที่หน้าไหนบ้าง (ในที่นี้คือแทบทุกหน้ายกเว้นไฟล์ระบบ)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
