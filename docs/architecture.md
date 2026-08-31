# Платформа вивчення німецької мови — Architecture & Database Design (MVP)

**Тема проекту:** Розробка онлайн-платформи для вивчення німецької мови з інтегрованою моделлю соціокультурної адаптації на основі інтерактивних навчальних сценаріїв.

---

## 1. Overview

**MVP платформи:**

- Навчання через **quiz** та **відео-уроки** (відео вбудовані в квізи/модулі).
- **Вчитель** створює курси та контент, але не веде заняття — тільки автор контенту.
- **Курси продаються окремо:** не підписка на весь сервіс, а **купівля/підписка на конкретний курс**. Кожен курс має власну тему навчання та інтеграцію (соціокультурний контекст за темою курсу). Оплата — разова купівля курсу через WayForPay.
- **Дві ролі:** Student (той, хто вчиться), Teacher (той, хто створює контент). Адмін-роль не передбачена.
- **Placement Test** → визначення рівня (A1–B2) → Trial: доступ до **одного** курсу на обмежений період (наприклад за рекомендацією за рівнем).
- **Інтерактивні сценарії** з гілками вибору (Scenario Engine), культурний контекст вбудований у курси.
- **Integration & Life in Germany** — не окремий блок, а **категорія курсів** (sociocultural); кожен курс включає інтеграцію за своєю темою.
- Підтримка мов інтерфейсу: **EN / DE**.
- **PostgreSQL** як єдине сховище даних (без Redis для MVP).
- Без форумів/чатів у MVP.

---

## 2. System Architecture

### Компоненти

| Компонент    | Опис |
|-------------|------|
| **Frontend** | Landing, кабінет студента (курси, квізи, прогрес), кабінет вчителя (створення курсів/матеріалів). |
| **Backend API** | Auth (JWT + refresh у Postgres), Users, Courses & Materials, Progress, Quiz/Scenario, Subscriptions, WayForPay Webhooks. |
| **WayForPay** | Платіжна сторінка (разова купівля курсу), serviceUrl-callback, CHECK_STATUS. |

### Authentication

- Реєстрація: email + password (bcrypt).
- **JWT:** access token (короткий TTL), refresh token зберігається в **Postgres** (таблиця `refresh_tokens`).
- Logout / інвалідація: revoke refresh token (blacklist через `revoked_at`).
- Ролі: `student` | `teacher`; доступ до API за роллю.

### Payments (WayForPay)

- Картки не зберігаються; оплата відбувається на платіжній сторінці WayForPay.
- Разова купівля курсу: `payments` створюється зі статусом `pending` та унікальним `order_reference`.
- **Trial** активується після проходження Placement Test: студент отримує доступ до **одного** курсу на обмежений період (запис у `user_course_access` з типом trial).
- Webhooks: верифікація HMAC-MD5 підпису, ідемпотентність через таблицю `payment_webhook_events`.
- Stripe виведено з експлуатації; історичні записи лишаються в `payments` з `provider = 'stripe'`.

---

## 3. Database Schema

### 3.1 users

| Column             | Type      | Notes |
|--------------------|-----------|--------|
| id                 | PK, UUID  | |
| email              | string    | UNIQUE |
| password_hash      | string    | bcrypt |
| role               | enum      | `student` \| `teacher` |
| language           | enum      | `en` \| `de` (мова UI) |
| stripe_customer_id | string    | nullable, один customer на user для Stripe Portal |
| deleted_at         | timestamp | nullable, soft delete (GDPR) |
| created_at         | timestamp | |
| updated_at         | timestamp | |

### 3.2 refresh_tokens

Зберігання refresh-токенів у Postgres (вимога НФ/Ф-001).

| Column     | Type      | Notes |
|------------|-----------|--------|
| id         | PK        | |
| user_id    | FK → users| |
| token_hash | string    | хеш токена |
| expires_at | timestamp | |
| revoked_at | timestamp | nullable |
| created_at | timestamp | |

