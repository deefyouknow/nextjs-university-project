# CLAUDE.md - Web App (Next.js 14 + TypeScript)

> **Project:** Automatic Lime Grading Machine - Web Dashboard
> **Location:** `apps/web/`
> **Parent:** `/final_project_2/CLAUDE.md`

---

## 🎯 Component Overview

| Aspect | Detail |
|--------|--------|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **UI** | Tailwind CSS + shadcn/ui |
| **State** | React Query (server) + Zustand (client) |
| **Real-time** | WebSocket to API (`/ws/grading/{id}`) |
| **Auth** | JWT (HttpOnly cookie) + Roles (admin/operator) |
| **Deploy** | Docker → VPS/Cloud |

---

## 📁 Key Directories

```
apps/web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (auth)/            # Login, register
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── grading/       # Real-time grading monitor
│   │   │   ├── history/       # Historical sessions
│   │   │   ├── config/        # System configuration
│   │   │   └── firmware/      # Firmware management
│   │   └── api/               # Next.js API routes (proxy to API)
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── grading/           # Grading-specific components
│   │   ├── charts/            # Recharts/Recharts components
│   │   └── forms/             # Form components
│   ├── lib/
│   │   ├── api.ts             # Axum API client
│   │   ├── ws.ts              # WebSocket client
│   │   ├── auth.ts            # Auth utilities
│   │   └── utils.ts           # Utilities
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # Shared TypeScript types
│   └── styles/                # Global styles
├── public/                    # Static assets
└── docker/
```

---

## 🛠️ Common Commands

```bash
# From project root
pnpm dev:web                    # Dev server (port 3000)
pnpm build:web                  # Production build
pnpm lint:web                   # ESLint
pnpm typecheck:web              # TypeScript check
cd apps/web && npm run dev      # Direct dev
cd apps/web && npm run build    # Direct build
```

---

## 🔑 Key Conventions

### API Client (`src/lib/api.ts`)
```typescript
// Axios/axios instance with interceptors
// Base URL: process.env.NEXT_PUBLIC_API_URL
// Auto-attaches JWT from cookie
// Handles 401 → redirect to login
```

### WebSocket (`src/lib/ws.ts`)
```typescript
// Reconnecting WebSocket client
// URL: ${NEXT_PUBLIC_WS_URL}/ws/grading/{sessionId}
// Auto-reconnect with exponential backoff
// Message types: status, progress, result, error
```

### Types (`src/types/`)
- Mirror `apps/api/src/types/` via shared-types package (WIP)
- Use `zod` schemas for runtime validation

### Components
- **Server Components** by default (App Router)
- `'use client'` only for interactivity (hooks, WS, forms)
- shadcn/ui for base components
- Custom components in `components/{domain}/`

### State
- **Server state:** React Query (`useQuery`, `useMutation`)
- **Client state:** Zustand (`stores/*.ts`)
- **Forms:** React Hook Form + Zod

---

## 🔗 Key Integration Points

| Integration | Endpoint | Protocol |
|-------------|----------|----------|
| **Auth** | `/api/auth/*` | REST + HttpOnly cookie |
| **Grading Sessions** | `/api/grading/*` | REST |
| **Real-time Grading** | `/ws/grading/{id}` | WebSocket |
| **Firmware Mgmt** | `/api/firmware/*` | REST |
| **Config** | `/api/config/*` | REST |
| **Reports** | `/api/reports/*` | REST |

---

## 🔐 Auth Flow

```
Login → POST /api/auth/login → HttpOnly cookie set
      → Redirect to /dashboard
      → Middleware validates cookie on protected routes
      → 401 → Clear cookie → Redirect to /login
```

---

## 📦 Build & Deploy

```dockerfile
# Multi-stage Dockerfile
# Stage 1: builder (node:20-alpine) → npm ci && npm run build
# Stage 2: runner (node:20-alpine) → COPY --from=builder .next/standalone
# Output: standalone Next.js for minimal image
```

---

## 🛠️ Skills Available

Use `/skill-name` or `Skill` tool:

| Skill | Use For |
|-------|---------|
| `/code-review` | PR reviews, code quality |
| `/debug-mantra` | Debugging React/Next.js issues |
| `/design-an-interface` | UI component design |
| `/prototype` | Quick UI prototypes |
| `/qa` | Test planning, e2e tests |
| `/tdd` | Test-driven development |
| `/verification` | Verify changes work in browser |
| `/simplify` | Code simplification |
| `/fewer-permission-prompts` | Reduce permission prompts |
| `/handoff` | Create session handoff docs |
| `/codebase-design` | Architecture decisions |
| `/language_protocol` | Language protocol enforcement |

---

## 🔗 Related Docs

- **Root Overview:** `../../PROJECT_OVERVIEW.md`
- **API Docs:** `../api/CLAUDE.md`
- **Vault Index:** `../../vault/00-index.md`
- **Architecture:** `../../vault/architecture/overview.md`
- **Web App Notes:** `../../vault/apps/web/overview.md`