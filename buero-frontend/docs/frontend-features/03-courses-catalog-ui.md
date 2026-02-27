## 03. Courses Catalog UI

### 1. Призначення feature

Feature **Courses Catalog UI** відповідає за сторінку `/courses`:

- відображення списку курсів з фільтрами та пошуком;
- показ бейджів рівня, категорії (`language` / `sociocultural`), trial/premium;
- інтеграцію з доступом за підпискою/trial (див. `.cursor/rules/stripe-and-access.mdc`, `docs/modules/03-courses.md`, `06-subscriptions-billing.md`).

---

### 2. Сторінки та компоненти

#### 2.1. Сторінка

- `pages/CoursesCatalogPage/CoursesCatalogPage.tsx`:
  - shell для каталогу, підключає feature-компоненти та layout.

#### 2.2. Feature-компоненти (`src/features/courses-catalog/`)

- `CoursesCatalogFilters`:
  - фільтри:
    - рівень (A1–B2);
    - категорія (`language` / `sociocultural`);
    - search (рядок);
  - debounce для пошуку.
- `CoursesCatalogList`:
  - сітка карток курсів.
- `CourseCard` (може бути в UI, якщо переюзабельна):
  - title, category badge, level badge, короткий опис, «Free trial» badge, CTA «View course».
- `EmptyState`:
  - якщо курсів немає (фільтри занадто суворі).
- `AccessGuardBanner`:
  - банер, якщо немає активного trial/pідписки (з CTA «Start assessment» / «Subscribe»).

#### 2.3. UI-компоненти

- `Select`, `MultiSelect`, `SearchInput`, `Button`, `Badge`, `Card`, `SkeletonCardGrid`, `Pagination`.

---

### 3. State (Redux, persist)

#### 3.1. Redux slice: `coursesCatalog`

Папка: `src/features/courses-catalog/redux/coursesCatalogSlice.ts`.

Поля:

- `filters`:
  - `level?: 'A1' | 'A2' | 'B1' | 'B2'`;
  - `category?: 'language' | 'sociocultural'`;
  - `search?: string`;
  - `page: number`, `pageSize: number`.
- `items`: масив курсів.
- `totalCount`: загальна кількість курсів.
- `isLoading: boolean`.
- `error: string | null`.

Thunks:

- `fetchCoursesCatalog`:
  - робить `GET /api/courses` із query-параметрами (filters, pagination).

#### 3.2. Persist

- Можна (опційно) зберігати останні вибрані фільтри/сторінку в persist, щоб користувач повертався до попереднього стану каталогу.

---

### 4. Форми та валідація

Каталог не має форм із сабмітом у звичайному сенсі; фільтри працюють реактивно:

- RHF можна не використовувати; достатньо контролю статусу через локальний/Redux-стан.
- Валідація полягає в коректній побудові query-рядка для API (наприклад, не відправляти порожні фільтри).

---

### 5. API

Використовуються endpoints модуля Courses:

- `GET /api/courses`:
  - параметри:
    - `page`, `pageSize`;
    - `category`;
    - (опційно) `search`.
  - для студента:
    - доступ лише при активній підписці або trial (інакше бекенд може повертати 403/402 згідно `.cursor/rules/stripe-and-access.mdc`).

Frontend:

- при завантаженні `/courses`:
  - спочатку перевіряє доступ (див. Subscriptions feature);
  - потім робить `fetchCoursesCatalog`.

---

### 6. Error Handling & Skeletons

- **Skeletons**:
  - при `isLoading = true`:
    - показати `SkeletonCardGrid` (наприклад, 6–8 placeholder-карток).
- **Errors**:
  - 403/402 (немає доступу):
    - не показувати помилку як «failure», а рендерити `AccessGuardBanner` з CTA на assessment/subscription.
  - інші помилки (network/500):
    - показати Alert + кнопку «Retry».

Локальний Error Boundary для каталогу:

- `CatalogErrorBoundary` може обгортати контент сторінки `/courses` і показувати fallback, якщо рендер падає.

---

### 7. Mermaid-flow основного сценарію

```mermaid
flowchart LR
  A[/courses/] --> B[Check access via subscriptions slice]
  B -->|No trial/subscription| C[Render AccessGuardBanner<br/>CTA to assessment/subscription]
  B -->|Has access| D[dispatch(fetchCoursesCatalog)]
  D --> E[Render filters + SkeletonCardGrid]
  E --> F[Receive courses]
  F --> G[Render CourseCard grid]

  G --> H{User changes filters/search/page}
  H -->|Yes| D
  G --> I[Click CourseCard]
  I --> J[/courses/:courseId]
```

