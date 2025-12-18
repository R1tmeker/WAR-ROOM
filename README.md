# WAR ROOM

Учебный React-проект, демонстрирующий работу с HTTP-методами (GET, POST, PATCH, DELETE) через публичный API JSONPlaceholder. Используется `axios`, запросы вынесены в `src/infrastructure/api`. Проект интегрирован с **React Query (@tanstack/react-query)** и **Redux Toolkit** для глобального состояния и асинхронных операций.

## Возможности
- Загрузка списка постов (GET `/posts`)
- Создание поста через форму (POST `/posts`)
- Редактирование поста (PATCH `/posts/:id`)
- Удаление поста (DELETE `/posts/:id`)
- Индикаторы загрузки и вывод ошибок
- Кэширование и управление состояниями запроса через React Query
- Оптимистичные обновления для создания/редактирования/удаления постов
- React Query DevTools в режиме разработки
- Глобальное состояние через Redux Toolkit (посты, пользователи, состояние редактирования), мемо-селекторы, createAsyncThunk

## Запуск
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите дев-сервер:
   ```bash
   npm run dev
   ```
3. Откройте адрес из консоли (обычно http://localhost:5173).

## React Query
- Подключение провайдера: `AppProviders` (`app/providers/AppProviders.jsx`) оборачивает Redux + React Query с базовыми настройками `staleTime`, `cacheTime`, `retry`.
- DevTools: `ReactQueryDevtools` в режиме разработки.
- Ключи запросов:
   - `['posts']` — список постов (рефетч каждую минуту, сортировка в `select`).
   - `['users']` — список пользователей (для выбора автора).
   - `['profile', userId]` — зависимый запрос профиля выбранного автора.
- Мутации:
   - Создание, обновление, удаление поста с оптимистичными обновлениями (`onMutate/onError/onSettled`).
- Prefetching: предзагрузка списка постов при наведении на кнопку «Обновить список».
- Dependent queries: профиль пользователя подгружается только при выбранном `userId` (`enabled`).
- Опции `select` используются для сортировки и уменьшения лишних ререндеров.

## Структура (Layered)
- `src/app` — инициализация (провайдеры: Redux, React Query).
- `src/presentation/pages` — страницы (например, `App.jsx`).
- `src/presentation/components` — UI-компоненты (список, форма, спиннер).
- `src/application/store` — Redux Toolkit: store, хуки, slices (posts, users, ui), селекторы.
- `src/application/hooks` — бизнес-хуки (React Query и др.).
- `src/infrastructure/api` — функции для работы с API (axios + обработка ошибок).
- `src/shared` — (зарезервировано) утилиты/константы/общие ui.

## Redux Toolkit
- Store в `src/application/store/index.js`, Provider в `app/providers/AppProviders.jsx`.
- Slices: `posts` (CRUD + pending/error), `users` (список авторов), `ui` (editingId, editDraft, selectedUserId).
- Async thunks: `fetchPosts`, `createPost`, `updatePost`, `deletePost`, `fetchUsers`.
- Селекторы: мемоизированные `selectSortedFilteredPosts`, `selectIsLoading`, `selectPendingAction`, `selectUsers` и др.
- Интеграция в компоненты: `App.jsx` и `PostForm.jsx` используют `useAppDispatch/useAppSelector` вместо локальных useState/useEffect для данных постов и пользователей.

## Архитектура
- Подход: Layered (presentation / application / infrastructure + app и shared).
- Документация: `ARCHITECTURE.md` (описание слоёв, правил импортов) и `NAMING_GUIDELINES.md` (конвенции именования).

## Заметки
API JSONPlaceholder — муляж: данные на сервере не сохраняются, но ответы эмулируются, что удобно для отработки HTTP-методов.
React Query кэширует ответы и оптимистично обновляет UI; при ошибке состояние откатывается.
