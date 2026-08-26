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
- WayForPay webhook: `https://buro-de.onrender.com/api/webhooks/wayforpay`

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
| `WAYFORPAY_MERCHANT_ACCOUNT` | Так | логін мерчанта з кабінету WayForPay |
| `WAYFORPAY_MERCHANT_SECRET` | Так | secret key мерчанта |
| `WAYFORPAY_MERCHANT_DOMAIN` | Так | домен рівно як зареєстрований у WayForPay, без протоколу |
| `WAYFORPAY_SERVICE_URL` | Так | `https://buro-de.onrender.com/api/webhooks/wayforpay` |
| `WAYFORPAY_CURRENCY` | Ні | `EUR` |
| `WAYFORPAY_RETURN_URL` | Ні | типово `${WAYFORPAY_SERVICE_URL}/return` |
| `CLOUDINARY_*` | Ні | для обкладинок курсів |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | Ні | `60` / `100` |
| `TRIAL_DAYS` | Ні | `7` |
| `SMTP_HOST` | Ні | `smtp.gmail.com` |
| `SMTP_PORT` | Ні | `587` |
| `SMTP_USER` | Так (для contact) | Gmail, напр. `burode452@gmail.com` |
| `SMTP_PASS` | Так (для contact) | Google App Password |
| `CONTACT_INBOX` | Ні | куди падають заявки (дефолт = `SMTP_USER`) |
| `MAIL_FROM` | Ні | `"Büro.de <burode452@gmail.com>"` |
| `PUBLIC_SITE_URL` | Ні | `https://www.buro-de.com` (посилання в листах) |

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

`npm run build` prerender-ить `/`, `/courses`, `/privacy`, `/terms`, `/cookies` у статичний HTML, щоб crawler-и бачили контент без JavaScript.

Після деплою фронту HTML може ще ~5 хв лежати в CDN Render (`s-maxage=300`; у заголовках видно `server: cloudflare` — це інфраструктура Render, окремий Cloudflare-акаунт не потрібен). Перевірка без JS: `curl -sL https://buro-de.com | grep "Вивчай німецьку"`.

---

## Auto-Deploy

У Web Service і Static Site:

- **Auto-Deploy:** On
- **Branch:** `main`

Кожен push у `main` (після merge PR):

1. Backend: build → `prisma migrate deploy` → start
2. Frontend: build → publish `dist`

---

## WayForPay (production)

`serviceUrl` і `returnUrl` передаються у кожному запиті на створення платежу, тому в кабінеті
WayForPay їх налаштовувати не обовʼязково — достатньо правильних env на Render.

1. `WAYFORPAY_SERVICE_URL` = `https://buro-de.onrender.com/api/webhooks/wayforpay` — **Web Service**,
   а не статичний сайт: це server-to-server callback, який обробляє NestJS.
2. `WAYFORPAY_MERCHANT_DOMAIN` має точно збігатися з доменом у кабінеті WayForPay
   (`buro-de.com` vs `www.buro-de.com` — це різні значення, підпис не зійдеться).
3. Після redeploy зроби тестову оплату і перевір у логах backend POST на `/api/webhooks/wayforpay`.

Браузер клієнта WayForPay повертає POST-запитом на `/api/webhooks/wayforpay/return`, звідки backend
редіректить на `${CORS_ORIGIN}/purchase/success?orderReference=...`. Тому `returnUrl` теж веде на
backend, а не на статичний сайт.

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
