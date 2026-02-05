# Blacklist Revenue Lab

A ruthless, fast, black/red revenue pipeline tracker. Capture ideas, score them, and ship the ones that matter.

## ✨ What it does

- ✅ Opportunity tracking with value, probability, status, next action
- ✅ Templates/playbooks to create opportunities in seconds
- ✅ Search + filters + saved views
- ✅ Favorites + insights dashboard
- ✅ CSV/PDF exports
- ✅ Onboarding flow + system theme toggle

## 🧱 Stack

- **Next.js 16 (App Router)**
- **NextAuth** (credentials)
- **Prisma + SQLite**
- **Tailwind v4 + shadcn/ui**
- **Playwright** (e2e)

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## 🗄️ Database

This repo uses **SQLite** via Prisma.

```bash
npx prisma db push
npx prisma generate
```

## 🔐 Environment variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

## ✅ Tests

```bash
npm run lint
npm run build
npm run e2e
```

E2E uses Playwright and spins up the app automatically.

## 📂 Key routes

- `/` — Landing
- `/auth/register` / `/auth/login`
- `/app` — Dashboard
- `/app/onboarding`
- `/app/opportunities`
- `/app/templates`
- `/app/insights`

## 🧪 E2E coverage (split spec files)

- `tests/landing.spec.ts`
- `tests/onboarding-dashboard.spec.ts`
- `tests/templates-opportunities.spec.ts`
- `tests/insights-theme.spec.ts`
- `tests/exports.spec.ts`

## 🧭 Roadmap (short-term)

- 🔔 Notifications + digest
- 💬 Feedback + support page
- 🧪 Changelog / updates
- 🔐 Profile + preferences

---

Built for speed, not excuses.