### 3.3 student_profiles

| Column      | Type      | Notes |
|-------------|-----------|--------|
| id          | PK        | |
| user_id     | FK → users| UNIQUE (1-1) |
| level       | enum      | nullable, `A1` \| `A2` \| `B1` \| `B2` (результат Placement Test) |
| timezone    | string    | IANA, напр. Europe/Kyiv |
| trial_ends_at | timestamp | nullable, кінець trial після Placement Test |
| created_at  | timestamp | |
| updated_at  | timestamp | |

### 3.4 teacher_profiles

Вчитель лише створює контент; оплати по годинах немає.

| Column     | Type      | Notes |
|------------|-----------|--------|
| id         | PK        | |
| user_id    | FK → users| UNIQUE (1-1) |
| bio        | text      | nullable |
| is_active  | boolean   | |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.5 courses

Контент: мовні модулі та соціокультурні (Integration & Life in Germany) — одна модель, різниця за `category`.

| Column       | Type      | Notes |
|--------------|-----------|--------|
| id           | PK        | |
| teacher_id   | FK → users| nullable, хто створив (для історії); не використовується для обмеження доступу — будь-який вчитель може редагувати будь-який курс |
| title        | string    | |
| description  | text      | nullable |
| language     | enum      | `en` \| `de` (мова контенту) |
| category     | enum      | `language` \| `sociocultural` (Integration/Life in Germany) |
| is_published | boolean   | |
| created_at   | timestamp | |
| updated_at   | timestamp | |

### 3.6 course_modules

Курс складається з **модулів**; модуль — з матеріалів. Ієрархія: **Course → Module → Material**. Окрема таблиця для модулів (варіант A).

| Column      | Type       | Notes |
|-------------|------------|--------|
| id          | PK         | |
| course_id   | FK → courses | |
| title       | string     | назва модуля |
| order_index | int        | порядок модуля в курсі |
| created_at  | timestamp  | |
| updated_at  | timestamp  | |

**Доступ до модулів:** окремої таблиці доступу немає. Доступ до модулів і матеріалів визначається доступом до **курсу**: наявність запису в **user_course_access** для (user_id, course_id) з активним trial, purchase або subscription. Вчитель має доступ до всіх модулів усіх курсів.

### 3.7 course_materials

Один тип контенту для всього: відео, лексика, граматика, квіз, сценарій, культурна вставка, домашнє завдання. Матеріал належить **модулю** (не напряму курсу). **Відео:** хостинг — YouTube (MVP); у `content` для type = video зберігаємо `youtube_video_id` для embed. Деталі — у модулі Course Materials (04-course-materials.md).

| Column      | Type       | Notes |
|-------------|------------|--------|
| id          | PK         | |
| module_id   | FK → course_modules | |
| type        | enum       | `video` \| `vocabulary` \| `grammar` \| `quiz` \| `scenario` \| `cultural_insight` \| `homework` \| `text` |
| title       | string     | |
| content     | text/json  | для scenario — JSON з нодами та гілками; для video — мінімум `youtube_video_id` |
| order_index | int        | порядок **всередині модуля** |
| created_at  | timestamp  | |
| updated_at  | timestamp  | |

**Сценарій (type = scenario):** `content` — JSON, наприклад:

- `nodes`: масив `{ id, type: "situation"|"choice"|"consequence"|"explanation", text, choices?: [{ text, nextNodeId, isCorrect, feedback }] }`.
- Мінімум 3 гілки на сценарій (Ф-004); збереження результату проходження — у `quiz_attempts` або окремому полі в `course_progress`. Курс для матеріалу визначається через `material.module.courseId`.

### 3.7.1 material_attachments

Додаткові файли та посилання до уроку (матеріалу). Не обов'язкові: урок можна зберегти без вкладень. Файли (PDF, зображення, документи) зберігаються в Cloudinary; посилання — як URL. Студент бачить список під уроком. Доступ до списку = доступ до матеріалу (курс / trial).

