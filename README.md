# n8n.zapier

A workflow automation SaaS platform built with Next.js 16, featuring visual workflow building, multi-provider AI execution, triggers, and credential management.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **API:** tRPC v11 + TanStack Query
- **Database:** PostgreSQL + Prisma 7
- **Auth:** Better Auth (email/password)
- **Background Jobs:** Inngest (real-time channels)
- **Payments:** Polar
- **AI Providers:** Anthropic, Google Gemini, OpenAI via AI SDK
- **Workflow UI:** React Flow (@xyflow/react)
- **UI:** shadcn/ui + Radix UI + Tailwind CSS v4
- **Monitoring:** Sentry

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Docker (optional, see `docker-compose.yml`)

### Setup

```bash
npm install
cp .env.example .env   # configure your environment variables
npm run db:migrate     # run database migrations
npm run db:seed        # seed initial data
```

### Development

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run dev:all      # Next.js + Inngest dev server together (via mprocs)
npm run inngest:dev  # Inngest dev server only (localhost:8288)
```

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npm run dev:all      # Start Next.js + Inngest together
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prettier     # Format code with Prettier

# Database
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:migrate   # Run migrations (dev)
npm run db:push      # Push schema to DB without migration
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed database

# Background Jobs
npm run inngest:dev  # Start local Inngest dev server
```

> Always run `npm run db:generate` after modifying `prisma/schema.prisma`.

## Architecture

### Request Flow

```
Client → tRPC (TanStack Query) → tRPC Router → Procedure → Prisma (DB)
                                                          ↘ Inngest (async workflow execution)
                                                                    ↘ Real-time channels (per node type)
```

### Directory Structure

```
app/
├── (auth)/              # Login/register pages
├── (dashboard)/
│   ├── (rest)/          # Dashboard routes (workflows, credentials, executions)
│   └── (editor)/        # Workflow editor (React Flow canvas)
└── api/                 # Route handlers: auth/, trpc/, inngest/

features/                # Domain-organized feature modules
├── workflows/           # Workflow CRUD (components/, hooks/, server/)
├── credentials/         # Credential management (Anthropic, Gemini, OpenAI)
├── executions/          # Execution runner and node status tracking
│   └── components/      # Per-node executors: gemini/, openai/, anthropic/, http-request/
├── triggers/            # Trigger node implementations
│   └── components/      # manual-trigger/, google-form-trigger/, stripe-trigger/
├── editor/              # Workflow editor state (Jotai atoms)
├── auth/                # Auth-related UI
└── subscriptions/       # Polar subscription UI

trpc/                    # tRPC setup: init.ts, routers/_app.ts
lib/                     # Shared singletons: auth.ts, db.ts, polar.ts
inngest/                 # Background job functions, client, channels, utils
components/              # Shared UI components (shadcn/ui)
prisma/                  # Schema and migrations
generated/prisma/        # Auto-generated Prisma client (never edit manually)
```

### tRPC Procedures

| Procedure | Auth Required | Subscription Required |
|---|---|---|
| `baseProcedure` | No | No |
| `protectedProcedure` | Yes | No |
| `premiumProcedure` | Yes | Yes (Polar) |

### Node Types

| Category | Type | Description |
|---|---|---|
| Triggers | `MANUAL_TRIGGER` | Start workflow manually |
| Triggers | `GOOGLE_FORM_TRIGGER` | Trigger from Google Form submission |
| Triggers | `STRIPE_TRIGGER` | Trigger from Stripe webhook events |
| Actions | `HTTP_REQUEST` | Make outbound HTTP calls |
| AI | `ANTHROPIC` | Claude models via Anthropic API |
| AI | `GEMINI` | Gemini models via Google AI |
| AI | `OPENAI` | GPT models via OpenAI API |

### Credentials

Credentials are stored per-user and scoped to provider type (`ANTHROPIC`, `GEMINI`, `OPENAI`). Nodes reference a credential by ID; the executor resolves the API key at runtime.

### Workflow Execution (Inngest)

Workflows are executed as Inngest functions (`execute-workflow`). The engine:
1. Loads workflow nodes and connections from DB
2. Topologically sorts nodes to resolve execution order
3. Runs each node executor sequentially, passing output context to the next node
4. Publishes real-time status updates via per-node-type channels

Real-time channels: `http-request`, `manual-trigger`, `google-form-trigger`, `stripe-trigger`, `gemini`, `openai`, `anthropic`.

### Payments (Polar)

`premiumProcedure` gates premium features by checking active subscriptions via `polarClient.customers.getStateExternal()`. Webhooks handled via Better Auth Polar plugin.
