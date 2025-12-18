# Архитектура проекта

Подход: **Layered Architecture** с лёгким уклоном на модульность. Основная цель — разделить UI, бизнес-логику, доступ к данным и общее переиспользуемое ядро.

## Слои и папки
```
src/
  app/                  # Инициализация приложения (провайдеры, будущий роутер)
    providers/          # Обёртки над Redux/React Query
  presentation/         # UI-слой: страницы и чистые компоненты
    pages/              # Страницы (контейнеры для экранов)
    components/         # Переиспользуемые UI-компоненты
  application/          # Бизнес-логика и управление состоянием
    store/              # Redux Toolkit store, slices, selectors, hooks
      slices/           # posts, users, ui
      selectors/        # мемо-селекторы
      hooks.js          # useAppDispatch/useAppSelector
    hooks/              # Бизнес-хуки (React Query и пр.)
  domain/               # (зарезервировано) модели/валидации, если понадобится
  infrastructure/       # Доступ к внешним системам
    api/                # HTTP-клиент и endpoints
  shared/               # (резерв) общие утилиты, ui-элементы, константы
  styles.css            # Глобальные стили
```

## Правила импортов
- `presentation` не тянет напрямую `infrastructure`; данные приходят через `application` (store/hooks).
- `application` может обращаться к `infrastructure` (api) и `domain` (модели), но не к `presentation`.
- `shared` доступен всем слоям, но сам не зависит от конкретных фич.
- Провайдеры (Redux, Query) и глобальная инициализация — в `app/`.

## Ключевые модули
- **Redux Toolkit:** `application/store` — стор, слайсы (`posts`, `users`, `ui`), мемо-селекторы и хуки диспатча/селектора.
- **React Query:** конфигурация в `app/providers/AppProviders.jsx`, бизнес-хуки в `application/hooks` (оптимистичные обновления, prefetch).
- **API:** `infrastructure/api/index.js` — axios-клиент, обёртка ошибок, CRUD по постам и пользователям.
- **UI:** `presentation/components` — чистые компоненты (PostForm, PostList, PostRow, Spinner), `presentation/pages/App.jsx` — экран.

## Обоснование выбора Layered Architecture (кратко)
- Проект мал/средний, один разработчик: Layered проще внедрить и поддерживать, чем Clean/FSD.
- Чёткие зависимости позволяют масштабировать: можно добавлять feature-папки внутри presentation/application без ломки базовой схемы.
- Снижается смешение ответственности: UI отделён от бизнес-логики и API.

## Правила расширения
- Новые бизнес-функции: хуки в `application/hooks`, состояние в `application/store`, UI в `presentation`.
- Новые внешние источники данных: адаптеры в `infrastructure/`.
- Общие утилиты/константы: `shared/`.
- При усложнении добавить алиасы путей и модульные стили.

## Naming
См. `NAMING_GUIDELINES.md` (компоненты — PascalCase, хуки — use* camelCase, константы — SCREAMING_SNAKE_CASE, файлы компонентов — PascalCase).

## Примеры кода по слоям
- UI: `presentation/components/PostList.jsx` — только отображение, без API/стора.
- Бизнес/состояние: `application/store/slices/postsSlice.js` — правила изменения стейта и thunks.
- Доступ к данным: `infrastructure/api/index.js` — HTTP-клиент и обработка ошибок.
- Провайдеры: `app/providers/AppProviders.jsx` — единая точка подключения Redux/React Query/DevTools.
