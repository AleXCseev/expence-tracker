# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Expense tracker monorepo (npm workspaces, git repository, dependencies installed). No tests or test runner are configured. The API has `/health`, JWT auth (`/auth/register`, `/auth/login`, `/auth/me`) categories CRUD and transactions (`/transactions` CRUD + `/transactions/summary`; `GET /transactions` is paginated: `page`/`limit` (default 10, max 100) → `{ items, total, page, limit }`); the web app has login and registration pages (the JWT is returned in the response body and kept in `localStorage`) and a main screen (`/`): sidebar menu, user menu, paginated (10 per page) filterable transactions list; `/categories` is a placeholder. Implementation plans live in `.claude/plans/` — keep their checklists up to date.

## Layout

- `apps/api` — NestJS 11 backend (`@expense-tracker/api`), Prisma ORM with PostgreSQL. Prisma schema lives in `apps/api/prisma/schema.prisma` (models: `User`, `Category`, `Transaction`); `PrismaService`/`PrismaModule` (global) in `apps/api/src/prisma/`. Feature modules go in `apps/api/src/modules/`.
- `apps/web` — Next.js 15 App Router frontend (`@expense-tracker/web`), Tailwind CSS v4 + shadcn/ui, sources under `src/` organized by Feature-Sliced Design (see below).
- `packages/shared` — `@expense-tracker/shared`: DTO types shared by both apps. It compiles to `dist/` (`main`/`types` point there), so it must be built (`npm run build -w packages/shared`) before the apps can resolve it; `apps/web` also lists it in `transpilePackages`.
- `tsconfig.base.json` is extended by every package; the root `eslint.config.mjs` (flat config, typescript-eslint + prettier) covers the whole repo.

## Frontend architecture (`apps/web`) — Feature-Sliced Design

Layers, from top to bottom; a layer may import **only from layers below it**, never sideways or upwards:

| Layer | Path | Purpose |
| --- | --- | --- |
| app | `src/app/` | Next.js routing, root layout, providers, `globals.css`. `page.tsx` files are thin re-exports from `views` (e.g. `export { LoginPage as default } from '@/views/login'`). Route groups: `(public)` (login, register, legal pages; floating language switcher) and `(dashboard)` (authenticated pages wrapped by `widgets/app-shell`, which holds the auth guard, sidebar and header). |
| views | `src/views/` | FSD "pages" layer. Named `views` because `src/pages` would conflict with the Next.js Pages Router. One slice per screen. |
| widgets | `src/widgets/` | Self-contained composite UI blocks that combine features/entities. |
| features | `src/features/` | User actions with business value (e.g. `auth-login`, `auth-register`, `transaction-filters`). |
| entities | `src/entities/` | Business entities (`session`, `category`, `transaction`). Hooks take the token as an argument — entities must not import each other. |
| shared | `src/shared/` | Reusable code with no business logic: `ui/` (shadcn components), `lib/` (`cn`), `api/` (`http` fetch wrapper, `ApiError`), `config/` (`env`). |

Rules:
- Slices (`features/<name>`, `entities/<name>`, `views/<name>`) are split into segments: `ui/`, `model/` (state, schemas, hooks), `api/`, `lib/`. `shared` has segments only, no slices.
- Each slice exposes a public API through `index.ts`; import slices only via that entry point (`@/features/auth-login`), never from their internals. Use the `@/*` alias for cross-slice imports and relative paths inside a slice.
- Client-only code (hooks, state, event handlers) needs `'use client'`; keep pages/views server components where possible.
- UI text is localized (ru, uk, en) via `src/shared/i18n`: `useI18n()` returns `t(key, params)`; the locale lives in `localStorage` (default `ru`). Add strings to `messages/ru.ts` first (it defines the `Messages` type), then `uk.ts` and `en.ts` — the compiler flags missing keys. Zod schemas carry message keys, not text; the UI translates them with `t(error.message as MessageKey)`. Legal pages have per-locale content components. `features/language-switcher` is a temporary fixed-position switcher mounted in `app/layout.tsx`.

shadcn/ui: configured in `apps/web/components.json` with aliases pointing at `shared` (`ui` → `@/shared/ui`, `utils` → `@/shared/lib/utils`). Add components with `npx shadcn@latest add <name>` from `apps/web` and verify they land in `src/shared/ui`. Theme tokens live in `src/app/globals.css`.

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

Copy `.env.example` to `.env` at the root **and** to `apps/api/.env` — Prisma reads `DATABASE_URL` from the api directory, while docker-compose reads `POSTGRES_*` from the root. The web app uses `NEXT_PUBLIC_API_URL` (Next.js reads env files from `apps/web`, not the root; it falls back to `http://localhost:4000`, so copy `.env.example` to `apps/web/.env` only if the API URL differs); the API port comes from `API_PORT` (default 4000) and CORS is enabled globally.


## Branching (GitHub Flow)

New features and fixes follow [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow):

- `main` is always stable and deployable; never commit feature work directly to it.
- Start every new feature/fix from an up-to-date `main` in a dedicated short-lived branch (`git switch main && git pull && git switch -c <type>/<short-name>`).
- Branch name: `<type>/<kebab-case-description>`, where `<type>` is a Conventional Commits type (`feat`, `fix`, `docs`, `refactor`, `chore`, …), e.g. `feat/main-screen-web`, `fix/transactions-summary`.
- One branch = one feature; keep it focused and commit in small logical steps following the commit conventions below.
- When ready, push the branch and open a pull request into `main`; merge only after review and a passing `npm run lint` / `npm run build`. Delete the branch after merging.
- Create branches, push and open PRs only when the user asks.

## Commit conventions

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<optional scope>): <description>`.

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- Scope is optional and names the area, e.g. `api`, `web`, `shared`, `prisma`, `transactions`: `feat(api): add transactions module`.
- Description: English, imperative mood, lowercase first letter, no trailing period, header up to ~72 characters. Add a body after a blank line when the *why* is not obvious.
- Breaking changes: `!` after the type/scope (`feat(api)!: ...`) and/or a `BREAKING CHANGE:` footer.
- One logical change per commit; commit only when the user asks.
