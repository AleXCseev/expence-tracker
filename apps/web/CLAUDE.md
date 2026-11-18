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
- Widgets must not import other widgets: compose them in the `app` layer and pass them in as slots (see `app/(dashboard)/layout.tsx` → `AppShell` `sidebar`/`header`).
- HTTP errors: `shared/api/http` calls the handler set by `SessionProvider` on any `401` for a request with a token (signs the user out); forms convert errors with `toServerError` from `shared/api/server-error` (status overrides via the second argument).
- Client-only code (hooks, state, event handlers) needs `'use client'`; keep pages/views server components where possible.
- UI text is localized (ru, uk, en) via `src/shared/i18n`: `useI18n()` returns `t(key, params)`; the locale lives in `localStorage` (default `ru`). Add strings to `messages/ru.ts` first (it defines the `Messages` type), then `uk.ts` and `en.ts` — the compiler flags missing keys. Zod schemas carry message keys, not text; the UI translates them with `t(error.message as MessageKey)`. Legal pages have per-locale content components. `features/language-switcher` is a temporary fixed-position switcher mounted in `app/layout.tsx`.

Data and API:
- The web app talks to the API only through `shared/api/http` (`http<T>(path, { method, body, token, query })`): it adds `Authorization: Bearer`, serializes JSON, drops empty query values, has a 15 s timeout and throws `ApiError(status, messages)` (`status 0` = network error). Base URL is `env.apiUrl` (`NEXT_PUBLIC_API_URL`, default `http://localhost:4000`).
- Each entity keeps its endpoints in `entities/<name>/api/<name>-api.ts` and exposes data hooks from `model/` (`useTransactions`, …); there is no data-fetching library — hooks use `useState`/`useEffect`. The token is passed to hooks and API functions as an argument (get it from `useSession()` in `entities/session`).
- Request/response types come from `@expense-tracker/shared` (rebuild it with `npm run build -w packages/shared` after changing it). Money amounts arrive as strings with 2 decimals; format them with helpers from `shared/lib/format`, never with float arithmetic.
- The API is paginated: `GET /transactions` returns `{ items, total, page, limit }`; the list shows 10 per page. Filter state lives in `features/transaction-filters` (not in the entity); `widgets/transactions-list` combines the filters and the entity hook.
- The session (`entities/session`): the JWT is stored in `localStorage`; `SessionProvider` restores it (validating the stored format, and exposing a `ready` flag until hydration finishes) and signs the user out on `401`; `authApi.me(token)` wraps `/auth/me`. Authenticated pages are guarded by `widgets/app-shell`.

Forms and validation:
- Forms use `react-hook-form` + `zod` (`@hookform/resolvers`). Schemas live in the slice's `model/` and hold message **keys**; server errors are shown via `toServerError`.
- Every user-visible string goes through `t(...)` — no hardcoded text in components, including `aria-label`s and placeholders.

Styling:
- Tailwind CSS v4 (config in `globals.css`, no `tailwind.config`), compose classes with `cn()` from `shared/lib/utils`, use theme tokens (`bg-background`, `text-muted-foreground`, …) rather than raw colors. Icons come from `lucide-react`.
- Do not edit generated shadcn components in `shared/ui` for feature-specific needs; wrap them in the feature/widget instead.

Adding a feature/screen (checklist):
1. Entity (if new): `api/` + `model/` + `index.ts`.
2. Feature in `features/<name>` (`ui/`, `model/`, `index.ts`) for the user action.
3. Widget/view in `widgets/` or `views/<name>`; mount the route as a thin re-export in `app/`.
4. Add i18n keys to `ru.ts`, then `uk.ts` and `en.ts`.
5. Run `npm run lint` and `npm run build` from the repo root (no tests are configured), and check the page in the browser (`npm run dev:web`, API on `:4000`).

shadcn/ui: configured in `apps/web/components.json` with aliases pointing at `shared` (`ui` → `@/shared/ui`, `utils` → `@/shared/lib/utils`). Add components with `npx shadcn@latest add <name>` from `apps/web` and verify they land in `src/shared/ui`. Theme tokens live in `src/app/globals.css`.