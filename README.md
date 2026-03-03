# buero.de

**Онлайн-платформа для вивчення німецької мови** з інтегрованою моделлю соціокультурної адаптації на основі інтерактивних навчальних сценаріїв.

---

## Мета проєкту

Платформа дає можливість:

- визначати рівень володіння мовою (A1–B2) через **Placement Test** і отримувати **trial**;
- навчатися через **відео-уроки**, **квізи** та **інтерактивні сценарії** (Integration & Life in Germany);
- відстежувати **прогрес** по курсах і матеріалах;
- оформляти **помісячну підписку** через Stripe;
- створювати **запити на живі заняття** (студент → вчитель).

Ролі: **Student** (навчання, профіль, підписка) та **Teacher** (створення курсів і матеріалів, обробка запитів на заняття). Мови інтерфейсу: **EN / DE**.

---

## Інтро

- **Backend:** API на Node.js (орієнтація на NestJS у документації), PostgreSQL, Prisma, JWT (access + refresh у cookie), Stripe (Checkout, Customer Portal, webhooks).
- **Frontend:** SPA на React + TypeScript, Redux Toolkit, feature-based структура; інтеграція з backend через один HTTP-клієнт з підтримкою refresh при 401.
- **Документація:** архітектура, вимоги, модулі API та фронтенд-архітектура/флоу/фічі описані в папках `docs/` та `buero-frontend/docs/`.

---

## Документація

| Розділ | Опис |
|--------|------|
| **Backend** | [Архітектура та БД](docs/architecture.md), [Вимоги](docs/requirements.md), [План API](docs/api-plan.md), [Модулі](docs/modules/), [Auth](docs/auth-spec.md), [Auth config](docs/auth-config.md), [Інструменти](docs/tools.md). |
| **Frontend** | [Архітектура фронтенду](buero-frontend/docs/frontend-architecture.md), [Флоу](buero-frontend/docs/frontend-flows.md), [Фічі (UI)](buero-frontend/docs/frontend-features/). |

---

## Дизайн (Figma)

Макети інтерфейсу (landing, каталог курсів, проходження курсу тощо):

**[Figma: Diploma Project — buero.de](https://www.figma.com/design/h9YRUL0HIo0IIMrsum1Znm/Diploma-Project?node-id=92-6846&p=f&t=Oh5x6zfZf9Gm5WHo-0)**

При розробці UI орієнтуйтесь на цей файл та на опис сторінок і компонентів у `buero-frontend/docs/`.

---

## Як користуватися проєктом

### Стягнути репозиторій

```bash
git clone https://github.com/annnsvm/buero.de.git
cd buero.de
```

Або оновити вже склонований проєкт:

```bash
git pull origin main
```

### Передумови

- **Node.js** 18+ (рекомендовано LTS)
- **npm** (або yarn/pnpm за бажанням)
- **PostgreSQL** (локально або зовнішній інстанс)
- **Git**

---

## Локальне встановлення

1. Клонуйте репозиторій (див. вище).
2. Налаштуйте **backend** (див. секцію Backend).
3. Налаштуйте **frontend** (див. секцію Frontend).
4. Запустіть backend і frontend окремими командами в двох терміналах.

---

## Backend

### Розташування

Код backend у папці **`buero-backend-api/`**. Документація по beckend у **`docs/`**.

Тут потрібно додати інфо по налаштуванню беку

### Як працювати з backend

- Читайте **архітектуру та модулі**: `docs/architecture.md`, `docs/api-plan.md`, `docs/modules/*.md`.
- Модулі в порядку реалізації: Auth → Users → Placement Test → Courses → Course Materials → Progress & Quizzes → Subscriptions & Billing → Lesson Requests.
- API-контракти, DTO та коди помилок узгоджуються з цими документами. Для тестів — `docs/tools.md` та `.cursor/rules/testing-api.mdc`.
- Гілки: `feature/TGIPR-<N>/<short-description>` (наприклад, `feature/TGIPR-42/auth-register-login`).

### Змінні середовища (backend)

| Змінна | Опис | Приклад |
|--------|------|---------|
| `DATABASE_URL` | URL підключення до PostgreSQL | `postgresql://user:password@localhost:5432/buero_db` |
| `PORT` | Порт HTTP-сервера | `3001` |
| `JWT_ACCESS_SECRET` | Секрет для access token | (довгий випадковий рядок) |
| `JWT_REFRESH_SECRET` | Секрет для refresh token | (довгий випадковий рядок) |
| `JWT_ACCESS_EXPIRES_IN` | TTL access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | TTL refresh token | `7d` |
| `STRIPE_SECRET_KEY` | Секретний ключ Stripe | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Секрет для верифікації webhook | `whsec_...` |
| `CORS_ORIGIN` | Дозволений origin для фронту | `http://localhost:5173` |

Файл **`.env`** не комітиться в репозиторій. Можна додати **`.env.example`** з переліком змінних без секретів.

---

## Frontend

### Розташування

Код фронтенду у папці **`buero-frontend/`**. Документація — у **`buero-frontend/docs/`**.

### Встановлення та запуск

```bash
cd buero-frontend
npm install
```

Створіть **`.env`** або **`.env.local`** у корені `buero-frontend/` (див. змінні нижче). Потім:

```bash
# Режим розробки (Vite)
npm run dev
```

Збірка для продакшену:

```bash
npm run build
npm run preview 
```

### Як працювати з frontend

- Орієнтуйтесь на **архітектуру та флоу**: `buero-frontend/docs/frontend-architecture.md`, `buero-frontend/docs/frontend-flows.md`.
- Сторінки та фічі описані в **`buero-frontend/docs/frontend-features/`** (landing, auth, placement-test, courses-catalog, course-learning тощо).
- Стек: React 18, TypeScript, Redux Toolkit, React Router, React Hook Form + Zod, axios, Tailwind, react-i18next. Токени лише в cookie (не в localStorage) — див. `.cursor/rules/frontend-patterns.mdc`.
- Гілки: `feature/TGIPR-<N>/frontend-<short-description>` (наприклад, `feature/TGIPR-101/frontend-landing-page`).

### Змінні середовища (frontend)

| Змінна | Опис | Приклад |
|--------|------|---------|
| `VITE_API_URL` | Base URL backend API | `http://localhost:3001` або `http://localhost:3000` |

Після зміни `.env` перезапустіть `npm run dev`.

---

## Структура репозиторію

```text
buero.de/
├── README.md                 # Цей файл
├── docs/                     # Документація backend (архітектура, вимоги, модулі, auth)
├── buero-backend-api/        # Backend API (NestJS/Node, Prisma, PostgreSQL)
├── buero-frontend/           # Frontend SPA (React, TypeScript, Vite)
│   └── docs/                 # Документація frontend (архітектура, flows, features)
└── .cursor/
    └── rules/                # Cursor-правила (git-workflow, frontend-patterns, stripe-and-access тощо)
```

---

## Git workflow

- Одна гілка на задачу: **`feature/TGIPR-<N>/<short-description>`**.
- PR у **main** з описом змін. Перед мерджем — код-рев’ю.
- Деталі: [.cursor/rules/git-workflow.mdc](.cursor/rules/git-workflow.mdc).

---

