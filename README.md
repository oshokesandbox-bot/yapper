# Yapper

Language learning through guided immersion, literacy, simple production, dictionary skills, and comprehension/composition testing.

## Apps

- `apps/api` — TypeScript API, Prisma/PostgreSQL, AI/content pipeline foundation
- `apps/web` — learner/public Next.js app
- `apps/admin` — admin/content review Next.js app

## Packages

- `packages/shared` — shared language/stage constants, schemas, types
- `packages/ui` — shared UI primitives
- `packages/ai-core` — AI generation contracts and prompt builders
- `packages/audio` — browser audio abstractions
- `packages/config` — shared config helpers

## Phase 0

Scaffolded to match the approved MVP plan and the Digitic-inspired separation: backend API, learner app, admin dashboard, and shared domain packages.

## Deployment

### Web app

Deploy `apps/web` to Vercel as the learner-facing app.

Recommended Vercel settings:

- Root Directory: `apps/web`
- Framework Preset: Next.js
- Install Command: configured in `apps/web/vercel.json`
- Build Command: configured in `apps/web/vercel.json`
- Output Directory: `.next`

### Admin app

Deploy `apps/admin` to Vercel as a separate project.

Recommended Vercel settings:

- Root Directory: `apps/admin`
- Framework Preset: Next.js
- Install Command: configured in `apps/admin/vercel.json`
- Build Command: configured in `apps/admin/vercel.json`
- Output Directory: `.next`

### API

Deploy the API to Render with:

- Build command: `pnpm install --frozen-lockfile && pnpm --filter @yapper/api build`
- Start command: `pnpm --filter @yapper/api start`
- Environment variables:
  - `NODE_ENV=production`
  - `DATABASE_URL=<Neon connection string>`

Render supplies `PORT` automatically; the API reads it from the environment.
