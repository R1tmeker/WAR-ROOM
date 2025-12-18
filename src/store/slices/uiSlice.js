import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  editingId: null,
  editDraft: { title: '', body: '' },
  selectedUserId: 1,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startEdit(state, action) {
      const { id, title, body } = action.payload
      state.editingId = id
      state.editDraft = { title: title || '', body: body || '' }
    },
    setEditField(state, action) {
      const { key, value } = action.payload
      state.editDraft = { ...state.editDraft, [key]: value }
    },
    cancelEdit(state) {
      state.editingId = null
      state.editDraft = { title: '', body: '' }
    },
    setSelectedUserId(state, action) {
      state.selectedUserId = Number(action.payload) || 1
    },
    resetUi(state) {
      state.editingId = null
      state.editDraft = { title: '', body: '' }
      state.selectedUserId = 1
    },
  },
})

export const { startEdit, setEditField, cancelEdit, setSelectedUserId, resetUi } = uiSlice.actions
export default uiSlice.reducer
