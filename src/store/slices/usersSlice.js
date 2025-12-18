import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await api.listUsers()
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Не удалось загрузить пользователей')
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export const { clearUsers } = usersSlice.actions
export default usersSlice.reducer
