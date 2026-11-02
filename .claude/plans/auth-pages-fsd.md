# План: страницы логина и регистрации (shadcn/ui + FSD)

## Context
В `apps/web` пока только заглушка (`layout.tsx`, `page.tsx`), нет Tailwind/PostCSS/глобальных стилей. API (`apps/api`) уже имеет `POST /auth/register`, `POST /auth/login`, `GET /auth/me`; JWT отдаётся в теле ответа (`{ accessToken, user }`), без cookies, CORS открыт. Нужно сделать UI логина и регистрации на shadcn/ui и закрепить архитектуру Feature-Sliced Design в `CLAUDE.md`.

Факты API:
- register: `name` 1–100, `email`, `password` 8–72 → 201 `{accessToken,user}`; 409 `Email already registered`
- login: `email`, `password` (≤72) → 200; 401 `Invalid email or password`
- ошибки валидации: 400 `{message: string[]}`; остальные `{message: string}`
- типы `RegisterRequest`, `LoginRequest`, `AuthResponse`, `UserDto` — в `@expense-tracker/shared` (в `UserDto` нет `createdAt`, не нужен)

## Архитектура FSD (Next.js App Router)
Next требует `src/app` для роутинга, поэтому FSD-слой `app` совмещаем с ним, а слой `pages` FSD не используем в `src/pages` (конфликт с Pages Router) — вместо него `src/views`. Страницы в `src/app/**/page.tsx` — тонкие реэкспорты из `views`.

```
apps/web/src/
  app/                      # Next routing + providers + globals.css
    layout.tsx, page.tsx (redirect → /login)
    login/page.tsx          # export { LoginPage as default } from '@/views/login'
    register/page.tsx
  views/                    # FSD "pages"
    login/ui/login-page.tsx, index.ts
    register/ui/register-page.tsx, index.ts
  widgets/                  # (пока пусто; при необходимости auth-card)
  features/
    auth-login/   { ui/login-form.tsx, model/schema.ts, model/use-login.ts, index.ts }
    auth-register/{ ui/register-form.tsx, model/schema.ts, model/use-register.ts, index.ts }
  entities/
    session/      { model/session-store.ts (токен+user, localStorage), api/auth-api.ts (register/login/me), index.ts }
  shared/
    ui/           # shadcn-компоненты (button, input, label, card, form, sonner/alert)
    lib/utils.ts  # cn()
    api/http.ts   # fetch-обёртка: базовый URL из NEXT_PUBLIC_API_URL, Bearer, ApiError {status,messages}
    config/env.ts
```
Правила импортов: слой импортирует только нижележащие (app > views > widgets > features > entities > shared); публичный API через `index.ts`. Алиас `@/*` уже есть.

## Шаги
1. **Tailwind v4 + shadcn**: `npm i -D tailwindcss @tailwindcss/postcss postcss` в `apps/web`; `postcss.config.mjs`; `src/app/globals.css` (`@import "tailwindcss"` + shadcn-токены); `npx shadcn@latest init` с `components.json`, алиасы переопределить под FSD: `components → @/shared/ui`, `ui → @/shared/ui`, `utils → @/shared/lib/utils`, `lib → @/shared/lib`. Добавить компоненты: `button input label card form sonner` (deps: `class-variance-authority clsx tailwind-merge lucide-react react-hook-form @hookform/resolvers zod`).
2. **shared/api/http.ts** + **entities/session**: `login()`/`register()` типизированы через `LoginRequest`/`RegisterRequest`/`AuthResponse` из `@expense-tracker/shared`; стор сессии (простой React context/hook на `localStorage`, без доп. библиотек), провайдер в `app/layout.tsx`.
3. **features/auth-login, auth-register**: формы на react-hook-form + zod, схемы зеркалят правила API (name 1–100, password 8–72, email). Ошибки: 409/401 показывать в форме, 400 — маппить сообщения. Успех → сохранить сессию, `router.push('/')`.
4. **views + app routes**: центрированная `Card` с формой и ссылкой на соседнюю страницу; `/` редиректит на `/login` (или на заглушку, если есть сессия). Русские тексты (`lang="ru"`).
5. **Конфиги**: `NEXT_PUBLIC_API_URL` уже в `.env.example`; создать `apps/web/.env.local` не нужно (читается с корня — проверить, иначе добавить в CLAUDE.md инструкцию копировать в `apps/web/.env`). В eslint ничего не меняем (при желании позже — `eslint-plugin-boundaries`).
6. **CLAUDE.md**: обновить «Project state» (зависимости установлены, репозиторий git, есть auth/categories), раздел Layout для `apps/web` — описание FSD: слои, структура сегментов (`ui/model/api/lib`), правило импортов, `views` вместо `pages`, shadcn в `shared/ui` и команда добавления компонентов (`npx shadcn@latest add <name>` в `apps/web`), Tailwind v4.

## Чеклист (отмечать по мере реализации)
Копия этого плана хранится в репозитории: `.claude/plans/auth-pages-fsd.md` (первый пункт после выхода из plan mode).

- [x] 0. Скопировать план в `.claude/plans/auth-pages-fsd.md`
- [x] 1. Tailwind v4 + PostCSS + `globals.css`
- [x] 1.1 `components.json` с FSD-алиасами и компоненты button/input/label/card в `src/shared/ui` (написаны вручную в стиле shadcn; `form` и `sonner` не понадобились — формы на react-hook-form + inline-ошибки)
- [x] 2. `shared/api/http.ts`, `shared/config/env.ts`, `shared/lib/utils.ts`
- [x] 2.1 `entities/session` (api + стор + провайдер в `app/layout.tsx`)
- [x] 3. `features/auth-login` (схема, хук, форма)
- [x] 3.1 `features/auth-register` (схема, хук, форма)
- [x] 4. `views/login`, `views/register` + роуты `app/login`, `app/register`, редирект с `/`
- [x] 5. Проверка `NEXT_PUBLIC_API_URL` / env
- [x] 6. Обновить `CLAUDE.md` (актуальное состояние + FSD + shadcn)
- [ ] 7. Верификация: lint и build пройдены; ручной прогон регистрации/логина с БД не выполнялся

## Допущения (дайте знать, если не так)
- Токен хранится в `localStorage` (API не выставляет cookie). Защита маршрутов middleware не делается.
- Tailwind v4 (актуальный дефолт shadcn для Next 15 / React 19).
- Только логин и регистрация; страницы расходов/дашборд вне объёма.

## Верификация
- `npm run build -w packages/shared`, затем `npm run lint` и `npm run build -w apps/web` без ошибок.
- `npm run db:up`, `npm run dev:api`, `npm run dev:web`; в браузере: регистрация (валидация, 409 при повторе) → редирект; логин с неверным паролем → сообщение 401; успешный логин → токен в localStorage, редирект.
- Проверить, что shadcn-компоненты появились в `src/shared/ui`, а импорты не нарушают направление слоёв.
