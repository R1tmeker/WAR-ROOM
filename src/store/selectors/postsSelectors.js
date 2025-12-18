import { createSelector } from '@reduxjs/toolkit'

const selectPostsState = (state) => state.posts

export const selectPosts = createSelector([selectPostsState], (posts) => posts.items)
export const selectPostsStatus = createSelector([selectPostsState], (posts) => posts.status)
export const selectPostsError = createSelector([selectPostsState], (posts) => posts.error)
export const selectPostsFilter = createSelector([selectPostsState], (posts) => posts.filter)
export const selectPendingAction = createSelector([selectPostsState], (posts) => posts.pendingAction)

export const selectSortedFilteredPosts = createSelector(
  [selectPosts, selectPostsFilter],
  (items, filter) => {
    const text = (filter || '').toLowerCase()
    const filtered = text
      ? items.filter(
          (p) => p.title.toLowerCase().includes(text) || p.body.toLowerCase().includes(text),
        )
      : items
    return [...filtered].sort((a, b) => (b.id || 0) - (a.id || 0))
  },
)

export const selectIsLoading = createSelector(
  [selectPostsStatus, selectPendingAction],
  (status, pending) => status === 'loading' || (pending && pending.type === 'load'),
)

export const selectIsBusy = createSelector([selectPendingAction], (pending) => Boolean(pending))
