# Yapper — Build Phase 2

## 2026-05-11 Task: Auth + DB + Progress + Content + UI

### 1. Auth + DB
- [ ] Set up Neon DB connection string
- [ ] Run Prisma migrations
- [ ] Install bcryptjs + jsonwebtoken in API
- [ ] Add JWT signup/login/me endpoints + auth middleware
- [ ] Create signup/login pages in web app
- [ ] Protect progress endpoints with auth

### 2. Progress Persistence
- [ ] Create progress API routes (save lesson, get user progress, update stage)
- [ ] Wire lesson player to POST progress on completion
- [ ] Wire dashboard to GET user progress
- [ ] Remove localStorage fallback for placement

### 3. More Content (ES/FR/EN)
- [ ] Add 3+ immersion lessons per MVP language
- [ ] Add 3+ vocabulary lessons per MVP language
- [ ] Add 3+ story lessons per MVP language
- [ ] Add literacy/sounds stage content

### 4. UI Polish
- [ ] Install Tailwind CSS v4 in web + admin + UI package
- [ ] Install shadcn/ui components (Button, Card, Badge, Input, Form, Dialog, Progress)
- [ ] Install Framer Motion in web + admin
- [ ] Replace globals.css classes with Tailwind utilities + shadcn components
- [ ] Add page transitions and micro-animations
- [ ] Mobile responsive audit and fixes
