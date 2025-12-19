import { useEffect, useMemo } from 'react'
import { PostForm } from '../components/PostForm'
import { PostList } from '../components/PostList'
import { PostsActions } from '../components/PostsActions'
import { Spinner } from '../components/Spinner'
import { useAppDispatch, useAppSelector } from '../../application/store/hooks'
import { fetchPosts, createPost, updatePost, deletePost } from '../../application/store/slices/postsSlice'
import {
  selectSortedFilteredPosts,
  selectIsLoading,
  selectPendingAction,
  selectPostsError,
} from '../../application/store/selectors/postsSelectors'
import { selectEditDraft, selectEditingId } from '../../application/store/selectors/uiSelectors'
import { cancelEdit, setEditField, startEdit } from '../../application/store/slices/uiSlice'

export default function App() {
  const dispatch = useAppDispatch()

  const posts = useAppSelector(selectSortedFilteredPosts)
  const isLoading = useAppSelector(selectIsLoading)
  const pendingAction = useAppSelector(selectPendingAction)
  const error = useAppSelector(selectPostsError)

  const editingId = useAppSelector(selectEditingId)
  const editDraft = useAppSelector(selectEditDraft)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const handleCreate = ({ title, body, userId }) => {
    dispatch(createPost({ title, body, userId: Number(userId) || 1 }))
  }

  const handleStartEdit = (post) => {
    dispatch(startEdit({ id: post.id, title: post.title, body: post.body }))
  }

  const handleCancelEdit = () => {
    dispatch(cancelEdit())
  }

  const handleEditField = (key, value) => {
    dispatch(setEditField({ key, value }))
  }

  const handleSaveEdit = (id) => {
    dispatch(updatePost({ id, payload: editDraft }))
    dispatch(cancelEdit())
  }

  const handleDelete = (id) => {
    dispatch(deletePost(id))
  }

  const isBusy = Boolean(pendingAction && pendingAction.type !== 'load')
  const currentAction = useMemo(() => pendingAction, [pendingAction])
  const showLoading = isLoading
  const combinedError = error
  const isError = Boolean(combinedError)
  const sortedPosts = posts

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>WAR ROOM</h1>
          <p className="subtitle">GET / POST / PATCH / DELETE в действии (JSONPlaceholder)</p>
        </div>
        <div className="controls">
          <button onClick={() => dispatch(fetchPosts())} disabled={isLoading}>
            {showLoading ? (
              <span className="row" style={{ alignItems: 'center' }}>
                <Spinner /> Обновление...
              </span>
            ) : (
              'Обновить список'
            )}
          </button>
        </div>
      </header>

      <PostForm onSubmit={handleCreate} disabled={isBusy} />

      <PostsActions />

      <div className="status-bar">
        <p className="status-text">
          {showLoading
            ? 'Загрузка...'
            : isBusy
              ? 'Выполняется запрос...'
              : 'Готов к работе'}
        </p>
        {currentAction?.type && <span className="badge">{currentAction.type.toUpperCase()}</span>}
      </div>

      {isError && <div className="error">{combinedError}</div>}

      <PostList
        posts={sortedPosts}
        editingId={editingId}
        editDraft={editDraft}
        onStartEdit={handleStartEdit}
        onEditField={handleEditField}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onDelete={handleDelete}
        action={currentAction}
      />
    </div>
  )
}