| Column      | Type       | Notes |
|-------------|------------|--------|
| id          | PK         | |
| material_id | FK → course_materials | cascade delete |
| kind        | enum       | `file` \| `link` |
| title       | string     | |
| url         | string     | Cloudinary `secure_url` або зовнішнє посилання |
| file_name   | string     | nullable; оригінальна назва файлу |
| mime_type   | string     | nullable |
| size_bytes  | int        | nullable |
| storage_key | string     | nullable; `{resource_type}:{public_id}` для видалення з Cloudinary |
| order_index | int        | порядок під уроком |
| created_at  | timestamp  | |
| updated_at  | timestamp  | |

### 3.8 user_course_access

Доступ студента до курсу: купівля, trial або підписка на цей курс. Один запис на пару (user_id, course_id). Перевірка доступу до контенту курсу — наявність активного запису (trial_ends_at > now() для trial, або активна підписка, або access_type = purchase).

| Column           | Type      | Notes |
|------------------|-----------|--------|
| id               | PK        | |
| user_id          | FK → users| |
| course_id        | FK → courses | |
| access_type      | enum      | `trial` \| `purchase` \| `subscription` |
| trial_ends_at    | timestamp | nullable; для trial — до якої дати доступ |
| subscription_id  | FK → subscriptions | nullable; для access_type = subscription |
| payment_id       | FK → payments | nullable; для разової купівлі (access_type = purchase) |
| created_at       | timestamp | |

**Унікальність:** UNIQUE(user_id, course_id). Один тип доступу на курс на користувача (при купівлі після trial оновлюємо запис на purchase і заповнюємо payment_id).

### 3.9 subscriptions

Підписка на **конкретний курс** (або помісячна підписка на курс). Користувач може мати кілька підписок — по одній на кожен курс.

| Column                 | Type      | Notes |
|------------------------|-----------|--------|
| id                     | PK        | |
| user_id                | FK → users| |
| course_id              | FK → courses | **підписка на цей курс** |
| stripe_customer_id     | string    | копія для зручності (канонічне в users) |
| stripe_subscription_id | string    | UNIQUE (ідемпотентність webhook) |
| status                 | enum      | `active` \| `past_due` \| `canceled` \| `incomplete` \| `trialing` |
| current_period_start   | timestamp | nullable |
| current_period_end     | timestamp | nullable |
| canceled_at            | timestamp | nullable |
| cancellation_reason    | text      | nullable |
| created_at             | timestamp | |
| updated_at             | timestamp | |

**Обмеження:** один активний subscription на пару (user_id, course_id): partial unique `(user_id, course_id) WHERE status IN ('active', 'trialing')`.

### 3.10 payments

| Column            | Type      | Notes |
|-------------------|-----------|--------|
| id                | PK        | |
| user_id           | FK → users| |
| course_id         | FK → courses | nullable; для разової купівлі курсу |
| subscription_id   | FK → subscriptions | nullable; історичні платежі по підписці |
| provider          | string    | `wayforpay` (default) або `stripe` для історичних записів |
| order_reference   | string    | UNIQUE, nullable; ідентифікатор замовлення WayForPay |
| stripe_invoice_id | string    | UNIQUE, nullable; лише історичні Stripe-платежі |
| amount            | decimal   | |
| currency          | string    | |
| status            | string    | `pending` → `paid` / `failed` |
| created_at        | timestamp | |
| updated_at        | timestamp | |

### 3.11 payment_webhook_events

Ідемпотентність обробки callback-ів платіжного провайдера.

| Column       | Type      | Notes |
|--------------|-----------|--------|
| id           | PK        | |
| provider     | string    | `wayforpay` |
| event_key    | string    | UNIQUE, `orderReference:transactionStatus:reasonCode` |
| processed_at | timestamp | |

Таблиця `stripe_webhook_events` лишається лише як історія обробки Stripe-подій.

### 3.12 course_progress

