# buero-backend-api

Backend API платформи buero.de на **NestJS**: авторизація, курси, матеріали, прогрес, підписки (Stripe). БД — PostgreSQL, ORM — Prisma.

---

## Що потрібно локально

- **Node.js** (LTS, рекомендовано 20+)
- **npm**
- **PostgreSQL** (запущений локально або доступний за адресом з `DATABASE_URL`)

---

## Покроковий запуск

### 1. Встановити залежності

З кореня проєкту `buero-backend-api`:

```bash
npm install
```

### 2. Налаштувати середовище

- Скопіюй `.env.example` у `.env`:
  ```bash
  cp .env.example .env
  ```
- Відкрий `.env` і вкажи реальні значення (мінімум — `DATABASE_URL` на твою PostgreSQL):
  ```env
  DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/buero_platform_db?schema=public"
  NODE_ENV=development
  PORT=3000
  ```
  Решту змінних (JWT, CORS, Cookie) можна заповнити пізніше для модуля Auth.

### 3. Підготувати БД і Prisma Client

Переконайся, що база з іменем у `DATABASE_URL` існує (створи її в pgAdmin або через `createdb`). Потім:

```bash
npx prisma generate
```

Якщо потрібні міграції (таблиці згідно з `schema.prisma`):

```bash
npx prisma migrate dev --name init
```

### 4. Запустити сервер у режимі розробки

```bash
npm run start:dev
```

У консолі має з’явитися щось на кшталт:

- `[Prisma] Connected to PostgreSQL`
- `Backend is running on http://localhost:3000`

---

## Перевірка роботи

У **іншому** терміналі (сервер має бути запущений):

**Життєздатність сервісу:**

```bash
curl http://localhost:3000/api/health
```

Очікувана відповідь: `{"status":"ok","timestamp":"..."}` (статус 200).

**Перевірка підключення до БД:**

```bash
curl http://localhost:3000/api/health/db
```

Очікувана відповідь при успіху: `{"database":"ok","timestamp":"..."}` (статус 200).  
При помилці підключення — 503 і JSON з `"database":"error"` та `"message":"..."`.

---

## Скрипти

| Команда | Опис |
|--------|------|
| `npm run start:dev` | Запуск у dev-режимі (ts-node-dev, перезапуск при змінах) |
| `npm run build` | Збірка в `dist/` |
| `npm run start` | Запуск зі зібраного коду (`node dist/main.js`) |
| `npm run prisma:generate` | Генерація Prisma Client |

---

## Структура та документація

- Джерела правди: **docs/architecture.md**, **docs/api-plan.md**, **docs/auth-spec.md**, **docs/auth-config.md**, **docs/modules/*.md**.
- Модулі API: Auth, Users, Placement Test, Courses, Course Materials, Progress & Quizzes, Subscriptions & Billing, Lesson Requests (порядок реалізації — у `docs/api-plan.md`).
