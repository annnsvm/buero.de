# Деплой buero.de на Render.com

Production-інфраструктура проєкту та налаштування сервісів на Render.

Для **локальної розробки** без redeploy див. [local-development.md](./local-development.md).

---

## Production-сервіси

| Сервіс | Тип на Render | URL / домен |
|--------|---------------|-------------|
| **Frontend** | Static Site | https://www.buro-de.com |
| **Backend** | Web Service (`buro-de`) | https://buro-de.onrender.com |
| **Database** | PostgreSQL | Render Dashboard → PostgreSQL → Info |

Перевірка backend:

- Health: https://buro-de.onrender.com/api/health
- DB: https://buro-de.onrender.com/api/health/db
- Swagger: https://buro-de.onrender.com/api-docs
- Stripe webhook: `https://buro-de.onrender.com/api/webhooks/stripe`

---

## Архітектура

```text
www.buro-de.com (Static Site, buero-frontend/)
        │
        │  VITE_API_URL=https://buro-de.onrender.com/api
        ▼
buro-de.onrender.com (Web Service, buero-backend-api/)
        │
        │  DATABASE_URL = Internal Database URL
        ▼
Render PostgreSQL
```

Порядок створення: PostgreSQL → Web Service → Static Site (+ custom domain для фронту).

---

## PostgreSQL

1. Render Dashboard → **New** → **PostgreSQL**.
2. Після створення → **Info**:
   - **Internal Database URL** → `DATABASE_URL` для Web Service `buro-de`.
   - **External Database URL** → для локального backend (див. [local-development.md](./local-development.md)).

Рекомендація для Prisma: додай `?schema=public` до URL, якщо параметра ще немає.

---

## Backend (Web Service: `buro-de`)

| Поле | Значення |
|------|----------|
| **Root Directory** | `buero-backend-api` |
| **Branch** | `main` |
| **Build Command** | `npm ci && npx prisma generate && npm run build` |
| **Start Command** | `npx prisma migrate deploy && npm run start` |
| **Health Check Path** | `/api/health` |

### Environment Variables (production)

| Змінна | Обов'язкова | Production |
|--------|-------------|------------|
| `DATABASE_URL` | Так | Internal Database URL |
| `NODE_ENV` | Ні | `production` |
| `JWT_ACCESS_SECRET` | Так | мін. 32 символи |
| `JWT_REFRESH_SECRET` | Так | мін. 32 символи |
| `JWT_ACCESS_EXPIRES_IN` | Ні | `30m` |
| `JWT_REFRESH_EXPIRES_IN` | Ні | `7d` |
| `CORS_ORIGIN` | Так | `https://www.buro-de.com` |
| `COOKIE_SECURE` | Ні | `true` |
| `COOKIE_DOMAIN` | Ні | порожньо (або `.buro-de.com` за потреби) |
| `STRIPE_SECRET_KEY` | Так | `sk_test_...` або `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Так | `whsec_...` з Stripe Dashboard |
| `STRIPE_PRICE_ID` | Так | `price_...` |
| `STRIPE_PORTAL_RETURN_URL` | Ні | `https://www.buro-de.com/settings/billing` |
| `CLOUDINARY_*` | Ні | для обкладинок курсів |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | Ні | `60` / `100` |
| `TRIAL_DAYS` | Ні | `7` |

---

## Frontend (Static Site → www.buro-de.com)

| Поле | Значення |
|------|----------|
| **Root Directory** | `buero-frontend` |
| **Branch** | `main` |
| **Build Command** | `npm ci && npm run build` |
| **Publish Directory** | `dist` |
| **Custom Domain** | `www.buro-de.com` |

### Environment Variables (build time)

| Змінна | Значення |
|--------|----------|
| `VITE_API_URL` | `https://buro-de.onrender.com/api` |

Без trailing slash. **Обов'язково `/api`** — відповідає `app.setGlobalPrefix('api')` у NestJS.

Після зміни `VITE_*` потрібен redeploy Static Site.

---

## Auto-Deploy

У Web Service і Static Site:

- **Auto-Deploy:** On
- **Branch:** `main`

Кожен push у `main` (після merge PR):

1. Backend: build → `prisma migrate deploy` → start
2. Frontend: build → publish `dist`

---

## Stripe webhook (production)

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. **URL:** `https://buro-de.onrender.com/api/webhooks/stripe`
3. Події: `checkout.session.completed` (+ інші з коду за потреби)
4. **Signing secret** → `STRIPE_WEBHOOK_SECRET` на Render → redeploy backend

---

## CORS і cookies

- `CORS_ORIGIN` на backend = точний URL фронту: `https://www.buro-de.com`
- Якщо є редірект з `buro-de.com` без `www`, додай обидва через кому
- `COOKIE_SECURE=true` для HTTPS
- Запити з фронту: `withCredentials: true` (вже в `apiInstance.ts`)

---

## Корисні посилання

- [Render Web Services](https://render.com/docs/web-services)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Render PostgreSQL](https://render.com/docs/databases)
- [Локальна розробка](./local-development.md)
