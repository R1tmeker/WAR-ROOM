import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export const profileKey = (id) => ['profile', id]

export const useProfile = (id) => {
  return useQuery({
    queryKey: profileKey(id),
    queryFn: () => api.getUser(id),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
    cacheTime: 10 * 60_000,
    retry: 1,
  })
}