Прогрес по курсах/матеріалах (завершені модулі, відсоток, рекомендований крок).

| Column           | Type       | Notes |
|------------------|------------|--------|
| id               | PK         | |
| user_id          | FK → users | |
| course_id        | FK → courses | |
| course_material_id| FK → course_materials | nullable (можна агрегувати тільки по course) |
| completed_at     | timestamp  | |
| score            | decimal    | nullable, % або бали |
| created_at       | timestamp  | |

Унікальність: один запис на (user_id, course_id, course_material_id) для "пройдено матеріал", або один запис на (user_id, course_id) з оновленням прогресу — залежить від логіки (наприклад UNIQUE(user_id, course_id, course_material_id)).

### 3.13 quiz_attempts

Результати проходження квізів та сценаріїв. **Кожна відповідь зберігається окремо** (покроково), щоб користувач міг продовжити квіз після переривання без повторного проходження.

| Column           | Type       | Notes |
|------------------|------------|--------|
| id               | PK         | |
| user_id          | FK → users | |
| course_material_id | FK → course_materials | |
| score            | decimal    | nullable до завершення |
| answers_snapshot | jsonb      | проміжні відповіді по блоках (для resume) |
| completed_at     | timestamp  | nullable поки не завершено |
| created_at       | timestamp  | |

Окрема таблиця **quiz_attempt_answers** (опціонально): attempt_id, block_index або question_id, answer, created_at — для збереження кожної відповіді окремо; альтернатива — накопичувати в answers_snapshot.

### 3.14 lesson_requests

Запит на заняття: студент створює запит; **вчитель** приймає або відхиляє, далі виставляє статус «пройшло» або «відхилено». Вчитель після прийняття зв’язується з користувачем поза платформою.

| Column        | Type      | Notes |
|---------------|-----------|--------|
| id            | PK        | |
| student_id    | FK → users| |
| teacher_id    | FK → users| nullable, вчитель, який прийняв запит |
| preferred_time| text/timestamp | бажаний час (можна text для MVP) |
| message       | text      | nullable |
| status        | enum      | `pending` \| `accepted` \| `completed` \| `rejected` |
| created_at    | timestamp | |
| updated_at    | timestamp | |

**Логіка:** pending → вчитель приймає (accepted, teacher_id заповнюється) → вчитель виставляє completed або rejected.

### 3.15 placement_questions (один тест визначення рівня)

Питання **одного** тесту визначення рівня (Placement Test). **Не прив'язані до курсу** — це єдиний глобальний тест для визначення A1–B2 при старті.

| Column       | Type       | Notes |
|--------------|------------|--------|
| id           | PK         | |
| level        | enum       | nullable, `A1` \| `A2` \| `B1` \| `B2` — складність/діапазон питання в межах одного placement-тесту |
| question_data| jsonb      | текст питання, варіанти відповідей, правильна відповідь тощо |
| order_index  | int        | порядок у тесті |
| created_at   | timestamp  | |
| updated_at   | timestamp  | |

Рівень студента визначається за кількістю правильних відповідей (MVP).

### 3.16 Тести в кінці курсів

**Усі інші тести** (у кінці кожного курсу, на підвищення рівня) **прив'язані до курсу**. Вони реалізуються як **course_materials** з **type = quiz** — тобто матеріал модуля (module_id → course_modules.course_id), а не окрема таблиця тестів.

- Питання такого тесту: або в полі **content** (JSON) цього матеріалу, або в окремій таблиці **quiz_questions** з **course_material_id** (FK → course_materials).
- Проходження зберігається в **quiz_attempts** (course_material_id). Після успішного проходження тесту в кінці курсу можна оновлювати **student_profiles.level** (модуль Progress & Quizzes).

### 3.17 placement_results (опціонально)

Історія проходжень Placement Test. Для MVP достатньо оновлення `student_profiles.level`.

