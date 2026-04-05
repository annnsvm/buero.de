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

**Cloudinary (обкладинки курсів):** для `POST /api/courses/:id/cover` потрібен акаунт [Cloudinary](https://cloudinary.com). У [Dashboard](https://cloudinary.com/console) скопіюй **Cloud name**, **API Key**, **API Secret** і додай у `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Без цих змінних сервер стартує, але завантаження обкладинки поверне помилку конфігурації. У Media Library файли потрапляють у папку `courses` (public_id = id курсу).

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

**Документація API (Swagger):** після запуску сервера доступна за адресою [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

**Rate limiting (Throttler):** кількість запитів обмежена глобально (`THROTTLE_TTL`, `THROTTLE_LIMIT` у `.env`). Для `POST /api/auth/register` та `POST /api/auth/login` діє жорсткіший ліміт (5 спроб за 60 с). При перевищенні — відповідь **429 Too Many Requests**. Маршрути `GET /api/health`, `GET /api/health/db` та `POST /webhooks/stripe` виключені з обмеження.

---

## Модулі та ендпоінти

| Модуль           | Базовий шлях                                         | Опис                                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Health           | `/api/health`                                        | Перевірка життєздатності сервісу та БД (`GET /`, `GET /db`).                                                                                                                                                                                |
| Courses          | `/api/courses`                                       | CRUD курсів: список опублікованих (фільтри `category`, `language`), один по id (з модулями), створення, оновлення, видалення. Обкладинка: `POST /api/courses/:id/cover` (multipart `file`, teacher, Cloudinary → `image_url`).              |
| Course Modules   | `/api/courses/:courseId/modules`                     | CRUD модулів курсу: список за order_index, один по id, створення, оновлення, видалення. Доступ за user_course_access.                                                                                                                       |
| Course Materials | `/api/courses/:courseId/modules/:moduleId/materials` | CRUD матеріалів модуля: список за order_index, один по id, створення, оновлення, видалення. Доступ за user_course_access до курсу.                                                                                                          |
| Progress         | `/api/progress`, `/api/courses/:courseId/progress`   | Загальний прогрес (`GET /me`), прогрес по курсу (`GET /courses/:id/progress`), позначити матеріал пройденим (`POST .../materials/:id/complete`), рекомендований наступний курс (`GET /recommended-next`). JWT: користувач з `request.user`. |
| Quiz             | `/api/quiz/attempts`                                 | Почати спробу (`POST`), відправити відповідь (`POST /:attemptId/answers`), завершити (`POST /:attemptId/complete`), стан спроби для resume (`GET /:attemptId`). JWT. Покрокове збереження в answers_snapshot.                               |

У Swagger UI (`/api-docs`) всі ендпоінти задокументовані з прикладами запитів та відповідей.

---

## Тести

| Команда            | Опис                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `npm run test`     | Unit-тести (Jest), наприклад `UserService` (auth: register, tokens). |
| `npm run test:watch` | Unit у watch-режимі.                                             |
| `npm run test:cov` | Unit з покриттям (`coverage/`).                                      |
| `npm run test:e2e` | E2E по HTTP (Supertest): auth, **users**, **courses** (каталог, CRUD вчителя, 404). Потрібні **PostgreSQL**, `.env` з `DATABASE_URL`, схема БД узгоджена з Prisma (`npx prisma migrate deploy`), JWT, Stripe (як для `start:dev`). У `test/setup-e2e-env.ts` вмикається `E2E_TEST=true` — Throttler не обмежує запити під час e2e. |

---

## Скрипти

| Команда                   | Опис                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `npm run start:dev`       | Запуск у dev-режимі (`nest start --watch`, перезапуск при змінах, перевірка типів) |
| `npm run build`           | Збірка в `dist/` (`nest build`)                                                    |
| `npm run start`           | Запуск зібраного додатку (`nest start`)                                            |
| `npm run prisma:generate` | Генерація Prisma Client                                                            |
| `npm run prisma:seed`     | Опційно: заповнення БД для перевірки (наприклад placement_questions)               |

---

## Структура та документація

- Джерела правди (у корені репозиторію): **docs/architecture.md**, **docs/api-plan.md**, **docs/auth-spec.md**, **docs/auth-config.md**, **docs/modules/\*.md**.
- Модулі API: Auth, Users, Placement Test, Courses, Course Materials, Progress & Quizzes, Subscriptions & Billing, Lesson Requests (порядок реалізації — у `docs/api-plan.md`).
