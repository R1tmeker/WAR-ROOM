import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api'

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  filter: '',
  pendingAction: null, // { type: 'create'|'update'|'delete'|'load', id?: number }
}

export const fetchPosts = createAsyncThunk('posts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await api.listPosts(12)
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Не удалось загрузить посты')
  }
})

export const createPost = createAsyncThunk('posts/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await api.createPost(payload)
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Не удалось создать пост')
  }
})

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await api.updatePost(id, payload)
      return { id, data }
    } catch (error) {
      return rejectWithValue(error.message || 'Не удалось обновить пост')
    }
  },
)

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try {
    await api.deletePost(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Не удалось удалить пост')
  }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload || ''
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.pendingAction = { type: 'load' }
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
        state.pendingAction = null
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
        state.pendingAction = null
      })

      .addCase(createPost.pending, (state) => {
        state.pendingAction = { type: 'create' }
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        const payload = action.meta.arg || {}
        const created = action.payload || {}
        const id = created.id ?? Date.now()
        state.items = [{ ...payload, ...created, id }, ...state.items]
        state.pendingAction = null
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload || action.error.message
        state.pendingAction = null
      })

      .addCase(updatePost.pending, (state, action) => {
        const id = action.meta.arg?.id
        state.pendingAction = { type: 'update', id }
        state.error = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const { id, data } = action.payload || {}
        state.items = state.items.map((item) =>
          item.id === id ? { ...item, ...(action.meta.arg?.payload || {}), ...(data || {}) } : item,
        )
        state.pendingAction = null
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload || action.error.message
        state.pendingAction = null
      })

      .addCase(deletePost.pending, (state, action) => {
        const id = action.meta.arg
        state.pendingAction = { type: 'delete', id }
        state.error = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const id = action.payload
        state.items = state.items.filter((item) => item.id !== id)
        state.pendingAction = null
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload || action.error.message
        state.pendingAction = null
      })
  },
})

export const { setFilter, clearError } = postsSlice.actions
export default postsSlice.reducer
