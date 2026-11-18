# План: главный экран трекера расходов (web) + пагинация транзакций (api)

## Context

Сейчас `/` — заглушка `HomePage` (приветствие + кнопка выхода, guard inline). Нужен главный экран: боковое меню (Транзакции / Категории), профиль пользователя, список транзакций с пагинацией по 10 и фильтрами. Работа ведётся в ветке `feat/main-screen-web` (GitHub Flow, см. CLAUDE.md).

Факты из кода:
- `GET /transactions` не пагинируется: возвращает `TransactionView[]`, фильтры `dateFrom/dateTo/type/categoryId` уже есть; `TransactionDto` содержит только `categoryId` (без имени) → имена берём из `GET /categories`.
- Фронт: `entities/session` (`useSession`: `user, token, ready, signOut`), `shared/api/http.ts` (токен передаётся явно, нет query-helper, нет глобальной обработки 401), `shared/i18n` (ru → uk/en, типизированные ключи), shadcn-компоненты: только `button, card, checkbox, input, label`.
- `LanguageSwitcher` фиксирован `fixed top-4 right-4` в `app/layout.tsx` — перекроет шапку.

Решения пользователя: серверная пагинация; пункты меню — маршруты-заглушки; доп. блок — фильтры списка (тип, категория, период). Сводка за месяц — вне scope.

## Шаг 0. Документ плана
Скопировать этот план в `.claude/plans/main-screen.md` (формат как `auth-pages-fsd.md`: Context / Архитектура FSD / Шаги / Чеклист), вести чеклист.

## Шаг 1. API: пагинация `GET /transactions`
Образец структуры — модуль `apps/api/src/modules/transactions`.
- `ListTransactionsQueryDto`: добавить `page` (int ≥1, default 1) и `limit` (int 1..100, default 10) через class-validator + `@Type(() => Number)`; проверить в `main.ts`, что `ValidationPipe` с `transform: true`.
- `contract/get-user-transactions.query.ts`, handler, `transactions.service.ts`: пробросить `page/limit`.
- `transactions.repository.ts` `findManyByUser`: `skip=(page-1)*limit`, `take=limit` + `count` с теми же фильтрами в одном `prisma.$transaction`; порядок прежний (`date desc, createdAt desc`).
- Ответ: `{ items: TransactionView[], total, page, limit }`.
- `packages/shared`: добавить `PaginatedResponse<T>` и `ListTransactionsQuery`; `GET /transactions` вернуть `PaginatedResponse<TransactionDto>`. Пересобрать shared.

