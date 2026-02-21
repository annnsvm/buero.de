# Налаштування: ENV, CORS, Cookie (Auth)

Доповнення до **docs/auth-spec.md**. Тут зібрані конкретні налаштування для реалізації авторизації: змінні середовища, CORS та параметри cookie.

---

## 1. Змінні середовища (ENV)

У корені backend-проєкту створити файл **`.env`** (не комітити в git; у репо має бути `.env.example` без секретів).

### 1.1 Обов'язкові змінні для Auth

| Змінна | Опис | Приклад |
|--------|------|---------|
| `DATABASE_URL` | URL підключення до PostgreSQL | `postgresql://user:password@localhost:5432/buero` |
| `JWT_ACCESS_SECRET` | Секрет для підпису **access** JWT. Має бути довгий випадковий рядок. | `your-access-secret-min-32-chars` |
| `JWT_REFRESH_SECRET` | Секрет для підпису **refresh** JWT. Має відрізнятися від access. | `your-refresh-secret-min-32-chars` |
| `JWT_ACCESS_EXPIRES_IN` | TTL access-токена (у секундах або рядок типу `30m`). | `1800` або `30m` |
| `JWT_REFRESH_EXPIRES_IN` | TTL refresh-токена (у секундах або рядок типу `7d`). | `604800` або `7d` |

### 1.2 Змінні для Cookie та CORS

| Змінна | Опис | Приклад |
|--------|------|---------|
| `COOKIE_DOMAIN` | Домен для cookie. Для одного домену (front + api на одному) можна не встановлювати або порожній. | `` або `localhost` |
| `COOKIE_SECURE` | `true` — cookie тільки по HTTPS (production). | `false` (dev), `true` (prod) |
| `CORS_ORIGIN` | Дозволений origin для CORS (фронт). Для одного домену — URL фронту. | `http://localhost:5173` або `https://app.example.com` |
| `NODE_ENV` | `development` / `production` (впливає на Secure, CORS тощо). | `development` |

У production: `COOKIE_SECURE=true`, `CORS_ORIGIN` = фактичний origin фронту, секрети — сильні випадкові значення.

---

## 2. CORS (точка входу API)

Фронт і API на **одному домені** — запити йдуть на той самий origin. CORS має дозволяти цей origin і **credentials** (cookie).

### Що налаштувати

- **Origin:** дозволити тільки довірений origin з `CORS_ORIGIN` (або кілька, залежно від фреймворку).
- **Credentials:** увімкнути передачу cookie (відповідний заголовок або опція фреймворку).
- **Methods:** мінімум `GET, POST, PUT, PATCH, DELETE, OPTIONS`.
- **Headers:** дозволити `Content-Type`, `Authorization` (для fallback Bearer).

---

## 3. Налаштування Cookie

Параметри мають збігатися з **docs/auth-spec.md**.

### Імена cookie

- `access_token` — JWT для доступу до API.
- `refresh_token` — JWT для оновлення пари токенів.

### Параметри при встановленні

- **Path:** `/api` (cookie відправляється тільки на запити до `/api/*`).
- **HttpOnly:** увімкнено (недоступний з JS).
- **SameSite:** `Lax` (один домен).
- **Secure:** з ENV `COOKIE_SECURE` (true в production).
- **Max-Age:** access — 1800 с (30 хв), refresh — 604800 с (7 днів).

### При register / login / refresh

Встановити обидва cookie з цими параметрами; значення — рядки JWT.

### При logout

Відправити відповідь з очищенням обох cookie (ті самі імена та Path=/api, Max-Age=0 або аналог «видалити» у вибраному фреймворку).

### Читання з запиту

Access token має братися з cookie; fallback — заголовок `Authorization: Bearer <token>` (згідно auth-spec). Refresh token — тільки з cookie.

---

## 4. Чеклист перед запуском

- [ ] `.env` заповнено (DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, CORS_ORIGIN, COOKIE_SECURE).
- [ ] `.env` в `.gitignore`; в репо є `.env.example` без секретів.
- [ ] CORS дозволяє origin фронту з `credentials: true`.
- [ ] Cookie встановлюються з Path=/api, HttpOnly, SameSite=Lax, Secure за NODE_ENV/COOKIE_SECURE.
- [ ] Logout очищає cookie (Max-Age=0, той самий Path=/api).

Посилання на логіку auth: **docs/auth-spec.md**.
