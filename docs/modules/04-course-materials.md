# Модуль: Course Materials

Матеріали **модуля** курсу (відео, лексика, граматика, квіз, сценарій тощо). Ієрархія: **Course → Module → Material**. CRUD — вчитель; читання — студент з перевіркою доступу до курсу.

---

## 1. Призначення

- **Вчитель:** додавати, редагувати, видаляти матеріали **модуля** (будь-якого курсу). Типи: video, vocabulary, grammar, quiz, scenario, cultural_insight, homework, text.
- **Студент:** отримувати матеріали модуля для навчання (за order_index). Перевірка доступу: запис у **user_course_access** для (user_id, course_id) з активним trial/купівлею/підпискою; курс визначається через **модуль** (material.module.courseId).
- Матеріали в контексті модуля: GET /api/courses/:courseId/modules/:moduleId/materials; GET матеріалу по id — для програвача/квізу.

---

## 2. Дані (таблиці БД)

| Таблиця | Операції |
|---------|----------|
| course_materials | читання, створення, оновлення, видалення (поле **module_id** → course_modules) |
| course_modules | читання (перевірка, що модуль належить курсу) |
| courses | читання (доступ до курсу = доступ до модулів і матеріалів) |

---

## 3. Сервіс

**CourseMaterialService:**

- Список матеріалів **модуля** (за module_id, order_index).
- Один матеріал по id (перевірка: матеріал належить модулю, модуль — курсу; доступ через user_course_access для course_id).
- Створення/оновлення/видалення матеріалу в межах модуля; перевірка, що module.courseId відповідає courseId з шляху.
- Валідація типу та content (для scenario — JSON з нодами/гілками).

---

## 4. Ендпоінти (базові)

| Метод | Шлях | Опис | Роль |
|-------|------|------|------|
| GET | /api/courses/:courseId/modules/:moduleId/materials | Список матеріалів модуля (по order_index). Перевірка доступу до курсу. | авторизований |
| GET | /api/courses/:courseId/modules/:moduleId/materials/:id | Один матеріал (відео/квіз тощо). Перевірка: material належить module, module — course. | авторизований |
| POST | /api/courses/:courseId/modules/:moduleId/materials | Додати матеріал до модуля (module має належати courseId). | teacher |
| PATCH | /api/courses/:courseId/modules/:moduleId/materials/:id | Редагувати матеріал. | teacher |
| DELETE | /api/courses/:courseId/modules/:moduleId/materials/:id | Видалити матеріал. | teacher |

Деталі request/response — на етапі реалізації.

---

## 5. Діаграма

```mermaid
flowchart TB
    subgraph Client
        L[List materials]
        O[One material]
        Cr[Create]
        Up[Update]
        Del[Delete]
    end

    subgraph API
        Ctrl[Course Materials Controller]
    end

    subgraph Service
        S1[listByModule]
        S2[getById]
        S3[create]
        S4[update]
        S5[delete]
    end

    subgraph DB["PostgreSQL"]
        CM[(course_materials)]
        M[(course_modules)]
        C[(courses)]
    end

    L --> Ctrl
    O --> Ctrl
    Cr --> Ctrl
    Up --> Ctrl
    Del --> Ctrl
    Ctrl --> S1
    Ctrl --> S2
    Ctrl --> S3
    Ctrl --> S4
    Ctrl --> S5
    S1 --> CM
    S1 --> M
    S2 --> CM
    S2 --> M
    S3 --> CM
    S3 --> M
    S4 --> CM
    S5 --> CM
```

---

## 6. Відео: хостинг (YouTube) та майбутній варіант (S3)

**Поточне рішення — YouTube.** Відео-матеріали (type = video) зберігаються на YouTube (рекомендовано unlisted для курсів). У полі `content` матеріалу зберігаємо ідентифікатор для вбудовування, наприклад: `{ "youtube_video_id": "dQw4w9WgXcQ" }`. Фронтенд показує відео через iframe або YouTube IFrame Player API. Переваги: нульова вартість хостингу, швидкий старт; недоліки — можлива реклама у вбудованому плеєрі, залежність від політик YouTube.

**Майбутній розвиток — як вирішити питання контролю та реклами.** Якщо з’явиться потреба у повному контролі над плеєром і відсутності реклами (наприклад, скарги студентів або вимоги партнерів), можливий перехід на власне зберігання: **S3-сумісний бакет + CDN**. Схема: відео-файли зберігаються в бакеті; у `content` зберігається `storage_key` (шлях до файлу); бекенд при `GET` матеріалу генерує тимчасовий signed URL і повертає його клієнту; плеєр використовує цей URL. Це дає повний контроль над контентом і відсутність сторонньої реклами. Рекомендується заздалегідь передбачити в структурі `content` підтримку обох варіантів (наприклад поле `video_source: "youtube" | "s3"` та відповідно `youtube_video_id` або `storage_key`), щоб зміна хостингу не вимагала зміни моделі даних.

---

## 7. Примітки

- Сценарії (type = scenario): content — JSON з нодами та гілками; збереження результату проходження — в модулі Progress & Quizzes.
- Прив'язка до рівня студента для MVP не обов'язкова (зафіксовано в architecture).
