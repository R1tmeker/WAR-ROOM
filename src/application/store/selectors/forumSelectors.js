import { createSelector } from '@reduxjs/toolkit'

const selectForumState = (state) => state.forum

export const selectTopics = createSelector([selectForumState], (forum) => forum.topics)
export const selectSelectedTopicId = createSelector([selectForumState], (forum) => forum.selectedId)

export const selectSelectedTopic = createSelector(
  [selectTopics, selectSelectedTopicId],
  (topics, id) => topics.find((t) => t.id === id) || null,
)
