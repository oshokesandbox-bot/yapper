# Changelog

## [Unreleased]
### Added
- Initial Yapper monorepo scaffold.
- API, web, admin, shared, UI, AI, audio, and config package foundations.
- Baseline language/stage domain constants and Prisma schema.
- Explicit Vercel configs for web/admin monorepo deployments.
- Phase 1 learner loop: onboarding, dashboard, lesson player, seed lessons, and media recommendations.
- API endpoints for Phase 1 lessons, recommendations, and catalog data.

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
