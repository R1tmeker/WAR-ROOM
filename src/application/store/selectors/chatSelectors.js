import { createSelector } from '@reduxjs/toolkit'

const selectChatState = (state) => state.chat

export const selectRooms = createSelector([selectChatState], (chat) => chat.rooms)
export const selectSelectedRoomId = createSelector([selectChatState], (chat) => chat.selectedId)
export const selectSearchQuery = createSelector([selectChatState], (chat) => chat.searchQuery)
export const selectOnlineUsers = createSelector([selectChatState], (chat) => chat.onlineUsers || [])

export const selectSelectedRoom = createSelector(
  [selectRooms, selectSelectedRoomId],
  (rooms, id) => rooms.find((r) => r.id === id) || null,
)

export const selectFilteredRooms = createSelector(
  [selectRooms, selectSearchQuery],
  (rooms, query) => {
    if (!query.trim()) return rooms
    const q = query.toLowerCase()
    return rooms.filter((r) => r.title.toLowerCase().includes(q))
  },
)

export const selectPinnedRooms = createSelector([selectRooms], (rooms) =>
  rooms.filter((r) => r.pinned),
)

export const selectUnpinnedRooms = createSelector([selectRooms], (rooms) =>
  rooms.filter((r) => !r.pinned),
)

export const selectTotalUnread = createSelector([selectRooms], (rooms) =>
  rooms.reduce((sum, r) => sum + (r.unread || 0), 0),
)
