import { createSlice, nanoid } from '@reduxjs/toolkit'

const now = () => Date.now()

const seedRooms = [
  {
    id: 'r1',
    title: 'Общий канал',
    participants: ['Admin', 'Demo User'],
    unread: 0,
    pinned: false,
    lastActivity: now(),
    typing: null,
    messages: [
      { id: 'm1', author: 'Admin', body: 'Добро пожаловать в канал!', createdAt: now(), pinned: false },
      { id: 'm2', author: 'Demo User', body: 'Привет! Проверяю связь.', createdAt: now(), pinned: false },
    ],
  },
  {
    id: 'r2',
    title: 'Тактическая группа',
    participants: ['Admin'],
    unread: 2,
    pinned: false,
    lastActivity: now(),
    typing: null,
    messages: [
      { id: 'm3', author: 'Admin', body: 'Держим всё в одном потоке.', createdAt: now(), pinned: false },
    ],
  },
]

const initialState = {
  rooms: seedRooms,
  selectedId: seedRooms[0]?.id || null,
  searchQuery: '',
  onlineUsers: ['Admin', 'Demo User'],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createRoom: {
      reducer(state, action) {
        const room = action.payload
        state.rooms.unshift(room)
        state.selectedId = room.id
      },
      prepare({ title, participants }) {
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
            participants: participants.length ? participants : ['Аноним'],
            unread: 0,
            pinned: false,
            lastActivity: now(),
            typing: null,
            messages: [],
          },
        }
      },
    },
    sendMessage: {
      reducer(state, action) {
        const { roomId, message } = action.payload
        const room = state.rooms.find((r) => r.id === roomId)
        if (!room) return
        room.messages.push(message)
        room.lastActivity = now()
        if (message.author && !room.participants.includes(message.author)) {
          room.participants.push(message.author)
        }
        // Увеличиваем непрочитанные если не текущий чат
        if (roomId !== state.selectedId) {
          room.unread = (room.unread || 0) + 1
        }
      },
      prepare({ roomId, author, body }) {
        return {
          payload: {
            roomId,
            message: {
              id: nanoid(),
              author: author || 'Гость',
              body: body.trim(),
              createdAt: now(),
              pinned: false,
            },
          },
        }
      },
    },
    selectRoom(state, action) {
      const roomId = action.payload
      state.selectedId = roomId
      // Сбрасываем непрочитанные при открытии чата
      const room = state.rooms.find((r) => r.id === roomId)
      if (room) room.unread = 0
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
    togglePinRoom(state, action) {
      const room = state.rooms.find((r) => r.id === action.payload)
      if (room) room.pinned = !room.pinned
    },
    togglePinMessage(state, action) {
      const { roomId, messageId } = action.payload
      const room = state.rooms.find((r) => r.id === roomId)
      if (!room) return
      const message = room.messages.find((m) => m.id === messageId)
      if (message) message.pinned = !message.pinned
    },
    setTyping(state, action) {
      const { roomId, user } = action.payload
      const room = state.rooms.find((r) => r.id === roomId)
      if (room) room.typing = user
    },
    clearTyping(state, action) {
      const room = state.rooms.find((r) => r.id === action.payload)
      if (room) room.typing = null
    },
    deleteMessage(state, action) {
      const { roomId, messageId } = action.payload
      const room = state.rooms.find((r) => r.id === roomId)
      if (room) {
        room.messages = room.messages.filter((m) => m.id !== messageId)
      }
    },
    clearChat(state) {
      state.rooms = []
      state.selectedId = null
      state.searchQuery = ''
    },
  },
})

export const {
  createRoom,
  sendMessage,
  selectRoom,
  setSearchQuery,
  togglePinRoom,
  togglePinMessage,
  setTyping,
  clearTyping,
  deleteMessage,
  clearChat,
} = chatSlice.actions
export default chatSlice.reducer
