## Backend architecture (`apps/api`) — NestJS 11 + CQRS + Prisma

Stack: NestJS 11, `@nestjs/cqrs`, Prisma 6 (PostgreSQL), `@nestjs/jwt`, `@nestjs/throttler`, `class-validator`/`class-transformer`, `bcryptjs`, `helmet`.

### Module structure

Feature modules live in `src/modules/<name>/` (reference implementation: `categories`, then `transactions`):

```
<name>/
  contract/      public API of the module: commands, queries, views (DTO-like result types); re-exported via contract/index.ts
  commands/      <verb>-<noun>.handler.ts  (@CommandHandler, thin: delegates to the service)
  queries/       <verb>-<noun>.handler.ts  (@QueryHandler, thin: delegates to the service)
  dto/           HTTP request DTOs (class-validator); exist only for modules with a controller
  <name>.controller.ts   HTTP layer
  <name>.service.ts      business logic, ownership checks, mapping entity -> View (`toView`)
  <name>.repository.ts   the only place that talks to PrismaService
  <name>.module.ts
```

Rules:
- **Controllers contain no business logic**: they validate input (DTO), take the user from `@CurrentUser()` and dispatch a `Command`/`Query` through `CommandBus`/`QueryBus`. Cheap request-shape checks that DTOs cannot express (e.g. `dateFrom <= dateTo`, "at least one field in PATCH") may stay in the controller.
- **Handlers are thin**: `execute()` only calls a service method. Logic lives in the service, DB access in the repository.
- **Modules never import each other's services/repositories.** Cross-module calls go through the bus and only with classes from the other module's `contract/` (e.g. `transactions` verifies category ownership with `GetCategoryQuery` from `../categories/contract`). Import contracts via `contract/index.ts`, not from internals.
- Commands/queries are plain classes with `public readonly` constructor fields; the first field is `userId` for user-scoped operations.
- Services return **Views**, never Prisma entities (no `passwordHash` leaks; `Decimal` → string via `toFixed(2)`; map in `toView`). User data goes out as `SafeUser`.
- Register every handler, service and repository in the module's `providers`; `CqrsModule.forRoot()` and `PrismaModule` are global (`app.module.ts`), so don't re-import them.
- Modules with guarded controllers import `AuthModule` (it exports `JwtAuthGuard` and `JwtModule`). `UsersModule` has no controller — it is reached only via the bus (`CreateUserCommand`, `ValidateCredentialsQuery`, …) from `auth`.

### Adding a new feature

Follow `.claude/templates/feature.md` and mirror `modules/categories`: Prisma model + migration → `contract/` → repository → service → handlers → DTOs → controller → module → add to `AppModule.imports`. After implementing, run `npm run build` (and `npm run lint`). Add no dependencies unless the task says so.

### Security and data ownership

- Every user-scoped controller uses `@UseGuards(JwtAuthGuard)` (`Authorization: Bearer <jwt>`; payload `{ sub, email }` → `request.user`).
- **Every query filters by `userId`** (`findByIdForUser(id, userId)`, `update(id, userId, …)`, `delete(id, userId)`). Someone else's resource must look like a missing one: throw `NotFoundException`, not `ForbiddenException`.
- Emails are trimmed and lower-cased; passwords are hashed with bcrypt (cost 10). `validateCredentials` compares against a dummy hash for unknown users to avoid timing leaks — keep that behaviour.
- Global throttle is 100 req/min; `/auth/register` and `/auth/login` are limited to 5/min per IP via `@Throttle`.
- Global `ValidationPipe`: `whitelist`, `forbidNonWhitelisted`, `transform` — a DTO without decorators on a field will reject that field, so every accepted field needs a `class-validator` decorator. Query params arrive as strings; use `@Type(() => Number | Date)`.

### Error handling

Throw Nest HTTP exceptions from services: `NotFoundException` (missing/foreign resource), `ConflictException` (unique violation `P2002`, e.g. duplicate email or category name; FK violation `P2003`, e.g. deleting a category that has transactions), `BadRequestException`. Map Prisma error codes in the service (`PrismaClientKnownRequestError`), not in the controller. Statuses: `POST` create → 201, `POST /auth/login` → 200, `DELETE` → 204.

### Data model (`prisma/schema.prisma`)

- `User` (`cuid`, unique `email`, `passwordHash`, `lastLoginAt`), `Category` (`cuid`, `color`, `icon`, `@@unique([userId, name])`), `Transaction` (`uuid`, `amount Decimal(12,2)`, `type INCOME|EXPENSE`, optional `description`, `date`, `@@index([userId, date])`).
- `User` deletion cascades to categories and transactions; `Transaction.category` has **no cascade** — a category with transactions cannot be deleted (409).
- Money is `Decimal` in the DB and a **string with 2 decimals** in the API; sum with `Prisma.Decimal`, never JS floats. Month boundaries for summaries are computed in UTC.
- Schema changes: edit `schema.prisma` → `npm run db:migrate` (prompts for a migration name; commit the generated folder in `prisma/migrations/`) → `npm run db:generate`. Never edit an applied migration.

### Endpoints

| Route | Notes |
| --- | --- |
| `GET /health` | `HealthModule`, public |
| `POST /auth/register`, `POST /auth/login` | return `{ accessToken, user }` (`AuthResult`); throttled |
| `GET /auth/me` | current `SafeUser` |
| `/categories` | CRUD, per user |
| `/transactions` | CRUD; `GET` filters: `dateFrom`, `dateTo`, `type`, `categoryId`, pagination `page` (≥1, default 1) / `limit` (1–100, default 10) → `{ items, total, page, limit }` |
| `GET /transactions/summary?month=&year=` | income / expense / balance + totals by category. Declared **before** `GET /transactions/:id` so `summary` is not parsed as an id — keep static routes above parameterized ones |
| `PATCH /transactions/:id` | partial update; empty body → 400; `description: null` clears it |

### Configuration

- `ConfigModule` is global; env is read from `apps/api/.env`, falling back to the root `.env`. `config/validate-env.ts` fails fast at startup if `DATABASE_URL` or `JWT_SECRET` is missing or `API_PORT` is invalid — add new required variables to its `REQUIRED` list and to `.env.example`.
- `JWT_SECRET` strength is checked in `auth/jwt-secret.ts` (production: < 32 chars or `change-me` → refuses to start; otherwise a warning). `JWT_EXPIRES_IN` defaults to `1h`.
- `main.ts`: `helmet`, global `ValidationPipe`, CORS from `CORS_ORIGIN` (comma-separated), shutdown hooks, port `API_PORT` (default 4000).

### Shared types and commands

- DTO types shared with the web app go in `packages/shared`; rebuild it (`npm run build -w packages/shared`) before building the API.
- From the repo root: `npm run dev:api`, `npm run build -w apps/api`, `npm run db:up`, `npm run db:migrate`, `npm run db:generate`. No test runner is configured.
- Code comments in the existing API sources are written in Russian; keep new comments short and explain the *why*.
