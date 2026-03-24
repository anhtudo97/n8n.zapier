# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run dev:all      # Start Next.js + Inngest dev server together (via mprocs)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run prettier     # Format code with Prettier

# Database
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:migrate   # Run migrations (dev)
npm run db:push      # Push schema to DB without migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Inngest (background jobs)
npm run inngest:dev  # Start local Inngest dev server at localhost:8288
```

> Always run `npm run db:generate` after modifying `prisma/schema.prisma`.

## Architecture Overview

**Stack:** Next.js 16 (App Router) + tRPC v11 + Prisma 7 + PostgreSQL + Better Auth + Inngest + Polar (payments) + Sentry

### Request Flow

```
Client → tRPC (via TanStack Query) → tRPC Router → Procedure → DB (Prisma)
                                                             ↘ Inngest (async jobs)
```

### Directory Structure

- `app/` — Next.js App Router pages and layouts
  - `(auth)/` — Login/register pages (unauthenticated routes)
  - `(dashboard)/` — Protected dashboard routes (workflows, subscriptions)
  - `api/` — API route handlers: `auth/`, `trpc/`, `inngest/`
- `features/` — Domain-organized feature modules (each has `components/`, `hooks/`, `server/`)
  - `workflows/` — Workflow CRUD feature
  - `auth/` — Auth-related UI
  - `subscriptions/` — Polar subscription UI
- `trpc/` — tRPC setup: `init.ts` (context + procedures), `routers/_app.ts` (root router)
- `lib/` — Shared singletons: `auth.ts` (Better Auth), `db.ts` (Prisma client), `polar.ts` (Polar SDK)
- `inngest/` — Background job functions (`functions.ts`) and client (`client.ts`)
- `components/` — Shared UI components (shadcn/ui based, Radix UI + Tailwind)
- `generated/prisma/` — Auto-generated Prisma client (never edit manually)

### tRPC Procedures

Three procedure types defined in `trpc/init.ts`:
- `baseProcedure` — No auth required
- `protectedProcedure` — Requires valid session (via Better Auth)
- `premiumProcedure` — Requires active Polar subscription + session

### Auth

Better Auth with email/password + Polar plugin. Auth config at `lib/auth.ts`, client at `lib/auth-client.ts`. Session checked server-side via `auth.api.getSession({ headers })`.

### Background Jobs (Inngest)

Inngest handles async AI execution jobs. Dev server runs at `localhost:8288`. Functions are registered at `app/api/inngest/route.ts`. Current functions: `execute-ai` (Gemini AI text generation via AI SDK).

### Payments (Polar)

Polar handles subscriptions. `premiumProcedure` gates premium features by checking active subscriptions via `polarClient.customers.getStateExternal()`. Webhooks handled via Better Auth Polar plugin.

### UI Components

shadcn/ui component library (`components.json` config). Components live in `components/ui/`. Tailwind CSS v4 with `tw-animate-css`.
