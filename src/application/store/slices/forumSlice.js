import { createSlice, nanoid } from '@reduxjs/toolkit'

const seedTopics = [
  {
    id: 't1',
    title: 'Новые тактики',
    description: 'Делимся фишками и короткими заметками.',
    author: 'Admin',
    messages: [
      { id: 'm1', author: 'Admin', body: 'Проверьте новые шаблоны отчётов.', createdAt: Date.now() },
    ],
  },
  {
    id: 't2',
    title: 'Вопросы по API',
    description: 'Задайте вопрос по JSONPlaceholder/React Query.',
    author: 'Demo User',
    messages: [
      { id: 'm2', author: 'Demo User', body: 'Как лучше обрабатывать ошибки?', createdAt: Date.now() },
    ],
  },
]

const initialState = {
  topics: seedTopics,
  selectedId: seedTopics[0]?.id || null,
}

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    createTopic: {
      reducer(state, action) {
        const topic = action.payload
        state.topics.unshift(topic)
        state.selectedId = topic.id
      },
      prepare({ title, description, author }) {
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
            description: description.trim(),
            author: author || 'Аноним',
            messages: [],
          },
        }
      },
    },
    addMessage: {
      reducer(state, action) {
        const { topicId, message } = action.payload
        const topic = state.topics.find((t) => t.id === topicId)
        if (!topic) return
        topic.messages.push(message)
      },
      prepare({ topicId, author, body }) {
        return {
          payload: {
            topicId,
            message: {
              id: nanoid(),
              author: author || 'Аноним',
              body: body.trim(),
              createdAt: Date.now(),
            },
          },
        }
      },
    },
    selectTopic(state, action) {
      state.selectedId = action.payload
    },
    clearForum(state) {
      state.topics = []
      state.selectedId = null
    },
  },
})

export const { createTopic, addMessage, selectTopic, clearForum } = forumSlice.actions
export default forumSlice.reducer
