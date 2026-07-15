import { describe, it, expect } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// API Smoke Test
//
// ยิง request จริงไปที่ Axum API เพื่อตรวจสอบว่า endpoint ต่างๆ ตอบสนอง
// รันด้วย: npx vitest run src/__tests__/api-smoke.test.ts
//
// หมายเหตุ: ต้องมี API server รันอยู่ที่ AXUM_API_URL
// ─────────────────────────────────────────────────────────────────────────────

const AXUM_API = process.env.AXUM_API_URL ?? 'http://api.deefthanawat.online';

describe(`Smoke Test against ${AXUM_API}`, () => {
  it('GET /sensors/latest should respond (200 or 401)', async () => {
    const res = await fetch(`${AXUM_API}/sensors/latest`);
    // API อาจ return 401 ถ้าไม่มี token, แต่ไม่ควร 404 หรือ connection error
    expect([200, 401, 403]).toContain(res.status);
  });

  it('GET /sensors/history should respond (200 or 401)', async () => {
    const res = await fetch(`${AXUM_API}/sensors/history?limit=5`);
    expect([200, 401, 403]).toContain(res.status);
  });

  it('GET /commands/history should respond (200 or 401)', async () => {
    const res = await fetch(`${AXUM_API}/commands/history?limit=5`);
    expect([200, 401, 403]).toContain(res.status);
  });

  it('POST /commands should respond (200, 401, or 422)', async () => {
    const res = await fetch(`${AXUM_API}/commands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    // 422 = validation error (expected for empty body), 401 = no auth
    expect([200, 401, 403, 422]).toContain(res.status);
  });

  it('should NOT return 404 for any expected endpoint', async () => {
    const endpoints = [
      '/sensors/latest',
      '/sensors/history',
      '/commands/history',
      '/commands',
    ];

    for (const ep of endpoints) {
      const res = await fetch(`${AXUM_API}${ep}`);
      expect(res.status).not.toBe(404);
    }
  });
});
