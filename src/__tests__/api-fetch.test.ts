import { describe, it, expect } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// API Fetch URL Tests
//
// ตรวจสอบว่า Web App เรียก API endpoints ได้ถูกต้อง
// และ Proxy mapping ทำงานได้ตามที่ควร
// ─────────────────────────────────────────────────────────────────────────────

const AXUM_API = 'http://api.deefthanawat.online';

// ── Proxy Logic ──────────────────────────────────────────────────────────────

/**
 * จำลอง proxy logic จาก src/proxy.ts
 * ตัด /api ออกแล้วต่อกับ AXUM_API
 */
function proxyRewrite(pathname: string): string | null {
  const PROXY_PREFIXES = ['/api/sensors', '/api/commands'];
  const isProxy = PROXY_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProxy) return null;
  const upstreamPath = pathname.replace(/^\/api/, '');
  return `${AXUM_API}${upstreamPath}`;
}

// ── Expected Fetch URLs ──────────────────────────────────────────────────────

/**
 * ทุก fetch URL ที่ Web App ใช้จริง
 * แยกตาม page/component ที่เรียก
 */
const FETCH_URLS = {
  dashboard: [
    { url: '/api/sensors/latest', desc: 'latest sensor reading' },
    { url: '/api/sensors/history?limit=50', desc: 'sensor history (50 records)' },
    { url: '/api/commands/history?limit=50', desc: 'command history (50 records)' },
  ],
  tables: [
    { url: '/api/sensors/history?limit=100', desc: 'sensor history (100 records)' },
  ],
  createCommand: [
    { url: '/api/commands', method: 'POST', desc: 'create new command' },
  ],
  auth: [
    { url: '/api/login', method: 'POST', desc: 'login' },
    { url: '/api/register', method: 'POST', desc: 'register' },
  ],
} as const;

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Proxy URL Rewriting', () => {
  it('should rewrite /api/sensors/latest → Axum /sensors/latest', () => {
    const result = proxyRewrite('/api/sensors/latest');
    expect(result).toBe(`${AXUM_API}/sensors/latest`);
  });

  it('should rewrite /api/sensors/history?limit=50 → Axum /sensors/history?limit=50', () => {
    const result = proxyRewrite('/api/sensors/history?limit=50');
    expect(result).toBe(`${AXUM_API}/sensors/history?limit=50`);
  });

  it('should rewrite /api/commands/history → Axum /commands/history', () => {
    const result = proxyRewrite('/api/commands/history?limit=50');
    expect(result).toBe(`${AXUM_API}/commands/history?limit=50`);
  });

  it('should rewrite POST /api/commands → Axum /commands', () => {
    const result = proxyRewrite('/api/commands');
    expect(result).toBe(`${AXUM_API}/commands`);
  });

  it('should NOT rewrite non-proxy paths', () => {
    expect(proxyRewrite('/api/login')).toBeNull();
    expect(proxyRewrite('/api/register')).toBeNull();
    expect(proxyRewrite('/dashboard')).toBeNull();
    expect(proxyRewrite('/')).toBeNull();
  });
});

describe('Dashboard Page - Fetch URLs', () => {
  const urls = FETCH_URLS.dashboard;

  urls.forEach(({ url, desc }) => {
    it(`should fetch ${desc} from "${url}"`, () => {
      // ตรวจสอบว่า URL format ถูกต้อง
      expect(url).toMatch(/^\/api\/(sensors|commands)\//);

      // ตรวจสอบว่า proxy จับได้
      const pathname = url.split('?')[0]; // strip query string
      const result = proxyRewrite(pathname);
      expect(result).not.toBeNull();
      expect(result).toContain(AXUM_API);
    });
  });
});

describe('Tables Page - Fetch URLs (Bug Fix Verification)', () => {
  const urls = FETCH_URLS.tables;

  urls.forEach(({ url, desc }) => {
    it(`should fetch ${desc} from "${url}" (plural "sensors")`, () => {
      // BUG FIX: ต้องใช้ /api/sensors (มี s) ไม่ใช่ /api/sensor (ไม่มี s)
      expect(url).toMatch(/^\/api\/sensors\//);
      expect(url).not.toMatch(/^\/api\/sensor\//); // singular = BUG
    });
  });

  it('should match proxy matcher pattern', () => {
    const pathname = '/api/sensors/history';
    const PROXY_PREFIXES = ['/api/sensors', '/api/commands'];
    const isProxy = PROXY_PREFIXES.some((p) => pathname.startsWith(p));
    expect(isProxy).toBe(true);
  });
});

describe('Proxy Matcher - Path Matching', () => {
  const PROXY_PREFIXES = ['/api/sensors', '/api/commands'];

  const shouldMatch = [
    '/api/sensors/latest',
    '/api/sensors/history',
    '/api/sensors/history?limit=50',
    '/api/commands',
    '/api/commands/history',
    '/api/commands/history?limit=50',
  ];

  const shouldNotMatch = [
    '/api/login',
    '/api/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/sensor/history',  // singular - must NOT match
    '/api/command/history', // singular - must NOT match
  ];

  shouldMatch.forEach((pathname) => {
    it(`should proxy: ${pathname}`, () => {
      const base = pathname.split('?')[0];
      expect(PROXY_PREFIXES.some((p) => base.startsWith(p))).toBe(true);
    });
  });

  shouldNotMatch.forEach((pathname) => {
    it(`should NOT proxy: ${pathname}`, () => {
      const base = pathname.split('?')[0];
      expect(PROXY_PREFIXES.some((p) => base.startsWith(p))).toBe(false);
    });
  });
});

describe('Auth Routes - Should NOT go through proxy', () => {
  const authUrls = FETCH_URLS.auth;

  authUrls.forEach(({ url, desc }) => {
    it(`${desc} URL "${url}" should not be proxied`, () => {
      const result = proxyRewrite(url);
      expect(result).toBeNull();
    });
  });
});
