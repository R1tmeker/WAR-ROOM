import { useQuery } from '@tanstack/react-query'
import { api } from '../../infrastructure/api'

const usersKey = ['users']

export const useUsers = () => {
  return useQuery({
    queryKey: usersKey,
    queryFn: () => api.listUsers(),
    staleTime: 5 * 60_000,
    cacheTime: 10 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export const usePrefetchUser = () => {
  return { queryKey: usersKey }
}