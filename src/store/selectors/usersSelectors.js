import { createSelector } from '@reduxjs/toolkit'

const selectUsersState = (state) => state.users

export const selectUsers = createSelector([selectUsersState], (users) => users.items)
export const selectUsersStatus = createSelector([selectUsersState], (users) => users.status)
export const selectUsersError = createSelector([selectUsersState], (users) => users.error)
