import { createSelector } from '@reduxjs/toolkit'

const selectUiState = (state) => state.ui

export const selectEditingId = createSelector([selectUiState], (ui) => ui.editingId)
export const selectEditDraft = createSelector([selectUiState], (ui) => ui.editDraft)
export const selectSelectedUserId = createSelector([selectUiState], (ui) => ui.selectedUserId)