| Column      | Type      | Notes |
|-------------|-----------|--------|
| id          | PK        | |
| user_id     | FK → users| |
| level       | enum      | A1 \| A2 \| B1 \| B2 |
| raw_score   | int       | nullable |
| completed_at| timestamp | |

---

## 4. Діаграма архітектури бази даних (ER)

Нижче — ER-діаграма основних сутностей та зв’язків. Службова таблиця `stripe_webhook_events` не показана для стислості.

```mermaid
erDiagram
    users ||--o| student_profiles : "1-1"
    users ||--o| teacher_profiles : "1-1"
    users ||--o{ refresh_tokens : has
    users ||--o{ user_course_access : has
    users ||--o{ subscriptions : has
    users ||--o{ payments : has
    courses ||--o{ user_course_access : "access to"
    courses ||--o{ course_modules : contains
    course_modules ||--o{ course_materials : contains
    course_materials ||--o{ material_attachments : has
    users ||--o{ course_progress : has
    users ||--o{ quiz_attempts : has
    users ||--o{ lesson_requests : "student requests"

    users {
        uuid id PK
        string email
        string password_hash
        enum role "student|teacher"
        enum language "en|de"
        string stripe_customer_id
        timestamp deleted_at
        timestamp created_at
        timestamp updated_at
    }

    student_profiles {
        uuid id PK
        uuid user_id FK
        enum level "A1|A2|B1|B2"
        string timezone
        timestamp trial_ends_at
        timestamp created_at
        timestamp updated_at
    }

    teacher_profiles {
        uuid id PK
        uuid user_id FK
        text bio
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    refresh_tokens {
        uuid id PK
        uuid user_id FK
        string token_hash
        timestamp expires_at
        timestamp revoked_at
        timestamp created_at
    }

    courses {
        uuid id PK
        uuid teacher_id FK
        string title
        text description
        enum language "en|de"
        enum category "language|sociocultural"
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }

    course_modules {
        uuid id PK
        uuid course_id FK
        string title
        int order_index
        timestamp created_at
        timestamp updated_at
    }

    course_materials {
        uuid id PK
        uuid module_id FK
        enum type "video|vocabulary|grammar|quiz|scenario|cultural_insight|homework|text"
        string title
        text content
        int order_index
        timestamp created_at
        timestamp updated_at
    }

    material_attachments {
        uuid id PK
        uuid material_id FK
        enum kind "file|link"
        string title
        string url
        string file_name
        string mime_type
        int size_bytes
        string storage_key
        int order_index
        timestamp created_at
        timestamp updated_at
    }

    user_course_access {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        enum access_type "trial|purchase|subscription"
        timestamp trial_ends_at
        uuid subscription_id FK
        uuid payment_id FK
        timestamp created_at
    }

    subscriptions {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        string stripe_subscription_id
        enum status "active|trialing|past_due|canceled|incomplete"
        timestamp current_period_start
        timestamp current_period_end
        timestamp canceled_at
        text cancellation_reason
        timestamp created_at
        timestamp updated_at
    }

    payments {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        uuid subscription_id FK
        string stripe_invoice_id
        decimal amount
        string currency
        string status
        timestamp created_at
    }

    course_progress {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        uuid course_material_id FK
        timestamp completed_at
        decimal score
        timestamp created_at
    }

    quiz_attempts {
        uuid id PK
        uuid user_id FK
        uuid course_material_id FK
        decimal score
        jsonb answers_snapshot
        timestamp completed_at
    }

    lesson_requests {
        uuid id PK
        uuid student_id FK
        uuid teacher_id FK
        string preferred_time
        text message
        enum status "pending|accepted|completed|rejected"
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ courses : "teacher creates"
    courses ||--o{ course_modules : contains
    course_modules ||--o{ course_materials : contains
    course_materials ||--o{ material_attachments : has
```

**Схема зв’язків (текстом):**

