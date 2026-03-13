# Деплой buero.de на Render.com

Інструкція з підняття бекенду (NestJS), фронтенду (Vite + React) та PostgreSQL на Render з автоматичним деплоєм при пуші в гілку `main`.

---

## 1. Передумови

- Акаунт на [Render.com](https://render.com)
- Репозиторій проєкту на GitHub (гілка `main`)
- Доступ до [Stripe Dashboard](https://dashboard.stripe.com) для production webhook
- Мінімум один раз локально виконані міграції Prisma (`prisma migrate deploy` або `migrate dev`) — схема БД має бути актуальною

---

## 2. Архітектура на Render

| Сервіс | Тип | Призначення |
|--------|-----|-------------|
| **PostgreSQL** | Database | База даних для бекенду (Prisma) |
| **buero-backend-api** | Web Service | NestJS API, підключення до БД |
| **buero-frontend** | Static Site | Зібраний Vite (React), статика з `dist` |

Порядок створення: спочатку БД, потім бекенд, потім фронт (щоб мати URL бекенду для `VITE_API_URL`).

---

## 3. Створення PostgreSQL

1. У [Render Dashboard](https://dashboard.render.com) → **New** → **PostgreSQL**.
2. **Name:** `buero-db` (або на вибір).
3. **Region:** обери ближчий (наприклад Frankfurt).
4. **Plan:** Free або Starter — на вибір.
5. **Create Database**.
6. Після створення відкрий базу → **Info** → скопіюй **Internal Database URL** (він починається з `postgresql://`). Він потрібен для бекенду як `DATABASE_URL`.  
   - Для Web Service варто використовувати саме **Internal** URL (безпечніше і стабільніше в межах Render).

---

## 4. Backend (Web Service)

1. **New** → **Web Service**.
2. Підключи репозиторій (GitHub) і вибери репо з проєктом buero.de.
3. **Branch:** `main`.
4. **Root Directory:** `buero-backend-api` (обов’язково — монорепо).
5. **Runtime:** Node.
6. **Build Command:**
   ```bash
   npm ci && npx prisma generate && npm run build
   ```
7. **Start Command:**
   ```bash
   npx prisma migrate deploy && npm run start
   ```
   (Міграції виконуються при кожному деплої; якщо хочеш тільки при першому — можна винести в **Pre-Deploy Command** або виконати вручну один раз і прибрати з Start.)
8. **Instance Type:** Free або платний план.
9. **Environment Variables** — додай усі змінні з таблиці нижче (секція Backend).  
   - `DATABASE_URL` встав з Internal Database URL з кроку 3.  
   - Решту (JWT, Stripe, CORS) заповни production-значеннями.
10. **Advanced** → **Health Check Path** (опційно): `/api/health` — якщо у тебе є такий ендпоінт.
11. **Create Web Service**.
12. Після першого успішного деплою скопіюй **URL сервісу** (наприклад `https://buero-backend-api.onrender.com`) — він потрібен для фронту як `VITE_API_URL` і для CORS.

---

## 5. Frontend (Static Site)

1. **New** → **Static Site**.
2. Той самий репо, гілка **main**.
3. **Root Directory:** `buero-frontend`.
4. **Build Command:**
   ```bash
   npm ci && npm run build
   ```
5. **Publish Directory:** `dist` (стандартний вихід Vite).
6. **Environment Variables** (важливо встановити на етапі **Build**):
   - **Key:** `VITE_API_URL`  
   - **Value:** URL бекенду з кроку 4, наприклад `https://buero-backend-api.onrender.com`  
   - Без слеша в кінці. Фронт підставляє це значення під час `vite build`.
7. **Create Static Site**.

Після деплою фронт буде доступний за своїм URL (наприклад `https://buero-frontend.onrender.com`).

---

## 6. Змінні середовища (Environment Variables)

### Backend (Web Service)

| Змінна | Обов'язкова | Опис | Приклад (production) |
|--------|-------------|------|----------------------|
| `DATABASE_URL` | Так | Internal Database URL з Render PostgreSQL | `postgresql://user:pass@host/db?schema=public` |
| `NODE_ENV` | Ні | `production` на Render | `production` |
| `PORT` | Ні | Задає Render автоматично; у коді вже використовується | — |
| `JWT_ACCESS_SECRET` | Так | Секрет для access JWT (мін. 32 символи) | Згенерований рядок |
| `JWT_REFRESH_SECRET` | Так | Секрет для refresh JWT | Згенерований рядок |
| `JWT_ACCESS_EXPIRES_IN` | Ні | Термін дії access токена | `30m` |
| `JWT_REFRESH_EXPIRES_IN` | Ні | Термін дії refresh токена | `7d` |
| `COOKIE_DOMAIN` | Ні | Домен для cookie (якщо фронт і бек на різних піддоменах) | порожньо або `.onrender.com` |
| `COOKIE_SECURE` | Ні | `true` для HTTPS | `true` |
| `CORS_ORIGIN` | Так | URL фронтенду (один або кілька через кому) | `https://buero-frontend.onrender.com` |
| `STRIPE_SECRET_KEY` | Так | Stripe secret key (live або test) | `sk_live_...` або `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Так | Signing secret з Stripe Dashboard для production webhook | `whsec_...` |
| `STRIPE_PRICE_ID` | Так | ID ціни (one-time) для купівлі курсу | `price_...` |
| `STRIPE_PORTAL_RETURN_URL` | Ні | URL повернення після Stripe Customer Portal | `https://buero-frontend.onrender.com/settings/billing` |

### Frontend (Static Site)

| Змінна | Обов'язкова | Опис |
|--------|-------------|------|
| `VITE_API_URL` | Так | Базовий URL API (без слеша в кінці). Встановити на етапі Build. | `https://buero-backend-api.onrender.com` |

---

## 7. Автоматичний деплой (ребілд при пуші в main)

- У кожному сервісі (Backend і Static Site) у налаштуваннях увімкни **Auto-Deploy**.
- **Branch:** `main` (або та гілка, з якої ти деплоїш).
- Після цього кожен **push у `main`** запускає:
  - для Web Service — build + `prisma migrate deploy` + start;
  - для Static Site — build і публікацію з `dist`.

Окремий CI (наприклад GitHub Actions) для самого деплою не обов’язковий: Render сам робить ребілд при коміті в обрану гілку.

---

## 8. Після першого деплою

### Stripe webhook (production)

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Add endpoint**.
2. **Endpoint URL:** `https://<твій-backend-url>/api/webhooks/stripe` (наприклад `https://buero-backend-api.onrender.com/api/webhooks/stripe`).
3. Події: мінімум `checkout.session.completed` (за потреби додай інші з твого коду).
4. Після створення скопіюй **Signing secret** (`whsec_...`) і встав його в env бекенду на Render як `STRIPE_WEBHOOK_SECRET`.
5. Збережи зміни env і перезадеплой бекенд (або дочекайся наступного деплою).

### CORS і cookies

- Переконайся, що `CORS_ORIGIN` на бекенді точно збігається з URL фронту (включно з `https://`).
- Якщо куки не відправляються з фронту на бекенд: перевір `COOKIE_DOMAIN`, `COOKIE_SECURE` і що запити йдуть з того ж домену або з дозволеного `CORS_ORIGIN` з `credentials: true` (у тебе вже налаштовано).

### Перевірка

- Відкрий URL фронту → логін/реєстрація → створення курсу (вчитель) → оплата тестовою карткою (якщо Stripe test) і перевір, що webhook викликається і доступ з’являється.

---

## 9. Blueprint (render.yaml) — опційно

У корені репозиторію є файл **render.yaml** — опис сервісів і бази в форматі Render Blueprint (IaC). Можна використати його так:

1. У Render Dashboard → **New** → **Blueprint**.
2. Підключи репо і вкажи гілку `main`.
3. Render прочитає `render.yaml` і запропонує створити PostgreSQL, Web Service і Static Site.
4. У Blueprint частина змінних позначена як `sync: false` — їх потрібно заповнити вручну в Dashboard після створення:
   - **Backend:** `CORS_ORIGIN` (URL фронту), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `STRIPE_PORTAL_RETURN_URL`. JWT-секрети можна згенерувати через Render (`generateValue: true`) або задати свої.
   - **Frontend:** `VITE_API_URL` — URL бекенду (наприклад `https://buero-backend-api.onrender.com`). Доцільно вказати після першого успішного деплою бекенду, потім зробити redeploy статики.
5. Після створення сервісів увімкни **Auto-Deploy** для гілки `main` у кожного сервісу (за замовчуванням часто вже увімкнено).

Деталі полів — у [Render Blueprint Spec](https://render.com/docs/blueprint-spec).

---

## 10. Корисні посилання

- [Render Web Services](https://render.com/docs/web-services)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Render PostgreSQL](https://render.com/docs/databases)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
