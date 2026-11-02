# План: модуль категорий трат (apps/api)

## Context
Авторизация готова (`JwtAuthGuard`, `@CurrentUser()` из `modules/auth`, CQRS-шины, коммит 4598022). В Prisma уже есть заготовка `Category {id, name, userId}` с `@@unique([userId, name])`, но без цвета и иконки и без API. Нужен CRUD категорий, привязанных к пользователю, под гуардом и с валидацией. Паттерн модуля повторяет `users`: controller → CommandBus/QueryBus → handler → service → repository → Prisma.

## 1. Prisma (apps/api/prisma/schema.prisma)
`Category` расширяем:
- `color String` — hex вида `#RRGGBB` (валидируется на уровне DTO)
- `icon String` — идентификатор иконки (строка, напр. `shopping-cart`), необязательность см. DTO: в БД `String`, в DTO обязателен
- `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- `@@index([userId])` не нужен — покрывается `@@unique([userId, name])`

Связь `Expense.category` оставляем без каскада (Restrict): удаление категории с тратами должно давать 409, а не молча удалять траты. Заодно привожу в порядок выравнивание `expenses Expense[]` в `User`.
Миграция: `npm run db:migrate -- --name add_category_color_icon`. Новые колонки `NOT NULL` без default на пустой таблице проходят; если в БД уже есть категории, добавить `@default("#9CA3AF")` для `color` и `@default("tag")` для `icon`. **Рекомендую сразу поставить эти defaults** — миграция безопасна в любом случае, а `color`/`icon` в DTO при создании тогда можно сделать необязательными.

## 2. Модуль categories — `apps/api/src/modules/categories/`
- `categories.repository.ts` — единственный слой с Prisma: `findAllByUser(userId)` (сортировка по `name`), `findByIdForUser(id, userId)`, `create`, `update`, `delete`. Все выборки/изменения фильтруются по `userId` — чужие категории недоступны.
- `categories.service.ts` — бизнес-логика, возвращает `CategoryView` (`id,name,color,icon,createdAt,updatedAt`; `userId` наружу не отдаём):
  - `create(userId, dto)` — перехват Prisma `P2002` → `ConflictException('Category already exists')`
  - `findAll(userId)`
  - `update(userId, id, dto)` — не найдена/чужая → `NotFoundException`; конфликт имени → 409
  - `remove(userId, id)` — не найдена/чужая → 404; Prisma `P2003` (есть траты) → `ConflictException('Category has expenses')`
- CQRS: `commands/` (`CreateCategoryCommand`, `UpdateCategoryCommand`, `DeleteCategoryCommand` + handlers), `queries/` (`GetUserCategoriesQuery` + handler). Тонкие handlers делегируют в сервис. Классы команд/запросов — в `contract/` с `index.ts` (как у users), чтобы другие модули (расходы) могли запрашивать категории только через шину.
- `dto/create-category.dto.ts`: `name` string 1–50 (trim), `color` `@Matches(/^#[0-9a-fA-F]{6}$/)`, `icon` string 1–50 `@Matches(/^[a-z0-9-]+$/)`.
- `dto/update-category.dto.ts` — `PartialType`-аналог: все поля необязательны (без `@nestjs/mapped-types`, чтобы не добавлять зависимость — просто те же декораторы + `@IsOptional()`). Пустое тело → 400.
- `categories.controller.ts` — `@Controller('categories')`, `@UseGuards(JwtAuthGuard)` на весь класс, `@CurrentUser()` для `userId`:
  - `POST /categories` → 201
  - `GET /categories` → список категорий пользователя
  - `PATCH /categories/:id` → обновлённая категория
  - `DELETE /categories/:id` → 204 (`@HttpCode(204)`)
  - id-параметр без дополнительной валидации (cuid), несуществующий → 404
- `categories.module.ts` — providers: repository, service, handlers. `AuthModule` импортируется ради `JwtAuthGuard`/`JwtModule` (он их экспортирует).
- Подключить `CategoriesModule` в `app.module.ts`.

## 3. packages/shared (src/index.ts)
Расширить существующий `CategoryDto` (`id,name,color,icon`) и добавить `CreateCategoryRequest`, `UpdateCategoryRequest`. Проверить, что `apps/web` не использует `CategoryDto` (сейчас — нет). Пересобрать `npm run build -w packages/shared`.

## Чеклист реализации
- [x] 0. Сохранить этот план в проект: `.claude/plans/categories-crud.md`
- [x] 1. `schema.prisma`: поля `color`, `icon` (с defaults), `createdAt`, `updatedAt` в `Category`; поправить выравнивание `User`
- [x] 2. `npm run db:generate` + миграция `add_category_color_icon`
- [x] 3. `categories/contract/`: команды (`Create`, `Update`, `Delete`), запрос `GetUserCategories`, тип `CategoryView`, `index.ts`
- [x] 4. `categories.repository.ts` (все запросы с фильтром по `userId`)
- [x] 5. `categories.service.ts` (P2002 → 409, P2003 → 409, чужая/нет → 404)
- [x] 6. Handlers команд и запроса
- [x] 7. DTO: `create-category.dto.ts`, `update-category.dto.ts` (+ проверка непустого тела)
- [x] 8. `categories.controller.ts` с `JwtAuthGuard` на классе, `@CurrentUser()`, `DELETE` → 204
- [x] 9. `categories.module.ts` (импорт `AuthModule`) и подключение в `app.module.ts`
- [x] 10. `packages/shared`: `CategoryDto`, `Create/UpdateCategoryRequest`; пересобрать shared
- [x] 11. `npm run build`, `prettier --write` для изменённых файлов
- [x] 12. Ручная проверка по сценарию ниже (два пользователя A/B)
- [x] 13. Очистка: удалить тестовых пользователей, остановить сервер
- [ ] 14. Коммит — только по просьбе пользователя

## Verification
1. `npm run db:generate`, `npm run db:migrate -- --name add_category_color_icon` (Postgres уже поднят; если миграция зависнет на advisory lock — убить оставшиеся сессии, как в прошлый раз)
2. `npm run build`, `npx prettier --check apps/api/src packages/shared/src`
3. Запустить API, зарегистрировать двух пользователей A и B, curl:
   - без токена на любой эндпоинт → 401
   - `POST /categories` валидный → 201; повтор имени → 409; плохой `color`/пустое `name` → 400
   - `GET /categories` у A видит только свои, у B — пустой список
   - `PATCH` своей → 200; чужой id → 404; пустое тело → 400
   - `DELETE` своей → 204; повторно → 404; категория с тратой (создать расход напрямую в БД через psql) → 409
4. Убрать тестовых пользователей и остановить сервер.
5. Тестовый раннер по-прежнему не настроен, юнит-тесты не добавляю.
