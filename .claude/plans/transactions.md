# План: модуль транзакций (apps/api)

## Context
Нужен центральный модуль учёта доходов и расходов. Есть JWT-авторизация и CRUD категорий (CQRS: controller → Command/QueryBus → handler → service → repository → Prisma, см. `apps/api/src/modules/categories`). В схеме лежит неиспользуемая заготовка `Expense` — по решению пользователя заменяем её на `Transaction` (с типом INCOME/EXPENSE). Для `id` — `uuid()`, как в задаче.

Опечатки в ТЗ исправляю: `GET /transactions` (не `tarnsactions`), `GET /transactions/summary`, `dateFrom`, `categoryId`, миграция `add-transactions`. Маршрут `summary` объявляю **до** `:id`.

## 1. Prisma (`apps/api/prisma/schema.prisma`)
- `enum TransactionType { INCOME EXPENSE }`
- `model Transaction`: `id String @id @default(uuid())`, `amount Decimal @db.Decimal(12, 2)`, `type TransactionType`, `description String?`, `date DateTime`, `categoryId`, `userId`, `category Category @relation(...)` (Restrict — удаление категории с транзакциями → 409), `user User @relation(... onDelete: Cascade)`, `createdAt @default(now())`, `updatedAt @updatedAt`, `@@index([userId, date])`.
- Удалить `model Expense`; в `User` и `Category` заменить `expenses Expense[]` на `transactions Transaction[]`.
- Миграция: `npm run db:migrate -- --name add-transactions` (дропнет таблицу `Expense`; она не используется, данных нет).

## 2. Модуль `apps/api/src/modules/transactions/`
Структура — копия categories:
- `contract/`: `transaction-view.ts` (`id, amount (string), type, description, date, categoryId, createdAt, updatedAt`), `transaction-summary-view.ts`, команды `CreateTransactionCommand`, `UpdateTransactionCommand`, `DeleteTransactionCommand`, запросы `GetUserTransactionsQuery(userId, filters)`, `GetTransactionQuery(userId, id)`, `GetTransactionsSummaryQuery(userId, month, year)`, `index.ts`.
- `transactions.repository.ts` — единственный слой с Prisma; все запросы фильтруются по `userId`: `findManyByUser(userId, {dateFrom,dateTo,type,categoryId})` (orderBy `date desc`), `findByIdForUser`, `create`, `update`, `delete`, `groupByTypeAndCategory(userId, from, to)` (`prisma.transaction.groupBy` с `_sum.amount`).
- `transactions.service.ts` — `toView`, 404 для чужой/несуществующей; при create/update с `categoryId` проверка, что категория принадлежит пользователю (иначе 404 `Category not found`) — через `CategoriesRepository`? Нет: модули связаны только через шину, поэтому добавляю запрос `GetUserCategoriesQuery` (уже есть в `categories/contract`) через `QueryBus` и проверяю наличие id в списке — без изменений в categories. `summary` возвращает: `{ month, year, income, expense, balance, byCategory: [{categoryId, type, total}] }`; границы месяца — UTC `[Date.UTC(year, month-1, 1), Date.UTC(year, month, 1))`; суммы строками (Decimal → `toFixed(2)`).
- `commands/*.handler.ts`, `queries/*.handler.ts` — тонкие, делегируют в сервис.
- `dto/create-transaction.dto.ts`: `amount` (`@IsNumber({maxDecimalPlaces: 2})`, `@IsPositive`, `@Max(9999999999.99)`), `type` (`@IsEnum(TransactionType)`), `description` (`@IsOptional @IsString @MaxLength(500)`, trim), `date` (`@IsDateString` → `@Type(() => Date)` не нужен, парсим в сервисе/DTO через `@Transform`), `categoryId` (`@IsString @IsNotEmpty`).
- `dto/update-transaction.dto.ts` — те же поля, все `@IsOptional()` (без `@nestjs/mapped-types`, зависимости не добавляем); пустое тело → 400, как в categories.
- `dto/list-transactions.query.dto.ts`: `dateFrom?`/`dateTo?` (`@IsDateString`), `type?` (`@IsEnum`), `categoryId?`; проверка `dateFrom <= dateTo` → 400.
- `dto/summary.query.dto.ts`: `month` (`@Type(() => Number) @IsInt @Min(1) @Max(12)`), `year` (`@IsInt @Min(1970) @Max(2100)`), оба обязательные. (Глобальный `ValidationPipe` уже с `transform: true`, `class-transformer` уже установлен.)
- `transactions.controller.ts`: `@Controller('transactions')`, `@UseGuards(JwtAuthGuard)`, `@CurrentUser()`; `POST` → 201, `GET` (`@Query()` list DTO), `GET summary`, `GET :id`, `PATCH :id`, `DELETE :id` → 204.
- `transactions.module.ts` (импорт `AuthModule`, providers: repository, service, handlers) + подключение в `app.module.ts`.

## 3. Правки в существующем коде
- `categories.service.ts`: сообщение `'Category has expenses'` → `'Category has transactions'` (логика P2003 остаётся).
- `packages/shared/src/index.ts`: убрать `ExpenseDto`; добавить `TransactionType`, `TransactionDto`, `CreateTransactionRequest`, `UpdateTransactionRequest`, `TransactionsSummaryDto`. Проверено: `apps/web` не импортирует `ExpenseDto`.
- `CLAUDE.md`: в списке моделей заменить `Expense` на `Transaction`, упомянуть transactions в описании API.

## Чеклист реализации
- [x] 0. Сохранить план в `.claude/plans/transactions.md`
- [ ] 1. `schema.prisma`: enum, `Transaction`, удалить `Expense`, обратные связи
- [ ] 2. Миграция `add-transactions` + `npm run db:generate`
- [ ] 3. `contract/` (view, команды, запросы, index)
- [ ] 4. repository (+ groupBy для summary)
- [ ] 5. service (404, проверка категории, summary)
- [ ] 6. handlers
- [ ] 7. DTO (create, update, list query, summary query)
- [ ] 8. controller (summary до `:id`) + module + `app.module.ts`
- [ ] 9. shared: типы, правка `categories.service.ts`, `CLAUDE.md`
- [ ] 10. `npm run build`, `prettier --write`, `npm run lint`
- [ ] 11. Ручная проверка (ниже), очистка тестовых данных
- [ ] 12. Коммит — только по просьбе

## Verification
1. `npm run db:migrate -- --name add-transactions`, `npm run db:generate`.
2. `npm run build` (shared → api → web), `npx prettier --check apps/api/src packages/shared/src`, `npm run lint`.
3. Запустить API, зарегистрировать пользователей A и B, создать категорию у каждого, curl:
   - без токена → 401
   - `POST /transactions` валидный → 201; `amount` ≤ 0 / 3 знака после запятой / плохой `type` / `date` → 400; чужая `categoryId` → 404
   - `GET /transactions` + фильтры `dateFrom`, `dateTo`, `type`, `categoryId`; B видит пустой список
   - `GET /transactions/summary?month=11&year=2026` → верные income/expense/balance/byCategory; без `month` или `year`, `month=13` → 400
   - `GET/PATCH/DELETE /transactions/:id` своей → 200/200/204; чужой или повторный → 404; пустой PATCH → 400
   - `DELETE /categories/:id` категории с транзакцией → 409
4. Удалить тестовых пользователей, остановить сервер. Тестовый раннер не настроен — юнит-тесты не добавляю.
