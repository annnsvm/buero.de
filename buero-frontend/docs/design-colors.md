# Design Colors — семантичні кольори

У проєкті використовується **рольова (семантична)** назва кольорів: кожен токен описує **призначення** кольору в інтерфейсі, а не відтінок.

## Текст (Text)

| Токен (CSS-змінна) | Призначення |
|--------------------|-------------|
| `--color-text-primary` | Основний текст (заголовки, параграфи) |
| `--color-text-secondary` | Другорядний текст (підписи, мітки, placeholder) |
| `--color-text-inverse` | Текст на темному фоні |
| `--color-text-on-accent` | Текст на кнопках/акцентному фоні (наприклад, CTA) |

## Фон (Surface)

| Токен | Призначення |
|-------|-------------|
| `--color-surface-background` | Фон сторінки / основного контейнера |
| `--color-surface-section` | Фон секцій, блоків, альтернативний фон |
| `--color-surface-card` | Фон карток |
| `--color-surface-overlay` | Фон оверлеїв, модалок, dropdown |

## Межі (Border)

| Токен | Призначення |
|-------|-------------|
| `--color-border-subtle` | Найменш помітні межі |
| `--color-border-default` | Стандартні межі (інпути, картки) |
| `--color-border-strong` | Підкреслені межі, роздільники |

## Акценти (Accent)

| Токен | Призначення |
|-------|-------------|
| `--color-accent-primary` | Основний акцент (CTA, лінки, активні стани) |
| `--color-accent-primary-hover` | Hover для primary |
| `--color-accent-secondary` | Другорядний акцент (secondary-кнопки) |
| `--color-accent-secondary-hover` | Hover для secondary |
| `--color-accent-danger` | Небезпечні дії, помилки |

## Де визначено

- **Тема:** `src/styles/index.css` (блок `@theme`).
- Базові кольори (Cinnabar, Torea Bay, neutrals) залишаються примітивами; семантичні токени посилаються на них.
- Для зворотної сумісності старі змінні (`--color-primary`, `--color-background` тощо) залишені як alias на нові семантичні.

## Використання в Tailwind CSS

Токени оголошені в `@theme` з префіксом `--color-*`, тому Tailwind автоматично генерує утиліти: **текст** — `text-*`, **фон** — `bg-*`, **бордер** — `border-*`, **ring** — `ring-*` тощо. Ім’я класу = частина після `--color-` (наприклад, `--color-text-primary` → `text-primary` не вийде, бо клас буде `text-text-primary`). Нижче — два способи використання.

### 1. Утиліти з теми (рекомендовано)

У Tailwind v4 змінні з `@theme { --color-... }` стають кольорами теми. Клас будується так: **префікс утиліти** + **ім’я кольору** (все після `--color-`).

| Токен | Текст | Фон | Бордер | Ring |
|-------|--------|-----|--------|------|
| `--color-text-primary` | `text-text-primary` | `bg-text-primary` | `border-text-primary` | `ring-text-primary` |
| `--color-text-secondary` | `text-text-secondary` | — | — | — |
| `--color-surface-background` | — | `bg-surface-background` | — | — |
| `--color-surface-section` | — | `bg-surface-section` | — | — |
| `--color-border-default` | — | — | `border-border-default` | — |
| `--color-accent-primary` | `text-accent-primary` | `bg-accent-primary` | `border-accent-primary` | `ring-accent-primary` |

**Приклади класів:**

```html
<!-- Основний текст -->
<p class="text-text-primary">Заголовок</p>

<!-- Другорядний текст -->
<span class="text-text-secondary">Підпис</span>

<!-- Фон секції -->
<section class="bg-surface-section">...</section>

<!-- Картка з межею -->
<div class="bg-surface-card border border-border-default rounded-xl">...</div>

<!-- Кнопка primary -->
<button class="bg-accent-primary text-text-on-accent hover:bg-accent-primary-hover">
  CTA
</button>

<!-- Лінк-акцент -->
<a href="#" class="text-accent-primary hover:text-accent-primary-hover">Детальніше</a>

<!-- Focus ring -->
<input class="border-border-default focus:ring-2 focus:ring-accent-primary" />
```

Для **hover** використовуй відповідні токени з `-hover`: `hover:bg-accent-primary-hover`, `hover:border-border-strong` тощо.

### 2. Arbitrary value

Якщо клас з теми не підходить (наприклад, потрібен кастомний CSS), використовуй arbitrary value з `var()`:

```html
<div class="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] text-[var(--color-text-primary)]">
  Контент
</div>
```

У Tailwind це записується як `[var(--color-...)]` — у квадратних дужках будь-який CSS-вираз.

### 3. Підсумок по категоріях

- **Текст:** `text-text-primary`, `text-text-secondary`, `text-text-inverse`, `text-text-on-accent`
- **Фон:** `bg-surface-background`, `bg-surface-section`, `bg-surface-card`, `bg-surface-overlay`
- **Бордер:** `border-border-subtle`, `border-border-default`, `border-border-strong`, `border-accent-primary` (акцентна рамка)
- **Акценти:** `bg-accent-primary`, `text-accent-primary`, `hover:bg-accent-primary-hover`, `bg-accent-danger`
