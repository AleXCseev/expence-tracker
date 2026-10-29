# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Expense tracker monorepo (npm workspaces). Currently only a scaffold: dependencies are declared in each `package.json` but **not installed**, no tests or test runner are configured, and the repo is not a git repository yet. Business logic does not exist beyond a `/health` endpoint and a placeholder page.

## Layout

- `apps/api` — NestJS 11 backend (`@expense-tracker/api`), Prisma ORM with PostgreSQL. Prisma schema lives in `apps/api/prisma/schema.prisma` (models: `User`, `Category`, `Expense`); `PrismaService`/`PrismaModule` (global) in `apps/api/src/prisma/`. Feature modules go in `apps/api/src/modules/`.
- `apps/web` — Next.js 15 App Router frontend (`@expense-tracker/web`), sources under `src/`.
- `packages/shared` — `@expense-tracker/shared`: DTO types shared by both apps. It compiles to `dist/` (`main`/`types` point there), so it must be built (`npm run build -w packages/shared`) before the apps can resolve it; `apps/web` also lists it in `transpilePackages`.
- `tsconfig.base.json` is extended by every package; the root `eslint.config.mjs` (flat config, typescript-eslint + prettier) covers the whole repo.

## Commands (run from repo root)

```bash
npm install
npm run db:up         # docker compose up -d (Postgres 16)
npm run db:migrate    # prisma migrate dev (in apps/api)
npm run db:generate   # prisma generate
npm run dev:api       # nest start --watch, port 4000, GET /health
npm run dev:web       # next dev, port 3000
npm run build         # builds shared -> api -> web, in that order
npm run lint
npm run format
```

Single-workspace commands: `npm run <script> -w apps/api` (or `apps/web`, `packages/shared`).

## Environment

Copy `.env.example` to `.env` at the root **and** to `apps/api/.env` — Prisma reads `DATABASE_URL` from the api directory, while docker-compose reads `POSTGRES_*` from the root. The web app uses `NEXT_PUBLIC_API_URL`; the API port comes from `API_PORT` (default 4000) and CORS is enabled globally.
