import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = 'https://api.example.com/reviews' // Замените на реальный URL

// Получение всех отзывов
const fetchReviews = async () => {
  const { data } = await axios.get(API_URL)
  return data
}

// Удаление отзыва
const deleteReviewApi = async (id) => {
  await axios.delete(`${API_URL}/${id}`)
  return id
}

export function useReviews() {
  const queryClient = useQueryClient()

  // Получение отзывов через React Query
  const {
    data: reviews = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 1000 * 60, // 1 мин
  })

  // Мутация для удаления отзыва
  const deleteMutation = useMutation({
    mutationFn: deleteReviewApi,
    onSuccess: () => {
      // Инвалидируем кеш после успешного удаления
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  const deleteReview = async (id) => {
    await deleteMutation.mutateAsync(id)
  }

  return {
    reviews,
    loading,
    error,
    deleteReview,
  }
}