- **users** — ядро: студенти мають student_profiles, вчителі — teacher_profiles; один user — один профіль за роллю.
- **courses** — належать teacher; мають **category** (`language` | `sociocultural`); кожен курс — окремий продукт (своя тема, інтеграція).
- **course_modules** — модулі курсу; ієрархія **Course → Module → Material**. Доступ до модулів = доступ до курсу (user_course_access), окремої таблиці доступу до модулів немає.
- **course_materials** — елементи **модуля** (відео, квіз, сценарій тощо); сценарії з гілками в `content` (JSON). Матеріали типу **quiz** — тести в кінці курсу або в модулі.
- **material_attachments** — файли (Cloudinary) і посилання, прикріплені до матеріалу; студент бачить їх під уроком.
- **user_course_access** — доступ студента до курсу: trial, purchase або subscription на цей курс; UNIQUE(user_id, course_id).
- **subscriptions** / **payments** — підписка та платежі **прив’язані до курсу** (subscriptions.course_id, payments.course_id); один активний subscription на (user_id, course_id).
- **course_progress** + **quiz_attempts** — прогрес і результати квізів/сценаріїв.
- **lesson_requests** — студент створює запит; вчитель приймає/відхиляє, виставляє completed/rejected.
- **refresh_tokens** — зберігання refresh-токенів у Postgres для JWT (logout / ротація).

---

## 5. Webhook Processing (WayForPay)

**Endpoint:** `POST /api/webhooks/wayforpay` (serviceUrl)

- Перевірка HMAC-MD5 підпису за полями
  `merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode`.
- Ідемпотентність: перед обробкою `INSERT INTO payment_webhook_events (event_key)`; при UNIQUE conflict — пропустити.
- Відповідь завжди підписана: `{ orderReference, status: "accept", time, signature }` — інакше WayForPay повторює callback кілька діб.

| transactionStatus | Дія в БД |
|-------------------|----------|
| `Approved` | payment.status = paid; створити/оновити user_course_access (`purchase`, trial_ends_at = null). |
| `InProcessing`, `Pending`, `WaitingAuthComplete` | Нічого не змінювати, чекати наступний callback. |
| `Declined`, `Expired` | payment.status = failed (лише якщо був `pending`). |
| `Refunded`, `Voided` | Записати в лог; доступ не змінюється автоматично. |

**Endpoint:** `POST`/`GET /api/webhooks/wayforpay/return` (returnUrl) — WayForPay повертає браузер
клієнта POST-формою; backend редіректить на `${CORS_ORIGIN}/purchase/success?orderReference=...`
(або `/purchase/cancel` для неуспішних статусів).

**Запасний шлях:** `POST /api/subscriptions/sync-checkout` викликає CHECK_STATUS у WayForPay, коли
студент повернувся на сайт раніше за callback.

---

## 6. Business Rules (коротко)

- **Доступ до контенту курсу:** студент має доступ до курсу тільки якщо є активний запис у **user_course_access** для (user_id, course_id): trial (trial_ends_at > now()), або purchase, або активна підписка. **Доступ до модулів і матеріалів** визначається тим самим: окремої таблиці доступу до модулів немає — якщо є доступ до курсу, є доступ до всіх його модулів і матеріалів. Список курсів (каталог) — всі опубліковані; перегляд модулів/матеріалів і прогрес — лише по курсах, до яких є доступ.
- **Placement Test** обов’язковий для визначення рівня; один глобальний тест (placement_questions); результат у `student_profiles.level`. Після підтвердження trial — створити запис **user_course_access** для **одного** курсу (наприклад рекомендованого за рівнем) з access_type = trial та trial_ends_at = now() + N днів.
- **Рівень:** оновлюється автоматично в навчанні. Вчитель — адмін контенту: курси/матеріали; приймає запити на заняття. Будь-який вчитель може створювати/редагувати/видаляти будь-який курс. Поле `courses.teacher_id` — «хто створив», не для обмеження доступу.
- Один активний subscription на пару (user_id, course_id). Купівля курсу (разова) створює user_course_access з access_type = purchase та payment_id.
- Integration & Life in Germany — курси з `courses.category = 'sociocultural'`. Рекомендований наступний крок — наступний курс за рівнем (модуль Progress).

