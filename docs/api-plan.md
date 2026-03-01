# План реалізації API (модулі, сервіси, контролери)

Загальний план backend API: розбиття на модулі, відповідальність кожного, порядок реалізації. Деталі ендпоінтів та діаграми — в окремих файлах **docs/modules/**.

---

## 1. Модулі та залежності

| № | Модуль | Опис | Залежить від |
|---|--------|------|--------------|
| 0 | **Auth** | Реєстрація, логін, refresh, logout. User Service, JWT, cookie. | — |
| 1 | **Users** | Профіль поточного користувача (GET/PATCH). Не прив'язаний до вчителя. | Auth |
| 2 | **Placement Test** | Питання з БД, відправка відповідей, збереження рівня, підтвердження trial. | Auth, Users |
| 3 | **Courses** | CRUD курсів (teacher); список всіх курсів для студента (MVP: без фільтра за рівнем). | Auth |
| 4 | **Course Materials** | CRUD матеріалів курсу (teacher); читання матеріалу (студент). | Auth, Courses |
| 5 | **Progress & Quizzes** | Прогрес по матеріалах/курсах; покрокове збереження відповідей квізу; рекомендований наступний курс за рівнем. | Auth, Users, Course Materials |
| 6 | **Subscriptions & Billing** | Купівля/підписка на курс (Checkout з course_id), user_course_access, Customer Portal, webhook Stripe. | Auth, Users, Courses |
| 7 | **Lesson Requests** | Студент створює запит; вчитель приймає/відхиляє та виставляє completed/rejected. | Auth, Users |

---

## 2. Структура модуля (загальний підхід)

Кожен модуль описується окремим MD у **docs/modules/**:

- **Призначення** — що робить модуль, які дані обробляє.
- **Таблиці БД** — які сутності читає/змінює.
- **Сервіс(и)** — бізнес-логіка (без HTTP).
- **Контролери / ендпоінти** — список ендпоінтів, коротко що роблять (детальні специфікації — по мірі реалізації).
- **Діаграма** — один flowchart або sequence для flow модуля.

Детальні плани кожного ендпоінта (request/response, коди помилок) описуємо пізніше в процесі розробки.

---

## 3. Порядок реалізації

1. **Auth** — вже описано в docs/auth-spec.md; реалізація першою.
2. **Users** — профіль me (GET/PATCH), потрібен для Placement і всього далі.
3. **Placement Test** — рівень і trial, потрібен для контенту та підписки.
4. **Courses** — база контенту.
5. **Course Materials** — матеріали курсу.
6. **Progress & Quizzes** — прогрес і квізи (в т.ч. покрокове збереження відповідей).
7. **Subscriptions & Billing** — Stripe Checkout, webhook, статус, Portal, історія платежів.
8. **Lesson Requests** — запити на заняття, вчитель приймає/відхиляє та виставляє статус.

---

## 4. Файли модулів

| Файл | Модуль |
|------|--------|
| docs/auth-spec.md | Auth (вже існує) |
| docs/modules/01-users.md | Users |
| docs/modules/02-placement-test.md | Placement Test |
| docs/modules/03-courses.md | Courses |
| docs/modules/04-course-materials.md | Course Materials |
| docs/modules/05-progress-quizzes.md | Progress & Quizzes |
| docs/modules/06-subscriptions-billing.md | Subscriptions & Billing |
| docs/modules/07-lesson-requests.md | Lesson Requests |

---

## 5. Перетин з архітектурою

- **Ролі:** студент (навчання, профіль, підписка, запити на заняття); вчитель (адмін контенту: курси, матеріали; приймає запити на заняття, виставляє completed/rejected).
- **Доступ до контенту:** курси продаються окремо; доступ до матеріалів курсу перевіряється по user_course_access (trial, купівля, підписка на курс). Каталог — всі опубліковані курси (docs/architecture.md, Business Rules).
- **Рівень:** тільки змінюється в процесі навчання; студент не редагує level вручну.
- **Trial:** запис створюється після підтвердження користувачем пробного періоду (після Placement Test).

Посилання: **docs/architecture.md**, **docs/auth-spec.md**, **docs/auth-config.md**.
