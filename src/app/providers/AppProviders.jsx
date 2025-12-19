import React from 'react'
import { Provider } from 'react-redux'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store } from '../../application/store'
import { AuthProvider } from './AuthContext'

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
      staleTime: 30_000,
      cacheTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

export function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {import.meta.env.DEV && (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          )}
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  )
}