---

## 7. Security & NFR (з requirements)

- HTTPS, bcrypt для паролів, JWT (access + refresh у Postgres), rate limiting, CORS.
- Картки не зберігаються; платіжна сторінка WayForPay + верифікація підпису callback.
- Перевірка прав доступу до модуля; за потреби — заборона "перескочити" рівень без проходження попереднього (логіка в бекенді на основі `course_progress` та `level`).

Session management: у MVP без Redis — сесії через JWT; refresh токени в Postgres. НФ-002 (Redis для session) для MVP не застосовуємо.

---

## 8. Індекси (рекомендовані)

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE UNIQUE INDEX idx_user_course_access_user_course ON user_course_access(user_id, course_id);
CREATE INDEX idx_user_course_access_user_id ON user_course_access(user_id);
CREATE INDEX idx_user_course_access_course_id ON user_course_access(course_id);
CREATE UNIQUE INDEX idx_subscriptions_user_course_active ON subscriptions(user_id, course_id) WHERE status IN ('active', 'trialing');
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_course_id ON subscriptions(course_id);
CREATE UNIQUE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_materials_module_id ON course_materials(module_id);
CREATE INDEX idx_course_progress_user_course ON course_progress(user_id, course_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_lesson_requests_student ON lesson_requests(student_id);
CREATE INDEX idx_lesson_requests_teacher ON lesson_requests(teacher_id);
CREATE UNIQUE INDEX idx_stripe_webhook_events_event_id ON stripe_webhook_events(stripe_event_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE UNIQUE INDEX idx_payments_order_reference ON payments(order_reference);
CREATE UNIQUE INDEX idx_payment_webhook_events_event_key ON payment_webhook_events(event_key);
```

---

## 9. Minimal MVP Flow

1. Реєстрація (Student/Teacher).
2. **Student:** проходження Placement Test → збереження рівня; підтвердження trial → доступ до **одного** курсу на обмежений період (user_course_access).
3. Каталог курсів (всі опубліковані); перегляд матеріалів і проходження — лише по курсах, до яких є доступ (user_course_access).
4. Збереження прогресу (course_progress, quiz_attempts).
5. Купівля курсу (WayForPay, разова оплата з course_id) → pending payment → callback → user_course_access; продовження доступу після trial або новий курс.
6. Опційно: "Request a lesson" (lesson_requests → обробка вручну).

---

## 10. Tech Stack (MVP)

| Шар        | Технологія |
|------------|------------|
| Backend API| Node.js    |
| DB         | PostgreSQL |
| ORM        | Prisma     |
| Payments   | WayForPay (платіжна сторінка, serviceUrl-webhook, CHECK_STATUS) |
| Auth       | JWT (access + refresh у Postgres) |
| Кеш/сесії  | Не використовуємо Redis у MVP |

---

## 11. Підсумок

- **Ядро:** users (student/teacher), student_profiles (level), teacher_profiles, courses (category = language | sociocultural), **course_modules** (модулі курсу), course_materials (типи: video, quiz, scenario, …; належать модулю).
- **Доступ до курсу:** user_course_access (trial / purchase / subscription на кожен курс); перевірка доступу до матеріалів — по цій таблиці.
- **Навчання:** прогрес у course_progress та quiz_attempts; сценарії з гілками — JSON у content.
- **Білінг:** курси продаються окремо, разовою оплатою через WayForPay; payments (з course_id, provider, order_reference) + payment_webhook_events для ідемпотентності callback-ів.
- **Спрощене "урок":** lesson_requests без календаря.
- **Integration & Life in Germany** — курси з `category = 'sociocultural'`; кожен курс включає тему та інтеграцію за нею.

Далі можна додати: деталізацію JSON-схеми для сценаріїв, приклади API endpoints, або окремий файл `billing.md` для WayForPay та політики повернення коштів.
