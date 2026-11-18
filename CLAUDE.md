
## Project state

Expense tracker monorepo (npm workspaces, git repository, dependencies installed). No tests or test runner are configured. The API has `/health`, JWT auth (`/auth/register`, `/auth/login`, `/auth/me`) categories CRUD and transactions (`/transactions` CRUD + `/transactions/summary`; `GET /transactions` is paginated: `page`/`limit` (default 10, max 100) → `{ items, total, page, limit }`); the web app has login and registration pages (the JWT is returned in the response body and kept in `localStorage`) and a main screen (`/`): sidebar menu, user menu, paginated (10 per page) filterable transactions list; `/categories` is a placeholder. Implementation plans live in `.claude/plans/` — keep their checklists up to date.

## Layout

- `apps/api` — NestJS 11 backend (`@expense-tracker/api`), Prisma ORM with PostgreSQL. Prisma schema lives in `apps/api/prisma/schema.prisma` (models: `User`, `Category`, `Transaction`); `PrismaService`/`PrismaModule` (global) in `apps/api/src/prisma/`. Feature modules go in `apps/api/src/modules/`.
- `apps/web` — Next.js 15 App Router frontend (`@expense-tracker/web`), Tailwind CSS v4 + shadcn/ui, sources under `src/` organized by Feature-Sliced Design (see `apps/web/CLAUDE.md`; backend conventions are in `apps/api/CLAUDE.md`).
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

Copy `.env.example` to `.env` at the root **and** to `apps/api/.env` — Prisma reads `DATABASE_URL` from the api directory, while docker-compose reads `POSTGRES_*` from the root. The web app uses `NEXT_PUBLIC_API_URL` (Next.js reads env files from `apps/web`, not the root; it falls back to `http://localhost:4000`, so copy `.env.example` to `apps/web/.env` only if the API URL differs); the API port comes from `API_PORT` (default 4000); CORS is limited to the origins in `CORS_ORIGIN` (comma-separated, default `http://localhost:3000`), `helmet` sets security headers and unknown request fields are rejected (`forbidNonWhitelisted`). In production `JWT_SECRET` must be at least 32 characters, otherwise the API refuses to start.


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
