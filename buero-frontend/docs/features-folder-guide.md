# Папка `src/features/` — навіщо вона і як з нею працювати

## 1. Навіщо потрібна папка features

- **Одна фіча — одне місце.** Усе, що стосується авторизації (форми логіну, API, валідація), лежить у `features/auth/`. Так легше знайти код і змінювати одну область без розкиду по проєкту.
- **Чіткі межі.** Сторінки (`pages/`) лише збирають готові блоки з `features/` та `components/layout`, `components/ui`. Бізнес-логіка й доменні компоненти живуть у features.
- **Масштабування.** Нову фічу (наприклад, notifications) додаємо як окрему папку `features/notifications/` без ламання існуючого коду.
- **Імпорти.** Є один barrel-файл `src/features/index.ts` — імпорт через `import { auth, landing } from "@/features"` або з `src/features`.

У **features не кладуть**: глобальний layout (Header, Footer), загальні UI-компоненти (Button, Input, Card), а також **Redux** — усі слайси та стейт залишаються в `src/redux/` (окремо від фіч).

---

## 2. Структура однієї фічі

Кожна фіча — це папка з опційними підпапками **без redux** (Redux окремо в `src/redux/slices/`):

```text
src/features/
  auth/
    index.ts          ← barrel + JSDoc (посилання на doc, перелік підпапок)
    components/       ← LoginForm, RegisterForm, ResetPasswordForm
    api/              ← authApi.ts (виклики /auth/*)
    validation/       ← authSchemas.ts (Zod-схеми для форм)
  landing/
    index.ts
    components/       ← Hero, WhyBuro, BeyondClassroom
  placement-test/
    index.ts
    components/       ← тест, прогрес-бар, summary
  ...
```

У кожному `index.ts` — JSDoc з посиланням на відповідний документ у `docs/frontend-features/` і перелік запланованих підпапок. Це нагадування, що саме має жити в цій фічі; поступово туди додаються реальні файли.

---

## 3. Як імпортувати (barrel)

У проєкті є загальний barrel **`src/features/index.ts`**:

```ts
export * as auth from "./auth";
export * as landing from "./landing";
export * as placementTest from "./placement-test";
// ...
```

**Приклад імпорту:**

```ts
import { auth, landing, coursesCatalog } from "@/features";
// або
import { auth } from "@/features";
```

Поки у кожної фічі в `index.ts` лише `export {}`, такі імпорти дають порожні об’єкти. Коли в фічі з’являться компоненти, їх реекспортують з `features/<name>/index.ts`.

Приклад подальшого реекспорту з фічі (без redux):

```ts
// src/features/auth/index.ts
export { LoginForm, RegisterForm } from "./components";
export { loginSchema, registerSchema } from "./validation/authSchemas";
```

Тоді в місці використання:

```tsx
import { LoginForm, RegisterForm } from "@/features/auth";
```

Або імпорт напряму з папки фічі:

```tsx
import { LoginForm } from "@/features/auth/components/LoginForm";
```

---

## 4. Redux окремо від features

**Redux у проєкті зберігається лише в `src/redux/`.** У фічах немає папки `redux/` і не планується переносити туди слайси.

- Усі слайси: `src/redux/slices/` (auth, user, placementTest, coursesCatalog, courseLearning, progressQuizzes, subscriptions, lessonRequests).
- `rootReducer.ts` імпортує редьюсери тільки з `src/redux/slices/`.
- Компоненти фіч використовують стейт через `useSelector`/`useDispatch` та селектори/actions з `@/redux/slices/<name>/`.

Такий поділ дає єдине місце для всього глобального стейту і не змішує його з структурою фіч (компоненти, API, валідація).

---

## 5. Повний приклад: фіча auth

Як може виглядати фіча auth (без redux):

**Структура:**

```text
src/features/auth/
  index.ts
  components/
    LoginForm.tsx
    RegisterForm.tsx
  api/
    authApi.ts
  validation/
    authSchemas.ts
```

**`features/auth/index.ts`** (реекспорт):

```ts
export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";
export { loginSchema, registerSchema } from "./validation/authSchemas";
```

**Сторінка** (`AuthPage`) імпортує компоненти фічі; стейт (auth slice) — з Redux:

```tsx
import { LoginForm, RegisterForm } from "@/features/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/slices/auth";
```

Так папка `features/auth` містить лише UI та валідацію авторизації; Redux залишається в `src/redux/`.

---

## 6. Документація по фічах

Опис кожної фічі (сторінки, форми, API) — у файлах:

- `docs/frontend-features/00-landing-ui.md`
- `docs/frontend-features/01-auth-ui.md`
- … (див. зміст папки `docs/frontend-features/`).

У кожного `src/features/<name>/index.ts` у JSDoc є посилання на відповідний документ. Стейт і редьюсери описані в архітектурі та в `src/redux/`.
