# TODO

## 2026-05-10 Task: Yapper Phase 0 scaffold
- [x] Create monorepo structure
- [x] Add shared TypeScript/Turbo/pnpm config
- [x] Add shared language and stage constants
- [x] Add API foundation with health, languages, and stages routes
- [x] Add Prisma schema baseline
- [x] Add learner web app foundation
- [x] Add admin app foundation
- [x] Install dependencies and run full typecheck
- [ ] Add auth implementation
- [ ] Add initial lesson/player data model implementation

## 2026-05-11 Task: Fix Vercel monorepo deploy config
- [x] Add explicit `apps/admin/vercel.json`
- [x] Add explicit `apps/web/vercel.json`
- [x] Document Vercel project settings
- [x] Verify admin build creates `apps/admin/.next`
- [x] Run web build and full typecheck
