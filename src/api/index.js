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

export const api = {
  async listPosts() {
    try {
      const { data } = await client.get('/posts?_limit=8')
      return { data }
    } catch (error) {
      return { error: mapError(error) }
    }
  },

  async createPost(payload) {
    try {
      const { data } = await client.post('/posts', payload)
      return { data }
    } catch (error) {
      return { error: mapError(error) }
    }
  },

  async updatePost(id, payload) {
    try {
      const { data } = await client.patch(`/posts/${id}`, payload)
      return { data }
    } catch (error) {
      return { error: mapError(error) }
    }
  },

  async deletePost(id) {
    try {
      await client.delete(`/posts/${id}`)
      return { data: true }
    } catch (error) {
      return { error: mapError(error) }
    }
  },
}
