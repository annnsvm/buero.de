# Локальна розробка buero.de

Як швидко додавати фічі локально, перевіряти зміни без redeploy на Render, і деплоїти на production лише після перевірки.

---

## Production (Render)

| Сервіс | Тип | URL |
|--------|-----|-----|
| **Frontend** | Static Site | https://www.buro-de.com |
| **Backend** | Web Service | https://buro-de.onrender.com |
| **Database** | PostgreSQL (Render) | Internal URL — тільки для Web Service на Render; **External URL** — для локального backend |

Корисні production-ендпоінти:

- API health: https://buro-de.onrender.com/api/health
- Swagger: https://buro-de.onrender.com/api-docs

---

## Ідея workflow

```text
Локально:  frontend (localhost:5173)  →  backend (localhost:3000)  →  Render PostgreSQL (External URL)
Production: www.buro-de.com          →  buro-de.onrender.com        →  Render PostgreSQL (Internal URL)
```

**Чому не підключати локальний frontend до Render backend?**  
Auth використовує **cookie**. Браузер не відправляє cookie між `localhost` і `onrender.com` — логін/реєстрація не працюватимуть. Для локальної розробки потрібен **локальний backend**.

**Чому можна використовувати Render DB локально?**  
Локальний backend підключається через **External Database URL** з Render Dashboard. Окремий PostgreSQL на машині не обов’язковий.

---

## Перше налаштування (один раз)

### 1. Клон і залежності

```bash
git clone https://github.com/annnsvm/buero.de.git
cd buero.de

cd buero-backend-api && npm install && cd ..
cd buero-frontend && npm install && cd ..
```

### 2. Backend `.env`

```bash
cd buero-backend-api
cp .env.example .env
```

У `buero-backend-api/.env` для **локальної розробки**:

| Змінна | Значення |
|--------|----------|
| `DATABASE_URL` | **External Database URL** з Render Dashboard → PostgreSQL → Info. Додай `?schema=public` в кінці, якщо його немає. |
| `NODE_ENV` | `development` |
| `PORT` | `3000` |
| `CORS_ORIGIN` | `http://localhost:5173` |
| `COOKIE_SECURE` | `false` |
| `COOKIE_DOMAIN` | порожньо |
| JWT, Stripe, Cloudinary | ті самі ключі, що на Render (або test-ключі Stripe) |

> **Render Dashboard → PostgreSQL → External URL** — для локального комп’ютера.  
> **Internal URL** — лише для Web Service `buro-de` на Render (не працює з ноутбука).

### 3. Frontend `.env`

```bash
cd buero-frontend
cp env.example .env
```

У `buero-frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

> Обов’язково **`/api`** в кінці — глобальний prefix NestJS.

### 4. Prisma (якщо ще не робила)

```bash
cd buero-backend-api
npx prisma generate
npx prisma migrate deploy
```

---

## Щоденний цикл розробки

### Термінал 1 — Backend

```bash
cd buero-backend-api
npm run start:dev
```

Очікуваний результат: `Backend is running on http://localhost:3000`  
Перевірка: http://localhost:3000/api/health

### Термінал 2 — Frontend

```bash
cd buero-frontend
npm run dev
```

Відкрий: http://localhost:5173

### Або обидва з кореня репо

```bash
npm install          # один раз — concurrently у корені
npm run dev          # backend + frontend паралельно
```

Після зміни `.env` перезапусти відповідний dev-сервер.

---

## Додавання нової фічі

1. Створи гілку: `git checkout -b feature/TGIPR-XX/short-description`
2. Розробляй локально (backend + frontend у двох терміналах).
3. Перевір auth, основні flow, консоль браузера (Network → запити йдуть на `localhost:3000/api`).
4. Закоміть і push:

```bash
git add .
git commit -m "feat: опис змін"
git push -u origin feature/TGIPR-XX/short-description
```

5. Створи **Pull Request** у `main` → code review → merge.
6. Render **Auto-Deploy** з `main` перебудує:
   - Web Service `buro-de`
   - Static Site `www.buro-de.com`

Redeploy вручну не потрібен, якщо Auto-Deploy увімкнено.

---

## Env: local vs production

### Backend

| Змінна | Local (`.env`) | Render (Web Service) |
|--------|----------------|----------------------|
| `DATABASE_URL` | External URL | Internal URL |
| `NODE_ENV` | `development` | `production` |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://www.buro-de.com` |
| `COOKIE_SECURE` | `false` | `true` |
| `STRIPE_PORTAL_RETURN_URL` | `http://localhost:5173/settings/billing` | `https://www.buro-de.com/settings/billing` |

Якщо потрібен і local, і production CORS на одному Render-сервісі (рідко):  
`CORS_ORIGIN=https://www.buro-de.com,http://localhost:5173` — код підтримує кілька origin через кому.

### Frontend

| Середовище | `VITE_API_URL` |
|------------|----------------|
| Local `.env` | `http://localhost:3000/api` |
| Render Static Site (build) | `https://buro-de.onrender.com/api` |

На Render Static Site `VITE_*` застосовуються **під час build**. Після зміни — **Manual Deploy** або push у `main`.

---

## Типові проблеми

| Симптом | Рішення |
|---------|---------|
| Auth не працює, запити на `onrender.com` | У `buero-frontend/.env` має бути `http://localhost:3000/api`; перезапусти `npm run dev` |
| CORS error | Backend запущений? `CORS_ORIGIN=http://localhost:5173` у локальному `.env`? |
| `Connection refused` / register fails with 500 | Backend not running, or wait ~1–2 min after `npm run start:dev` until you see `Backend is running on http://localhost:3000` |
| `SSL/TLS required` on DB queries | Use **External** URL with `?schema=public&sslmode=require` (see `.env.example`) |
| Prisma помилки схеми | `npx prisma migrate deploy` у `buero-backend-api` |
| Зміни `.env` не застосовуються | Перезапусти dev-сервер |

---

## Корисні команди

```bash
# Backend
cd buero-backend-api
npm run start:dev          # dev з hot reload
npm run test               # unit-тести
npm run test:e2e           # e2e (потрібна БД)

# Frontend
cd buero-frontend
npm run dev                # Vite dev server
npm run build              # production build (як на Render)
npm run preview            # перегляд production build локально

# Prisma
cd buero-backend-api
npx prisma studio          # GUI для БД
npx prisma migrate dev     # нова міграція під час розробки
```

---

## Деплой на Render

Деталі production-налаштувань: [deploy-render.md](./deploy-render.md).
