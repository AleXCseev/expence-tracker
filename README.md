# Expense Tracker

Монорепозиторий (npm workspaces):

- `apps/web` — Next.js
- `apps/api` — NestJS + Prisma
- `packages/shared` — общие типы и константы
- PostgreSQL — через `docker-compose.yml`

## Запуск

```bash
cp .env.example .env
cp .env apps/api/.env
npm install
npm run db:up
npm run db:migrate
npm run dev:api   # http://localhost:4000/health
npm run dev:web   # http://localhost:3000
```