## Шаг 2. Web: инфраструктура
- `shared/api/http.ts`: добавить опцию `query?: Record<string, string|number|undefined>` (сборка `URLSearchParams`, пропуск пустых). Без новых зависимостей.
- `shared/ui`: руками в shadcn-стиле (или `npx shadcn@latest add` из `apps/web` с проверкой, что файлы лягут в `src/shared/ui`) — `select`, `avatar`, `skeleton`; пагинация — компонент `pagination` (Prev/Next + «стр. X из Y») на базе `Button`.
- `shared/lib`: форматтеры суммы и даты по локали (`Intl.NumberFormat/DateTimeFormat`, локаль из `useI18n`).
- `LanguageSwitcher`: перенести из fixed-позиции в шапку дашборда (оставить fixed только на auth/legal страницах — либо смонтировать внутри layout'ов); обновить TODO.

## Шаг 3. Web: FSD-слайсы (импорты только вниз)
- `entities/category`: `api/category-api.ts` (`list(token)`), `model/use-categories.ts` (загрузка + map `id → {name,color}`), `index.ts`.
- `entities/transaction`: `api/transaction-api.ts` (`list(token, query)` → `PaginatedResponse`), `model/use-transactions.ts` (page, filters, loading/error, смена фильтра сбрасывает page=1), `ui/transaction-row.tsx` (категория с цветом, описание, дата, сумма со знаком/цветом по типу), `index.ts`.
- `features/transaction-filters`: форма фильтров (тип, категория, dateFrom/dateTo) — `ui/`, `model/`.
- `widgets/app-sidebar`: меню (Транзакции → `/transactions`, Категории → `/categories`, подсветка активного пункта через `usePathname`), на мобильных — сворачиваемое.
- `widgets/user-menu`: аватар с инициалами, имя/email из `useSession`, кнопка выхода (+ `LanguageSwitcher`).
- `widgets/transactions-list`: фильтры + список + пагинация + состояния loading (skeleton) / empty / error с повтором; 401 → `signOut()` и редирект на `/login`.
- `views/home`: композиция шапки, сайдбара и `transactions-list`; `views/transactions`, `views/categories` — страницы-заглушки с заголовком и «скоро».
- `app/(dashboard)/layout.tsx` (route group): общий guard (`ready && !user → router.replace('/login')`) + каркас sidebar/header; перенести `app/page.tsx` и новые `app/(dashboard)/transactions/page.tsx`, `categories/page.tsx` (тонкие re-export из `views`). Inline-guard из `HomePage` убрать.

## Шаг 4. i18n
Добавить ключи в `messages/ru.ts` (затем `uk.ts`, `en.ts`): навигация, профиль/выход, заголовки, фильтры, пагинация («Стр. {page} из {pages}», «Назад/Далее»), empty/error/retry, типы INCOME/EXPENSE, заглушки. Удалить неиспользуемые `home.greeting`, если не нужны.

## Шаг 5. Документация
Обновить CLAUDE.md: раздел «Project state» (дашборд, пагинация `/transactions`), FSD-структура (новые слайсы, route group `(dashboard)`), упоминание пагинации в API.

## Критичные файлы
`apps/api/src/modules/transactions/{dto,contract,handlers,transactions.service.ts,transactions.repository.ts}`, `packages/shared/src/index.ts`, `apps/web/src/shared/api/http.ts`, `apps/web/src/app/layout.tsx`, `apps/web/src/views/home/ui/home-page.tsx`, `apps/web/src/entities/session/`, `apps/web/src/shared/i18n/messages/*`.

## Чеклист
(копия плана с чеклистом сохраняется в `.claude/plans/main-screen.md`; отмечать выполненное по ходу работы)

- [x] Создана feature-ветка `feat/main-screen-web` (GitHub Flow)
- [x] Правила ветвления (GitHub Flow) зафиксированы в CLAUDE.md
- [x] Исследование кода (web, api, shared), согласованы решения с пользователем
- [x] 0. Скопировать план в `.claude/plans/main-screen.md`
- [x] 1. API: пагинация `GET /transactions`
  - [x] 1.1 `page`/`limit` в `ListTransactionsQueryDto` (+ проверка `ValidationPipe transform`)
  - [x] 1.2 query/handler/service/repository: `skip/take` + `count` в `$transaction`
  - [x] 1.3 `PaginatedResponse<T>` и `ListTransactionsQuery` в `packages/shared`, пересборка shared
- [x] 2. Web: инфраструктура
  - [x] 2.1 `query` в `shared/api/http.ts`
  - [x] 2.2 shadcn-компоненты: select, avatar, skeleton, pagination
  - [x] 2.3 форматтеры суммы/даты по локали
  - [x] 2.4 `LanguageSwitcher` перенесён в шапку
- [x] 3. Web: слайсы FSD
  - [x] 3.1 `entities/category`
  - [x] 3.2 `entities/transaction`
  - [x] 3.3 `features/transaction-filters`
  - [x] 3.4 `widgets/app-sidebar`
  - [x] 3.5 `widgets/user-menu`
  - [x] 3.6 `widgets/transactions-list` (loading / empty / error, 401 → выход)
  - [x] 3.7 `views/home`, `views/categories` (заглушка); пункт «Транзакции» ведёт на `/` (отдельной заглушки `/transactions` нет — список уже на главном экране)
  - [x] 3.8 route group `app/(dashboard)` с общим guard и layout
- [x] 4. i18n: ключи в ru → uk → en
- [x] 5. Обновить CLAUDE.md (состояние проекта, FSD-структура, пагинация)
- [x] 7. Создание транзакций: `features/transaction-create` (диалог + форма), `shared/ui/dialog`, `transactionApi.create`, i18n
- [x] 6.1 `npm run lint`, `npm run build` — без ошибок
- [ ] 6.2 Ручной прогон в браузере и проверка API с реальными данными (см. Verification)

## Коммиты (Conventional Commits, по запросу пользователя)
`feat(api): paginate transactions list`, `feat(shared): add paginated response type`, `feat(web): add dashboard layout with sidebar and user menu`, `feat(web): add paginated transactions list with filters`, `docs: update CLAUDE.md for dashboard`.

## Verification
1. `npm run build -w packages/shared`, затем `npm run lint` и `npm run build` (shared → api → web) — без ошибок, i18n-типы сходятся.
2. `npm run db:up`, `npm run dev:api`, `npm run dev:web`. Через curl/браузер: `GET /transactions?page=1&limit=10` → `{items,total,page,limit}`, `page=2` отдаёт следующие; невалидные `page/limit` → 400.
3. В UI: логин → `/`; без токена редирект на `/login`; профиль показывает имя/email, выход работает; меню переключает `/transactions`/`/categories` (заглушки) с подсветкой; при >10 транзакций пагинация работает, фильтры сбрасывают страницу на 1; пустой список, ошибка API (остановить api) и skeleton отображаются; переключение ru/uk/en меняет все новые строки; вёрстка на мобильной ширине.
