import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './slices/postsSlice'
import usersReducer from './slices/usersSlice'
import uiReducer from './slices/uiSlice'
import forumReducer from './slices/forumSlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    ui: uiReducer,
    forum: forumReducer,
    chat: chatReducer,
  },
  devTools: true,
})

export const rootState = () => store.getState()
export const appDispatch = () => store.dispatch
export const { dispatch } = store
export const RootState = store.getState
export const AppDispatch = store.dispatch