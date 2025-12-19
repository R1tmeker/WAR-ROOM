import { createSelector } from '@reduxjs/toolkit'

const selectUsersState = (state) => state.users

export const selectUsers = createSelector([selectUsersState], (users) => users.items)
export const selectUsersStatus = createSelector([selectUsersState], (users) => users.status)
export const selectUsersError = createSelector([selectUsersState], (users) => users.error)

// Количество пользователей
export const selectUsersCount = createSelector([selectUsers], (items) => items.length)

// Уникальные компании (аналог категорий/студий)
export const selectUniqueCompanies = createSelector([selectUsers], (items) =>
	Array.from(new Set(items.map((u) => u?.company?.name).filter(Boolean))),
)

// Мемоизированный фильтр по имени / юзернейму / email
export const makeSelectFilteredUsers = (search) =>
	createSelector([selectUsers], (items) => {
		const q = (search || '').trim().toLowerCase()
		if (!q) return items
		return items.filter((u) => {
			const name = (u?.name || '').toLowerCase()
			const username = (u?.username || '').toLowerCase()
			const email = (u?.email || '').toLowerCase()
			return name.includes(q) || username.includes(q) || email.includes(q)
		})
	})