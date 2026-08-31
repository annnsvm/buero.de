# Course editor (teacher)

Логіка та UI-блоки для екрана створення / редагування курсу. **Композиція сторінки** — у `pages/CourseManagmentPage/CourseManagmentPage.tsx`.

## Хуки (`hooks/`)

| Файл | Роль |
|------|------|
| `useCourseEditor.ts` | Оркестратор: збирає підхуки та повертає props для сторінки |
| `state/useCourseEditorState.ts` | `useForm` + усі `useState` редактора + похідні (`totalMaterialsCount`, `resetEditorToEmpty`) |
| `router/useCourseEditorRouter.ts` | `navigate`, `location`, `routeCourseId` з маршруту edit |
| `tree/useCourseEditorTree.ts` | `syncCourseDurationHours`, `fetchCourseTree` (GET дерева + синхронізація duration) |
| `useCourseEditorStructureDnd.ts` | Persist reorder (`PATCH /courses/:id/structure`) only after course Save changes → Confirm |
| `effects/useCourseEditorEffects.ts` | Ефекти: скидання на create/management, завантаження курсу по `routeCourseId` |
| `handlers/useCourseEditorHandlers.ts` | Усі API-операції та обробники (submit, delete, publish, матеріали, модалка модуля) |

## Спільні хелпери (`features/course-managment/helpers/`)

| Файл | Роль |
|------|------|
| `courseEditorFormApiPayload.helpers.ts` | Тіло POST/PATCH курсу з форми (`buildCourseCreatePayload` / `buildCourseUpdatePayload`) |
| `courseMaterialApiPayload.helpers.ts` | Контент матеріалу для API |
| `mapApiCourseToCourseEditorForm.helpers.ts` | Мапінг відповіді API → форма |

`utils/parseApiErrorMessage.ts` — текст помилок з API.

**Компоненти:** `components/`. Спільні блоки: `components/CourseManagementWorkspace/`.
