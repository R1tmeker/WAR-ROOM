import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../infrastructure/api'

const postsKey = ['posts']

export const usePosts = () => {
  return useQuery({
    queryKey: postsKey,
    queryFn: () => api.listPosts(12),
    staleTime: 30_000,
    cacheTime: 5 * 60_000,
    retry: 1,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    select: (data) => [...data].sort((a, b) => b.id - a.id),
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => api.createPost(payload),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: postsKey })
      const previous = queryClient.getQueryData(postsKey)
      const optimisticPost = { id: Date.now(), ...newPost }
      queryClient.setQueryData(postsKey, (old = []) => [optimisticPost, ...old])
      return { previous, optimisticId: optimisticPost.id }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postsKey, context.previous)
      }
    },
    onSuccess: (data, _vars, context) => {
      queryClient.setQueryData(postsKey, (old = []) =>
        old.map((post) => (post.id === context?.optimisticId ? { ...data, ...post } : post)),
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsKey })
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => api.updatePost(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: postsKey })
      const previous = queryClient.getQueryData(postsKey)
      queryClient.setQueryData(postsKey, (old = []) =>
        old.map((post) => (post.id === id ? { ...post, ...payload } : post)),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postsKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsKey })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => api.deletePost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: postsKey })
      const previous = queryClient.getQueryData(postsKey)
      queryClient.setQueryData(postsKey, (old = []) => old.filter((post) => post.id !== id))
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postsKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsKey })
    },
  })
}

export const usePrefetchPosts = () => {
  const queryClient = useQueryClient()

  return useMemo(
    () => () => queryClient.prefetchQuery({ queryKey: postsKey, queryFn: () => api.listPosts(12) }),
    [queryClient],
  )
}