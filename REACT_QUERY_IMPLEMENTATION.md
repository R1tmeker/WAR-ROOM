# Интеграция React Query и Обработка ошибок

## Обзор

В этом проекте используется **React Query** (TanStack Query) для эффективного управления состояниями асинхронных запросов и мутаций на сервере. React Query упрощает работу с кешированием, синхронизацией и обновлением данных.

## Архитектура

### 1. Конфигурация QueryClient

**Файл:** [src/app/providers/AppProviders.jsx](src/app/providers/AppProviders.jsx)

```javascript
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Ошибка запроса:', error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Ошибка мутации:', error)
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,      // Данные считаются свежими 30 сек
      cacheTime: 5 * 60_000,  // Кеш хранится 5 минут
      retry: 1,               // Повтор при ошибке 1 раз
      refetchOnWindowFocus: false, // Не переводить при фокусе окна
    },
    mutations: {
      retry: 1,               // Повтор мутации 1 раз
    },
  },
})
```

### 2. Обработка ошибок

#### Глобальная обработка (QueryCache & MutationCache)
- `queryCache.onError`: обрабатывает все ошибки запросов
- `mutationCache.onError`: обрабатывает все ошибки мутаций

#### Локальная обработка на уровне хука
```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  onError: (error) => {
    // Локальная обработка ошибки
    console.error('Ошибка загрузки постов:', error)
  },
})
```

### 3. Использование в компонентах

#### Запросы (useQuery)
Используется в [src/application/hooks/](src/application/hooks/) для загрузки данных:
- `usePosts.js` - загрузка списка постов
- `useUsers.js` - загрузка пользователей
- `useProfile.js` - загрузка профиля

```javascript
const { data: posts, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})
```

#### Мутации (useMutation)
Используется для создания, обновления и удаления данных:

```javascript
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    // Инвалидация кеша после успешной мутации
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
  onError: (error) => {
    console.error('Ошибка создания поста:', error)
  },
})
```

### 4. Инвалидация кеша

После успешной мутации кеш инвалидируется для обновления данных:

```javascript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['posts'] })
}
```

## Преимущества React Query
**Автоматическое кешированием** - данные кешируются автоматически
**Синхронизация** - синхронизация с серверными данными
**Обработка ошибок** - глобальная и локальная обработка
**Состояние загрузки** - встроенные флаги isLoading, isPending
**DevTools** - встроенные инструменты отладки
**Оптимизация** - снижение количества запросов

## Redux vs React Query

В проекте используется оба подхода:
- **Redux (RTK)** - для глобального состояния приложения
- **React Query** - для управления серверными данными и асинхронными операциями

## Инструменты разработки

### React Query DevTools
Доступны в режиме разработки (нижний правый угол):
- Отслеживание всех запросов и мутаций
- Просмотр кеша
- Отладка состояния

## Заключение

React Query значительно упрощает работу с асинхронными операциями в React приложении, предоставляя встроенную обработку ошибок, кеширование и синхронизацию данных с сервером.