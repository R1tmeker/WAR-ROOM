import axios from 'axios'

const client = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
})

const mapError = (error) => {
  if (error.response) {
    return `API вернул статус ${error.response.status}`
  }
  if (error.request) {
    return 'Сервер не ответил. Проверьте соединение.'
  }
  return 'Неизвестная ошибка запроса'
}

const throwable = async (fn) => {
  try {
    return await fn()
  } catch (error) {
    const message = mapError(error)
    throw new Error(message)
  }
}

export const api = {
  listPosts(limit = 12) {
    return throwable(async () => {
      const { data } = await client.get(`/posts?_limit=${limit}`)
      return data
    })
  },

  createPost(payload) {
    return throwable(async () => {
      const { data } = await client.post('/posts', payload)
      return data
    })
  },

  updatePost(id, payload) {
    return throwable(async () => {
      const { data } = await client.patch(`/posts/${id}`, payload)
      return data
    })
  },

  deletePost(id) {
    return throwable(async () => {
      await client.delete(`/posts/${id}`)
      return true
    })
  },

  listUsers() {
    return throwable(async () => {
      const { data } = await client.get('/users')
      return data
    })
  },

  getUser(id) {
    return throwable(async () => {
      const { data } = await client.get(`/users/${id}`)
      return data
    })
  },
}