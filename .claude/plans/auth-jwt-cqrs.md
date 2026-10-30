# План: авторизация (JWT) в apps/api с CQRS между модулями

## Context
В API пока только `/health` и Prisma-обвязка. Модель `User` содержит лишь `id`, `email`, `createdAt` — нет имени и хеша пароля. Нужно: модуль пользователей (репозиторий + сервис), отдельный модуль авторизации на JWT, методы регистрации и логина. Модули общаются между собой только через CQRS (`@nestjs/cqrs`): `AuthModule` не импортирует `UsersService`/репозиторий, а отправляет команды и запросы через `CommandBus`/`QueryBus`.

## 1. Зависимости (apps/api/package.json)
- `@nestjs/cqrs`, `@nestjs/jwt`, `@nestjs/config`, `bcryptjs` (чистый JS, без нативной сборки на Windows), `class-validator`, `class-transformer`
- dev: `@types/bcryptjs`
- Passport не используем: свой `JwtAuthGuard` на базе `JwtService`.

## 2. Prisma (apps/api/prisma/schema.prisma)
`User` расширяем:
- `name String`
- `passwordHash String`
- `updatedAt DateTime @updatedAt`
- `lastLoginAt DateTime?`
- `email` остаётся `@unique` (нормализуем в lowercase)

Миграций ещё нет → `npm run db:migrate -- --name init` (нужен Postgres: `npm run db:up`), затем `db:generate`.

## 3. Модуль users — `apps/api/src/modules/users/`
Слои: handler → `UsersService` → `UsersRepository` → Prisma.
- `users.repository.ts` — единственное место, знающее про Prisma для User: `findById`, `findByEmail`, `create`, `updateLastLogin`.
- `users.service.ts` — бизнес-логика: `create` (lowercase email, bcryptjs cost 10, `ConflictException` при занятом email), `findById`, `findByEmail`, `validateCredentials(email, password)` (вернёт `SafeUser | null`), `touchLogin`. Наружу всегда `SafeUser` (без `passwordHash`).
- Публичный контракт модуля (то, что импортирует Auth) — `users.contract.ts` / папка `contract/`:
  - Команды: `CreateUserCommand {name,email,password}`, `RecordLoginCommand {userId}`
  - Запросы: `GetUserByIdQuery {id}`, `ValidateCredentialsQuery {email,password}`
  - Тип `SafeUser`
- `commands/*.handler.ts` (`@CommandHandler`) и `queries/*.handler.ts` (`@QueryHandler`) — тонкие, делегируют в `UsersService`.
- `users.module.ts` — `CqrsModule`, providers: repository, service, все handlers. Ничего не экспортирует (кроме, при необходимости, типов).

## 4. Модуль auth — `apps/api/src/modules/auth/`
- `dto/register.dto.ts` (`name` 1–100, `email` IsEmail, `password` 8–72), `dto/login.dto.ts`
- Собственные CQRS-объекты Auth, чтобы контроллер был тонким:
  - `RegisterCommand` / `RegisterHandler`: `commandBus.execute(CreateUserCommand)` → подпись JWT → `{accessToken, user}`
  - `LoginCommand` / `LoginHandler`: `queryBus.execute(ValidateCredentialsQuery)`; если `null` — `UnauthorizedException` (одно сообщение для неверного email и пароля) → `commandBus.execute(RecordLoginCommand)` → подпись JWT
  - `GetCurrentUserQuery` / handler: `queryBus.execute(GetUserByIdQuery)` для `/auth/me`
- `auth.controller.ts` — `POST /auth/register`, `POST /auth/login`, `GET /auth/me`; контроллер зависит только от `CommandBus`/`QueryBus`.
- `token.service.ts` — обёртка над `JwtService.signAsync({ sub, email })`.
- `jwt-auth.guard.ts` — `Authorization: Bearer`, `verifyAsync`, кладёт `request.user = { id, email }`.
- `current-user.decorator.ts` — `@CurrentUser()`.
- `auth.module.ts` — `CqrsModule`, `JwtModule.registerAsync` (`JWT_SECRET`, `JWT_EXPIRES_IN`, по умолчанию `1h`), exports `JwtAuthGuard`, `JwtModule` для будущих модулей (категории, расходы). `UsersModule` не импортируется — связь только через шины (`AppModule` подключает оба модуля).

## 5. Конфигурация и bootstrap
- `app.module.ts`: `ConfigModule.forRoot({ isGlobal: true })`, `CqrsModule.forRoot()`, `UsersModule`, `AuthModule`.
- `main.ts`: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`.
- `.env.example` (и `apps/api/.env`): `JWT_SECRET=change-me`, `JWT_EXPIRES_IN=1h`. Старт падает без `JWT_SECRET`.

## 6. packages/shared (src/index.ts)
Типы: `UserDto {id,name,email}`, `RegisterRequest`, `LoginRequest`, `AuthResponse {accessToken, user}`. Пересобрать `npm run build -w packages/shared`.

## Verification
1. `npm install`, `npm run db:up`, `npm run db:migrate`, `npm run db:generate`
2. `npm run build` и `npm run lint` — без ошибок
3. `npm run dev:api`, curl:
   - `POST /auth/register` → 201, токен, в ответе нет `passwordHash`
   - повтор того же email → 409
   - `POST /auth/login` верный/неверный пароль → 200 / 401
   - `GET /auth/me` без токена → 401, с токеном → 200
   - невалидное тело → 400
4. Проверить, что в `modules/auth` нет импортов из `users` кроме `contract/`.
5. Тестовый раннер не настроен — юнит-тесты не добавляем (можно предложить отдельно).
