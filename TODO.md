# Yapper — Build Phase 2

## 2026-05-11 Task: Auth + DB + Progress + Content + UI ✅ DONE

### 1. Auth + DB ✅
- [x] Set up Neon DB connection string
- [x] Run Prisma migrations (migration SQL generated + passwordHash field added)
- [x] Install bcryptjs + jsonwebtoken in API
- [x] Add JWT signup/login/me endpoints + auth middleware
- [x] Create signup/login pages in web app
- [x] Protect progress endpoints with auth

### 2. Progress Persistence ✅
- [x] Create progress API routes (save lesson, get user progress, update stage)
- [x] Wire lesson player to POST progress on completion
- [x] Wire dashboard to GET user progress
- [x] Remove localStorage fallback for placement

### 3. More Content (ES/FR/EN) ✅
- [x] Add 3+ immersion lessons per MVP language
- [x] Add 3+ vocabulary lessons per MVP language
- [x] Add 3+ story lessons per MVP language
- [x] Add literacy/sounds stage content

### 4. UI Polish ✅
- [x] Install Tailwind CSS v4 in web + admin + UI package
- [x] Build shadcn/ui-style components (Button, Card, Badge, Input, Progress, Dialog)
- [x] Install Framer Motion in web + admin
- [x] Replace globals.css classes with Tailwind utilities + shadcn components
- [x] Add page transitions and micro-animations
- [x] Mobile responsive audit and fixes
