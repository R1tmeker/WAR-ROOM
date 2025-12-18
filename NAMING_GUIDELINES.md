# Naming Guidelines

Единые правила именования для проекта (React + Redux Toolkit + React Query) в layered-структуре.

## Общие принципы
- Читабельность важнее краткости.
- Одна ответственность — одно имя: не смешиваем домены в названии.
- Консистентность: одинаковые сущности называем одинаково в коде и файлах.

## Компоненты (UI)
- Имена: PascalCase, существительные/словосочетания (`PostList`, `AppShell`).
- Файлы компонентов: PascalCase (`PostList.jsx`).
- Экспорт по умолчанию допустим для страниц, именованный — для переиспользуемых компонентов.

## Хуки
- Имена: `use` + PascalCase/вербальное (`usePosts`, `usePostsCrud`).
- Файлы: camelCase с префиксом `use` (`usePosts.js`).

## Утилиты и хелперы
- Имена функций: camelCase (`formatDate`, `buildQuery`).
- Файлы: kebab-case или camelCase по смыслу (`format-date.js` или `formatDate.js`).

## Константы
- SCREAMING_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_PAGE_SIZE`).
- Файлы: kebab-case (`api-constants.js`).

## Типы / модели (если появится TS или JSDoc typedef)
- PascalCase с суффиксом по смыслу (`User`, `UserDto`, `PostModel`).

## Redux / состояние
- Слайсы: `somethingSlice` (camelCase в файле, PascalCase в типах) — файл kebab-case (`postsSlice.js`).
- Селекторы: `selectEntity`, `selectEntityList`, мемо-селекторы в `selectors/`.
- Thunks: глагол-сущность (`fetchPosts`, `createPost`).

## Файлы и директории
- Директории фич/слоёв: kebab-case или осмысленные (`application`, `infrastructure`, `presentation`).
- В `presentation/components` — файлы компонентов PascalCase.
- В `application/hooks` — файлы `useSomething.js`.
- В `shared`/`utils` — kebab-case.

## Стили
- Глобальные стили: `styles.css` (или `global.css`).
- Модульные стили (если появятся): PascalCase+`.module.css` для компонентов.

## Импорты
- Избегаем относительных лесенок глубже `../../..` — при росте вводим алиасы.
- Не используем default-export там, где важна читаемость набора (селекторы, утилиты) — предпочитаем именованные.

## Примеры «до/после»
- Компонент: `post-list.jsx` ➜ `PostList.jsx`
- Хук: `posts.js` ➜ `usePosts.js`
- Константа: `ApiBaseUrl` ➜ `API_BASE_URL`
- Утилита: `MakeRequest.js` ➜ `makeRequest.js`
