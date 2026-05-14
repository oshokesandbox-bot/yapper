# Changelog

## [Unreleased]

### Phase 4 — Admin AI Content UI & Navigation
#### Added
- Admin AI content generation page (`/ai`): form with language, stage, content kind, topic, difficulty, and tag-style target vocabulary input; generates via `POST /api/ai/generate`; displays JSON preview with save-to-queue option.
- Admin content review queue page (`/review`): filters by review state (all/pending/approved/rejected), expandable list items with full JSON output display, approve/reject buttons, and review notes textarea.
- Admin sidebar navigation in layout with links to Dashboard, Content, AI Generation, Review Queue, Users, and Analytics.
- Enhanced admin dashboard (`/`): fetches live stats from `GET /api/admin/stats` with auth; shows language/stage/lesson/user/pending-generation counts; quick-action links to AI generation and review pages; loading state while fetching; graceful fallback to seed data when API is unavailable.
- Enhanced admin login page with cleaner dark-themed UI, labeled form fields, error display, proper redirect after authentication.

#### Fixed
- API build script: re-added `prisma generate` before tsc (lost during Phase 3 merge).
- Lockfile sync: updated `pnpm-lock.yaml` to match remote package.json changes.

### Phase 3 — Immersion Recommendations & Admin Content Management
#### Added
- Immersion recommendations browser (`/recommendations`): language + media type filtering.
- Recommendation detail page (`/recommendations/[id]`): challenge text, stage hints, related recommendations.
- Watch challenge flow (`/immerse/[recommendationId]`): 4-step process (prep → watch → reflect → summary).
- POST `/api/immersion/complete` endpoint for logging immersion sessions (auth required).
- GET `/api/recommendations/:id` with stage detail and related recommendations.
- Filtered query support (mediaType, stage) for GET `/api/recommendations`.
- 20 new media recommendations across all 5 languages (French, Spanish, English, German, Russian).
- Admin content management: list, add, edit, delete recommendations.
- Dashboard sidebar links to immerse flow and "Find more media".
- AI generation pipeline: `POST /api/ai/generate`, `GET /api/ai/generations`, `PATCH /api/ai/generations/:id/review` endpoints with auth + admin protection.
- OpenAI content generation via `@yapper/ai-core` (falls back to mock when no API key).
- ContentKind output validation with per-kind structural checks.
- Admin auth middleware (`requireAuth`, `requireAdmin`).
- Admin API endpoints: `GET /api/admin/users`, `GET /api/admin/stats`, `PATCH /api/admin/lessons/:id/status`.
- Prisma seed script with languages, stages, vocabulary, lessons, media recommendations, and admin user.
- Docker Compose setup for local PostgreSQL + API.
- Expanded immersion controllers and routes.

#### Changed
- MediaRecommendation schema extended with `stageHintId`, `affiliateUrl` fields.
- `apps/api/package.json` updated with cookie-parser, bcryptjs v2, and tsx runtime dependencies.
- Prisma client types and migration files updated for new schema.

### Phase 2 — Auth, Progress, Content, UI
#### Added
- JWT auth: signup/login/me endpoints with bcrypt password hashing and auth middleware.
- Progress persistence: API routes for lesson completion and stage progression updates.
- Deeper content tracks: 70 lessons total (was 15) across all 5 languages — 3 immersion, 3 vocabulary, 3 story, and 2 literacy/sounds per language.
- Auth pages: `/auth/login` and `/auth/signup` with form validation.
- Tailwind CSS v4 in web, admin, and UI packages.
- shadcn-style components: Button, Card, Badge, Input, Progress, Dialog with variant management.
- Framer Motion for page transitions and micro-animations.

#### Changed
- Web and admin apps converted from custom CSS to Tailwind utility classes.
- Dashboard fetches user progress from API (falls back to localStorage for unauthenticated users).
- Lesson player saves progress to API on completion.
- Mobile responsive: nav collapses to column, grids become single column on small screens.

### Phase 1 — Learner Loop Foundation
#### Added
- Initial Yapper monorepo scaffold with pnpm workspaces.
- API, web, admin, shared, UI, AI, audio, and config package foundations.
- Baseline language/stage domain constants and Prisma schema.
- Explicit Vercel configs for web/admin monorepo deployments.
- Onboarding flow, dashboard, lesson player, seed lessons (ES, FR, EN).
- Media recommendations catalog with 12 items across MVP languages.
- API endpoints for Phase 1 lessons, recommendations, and catalog data.
