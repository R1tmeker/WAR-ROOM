import { useMemo, useState } from 'react'
import { PostForm } from './components/PostForm'
import { PostList } from './components/PostList'
import { Spinner } from './components/Spinner'
import {
  useCreatePost,
  useDeletePost,
  usePosts,
  usePrefetchPosts,
  useUpdatePost,
} from './hooks/usePosts'

export default function App() {
  const { data: posts = [], isLoading, isFetching, isError, error, refetch } = usePosts()

  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const deletePost = useDeletePost()
  const prefetchPosts = usePrefetchPosts()

  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({ title: '', body: '' })

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.id - a.id),
    [posts],
  )

  const handleCreate = ({ title, body, userId }) => {
    createPost.mutate({ title, body, userId: Number(userId) || 1 })
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setEditDraft({ title: post.title, body: post.body })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft({ title: '', body: '' })
  }

  const handleEditField = (key, value) => {
    setEditDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveEdit = (id) => {
    updatePost.mutate({ id, payload: editDraft })
    cancelEdit()
  }

  const handleDelete = (id) => {
    deletePost.mutate(id)
  }

  const currentAction = useMemo(() => {
    if (updatePost.isPending) return { type: 'update', id: updatePost.variables?.id }
    if (deletePost.isPending) return { type: 'delete', id: deletePost.variables }
    if (createPost.isPending) return { type: 'create' }
    if (isFetching) return { type: 'load' }
    return null
  }, [createPost.isPending, deletePost.isPending, deletePost.variables, isFetching, updatePost.isPending, updatePost.variables])

  const isBusy = createPost.isPending || updatePost.isPending || deletePost.isPending
  const showLoading = isLoading || isFetching
  const combinedError = error?.message || createPost.error?.message || updatePost.error?.message || deletePost.error?.message

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>WAR ROOM</h1>
          <p className="subtitle">GET / POST / PATCH / DELETE в действии (JSONPlaceholder)</p>
        </div>
        <div className="controls">
          <button onClick={() => refetch()} onMouseEnter={prefetchPosts} disabled={isLoading}>
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

      {isError && combinedError && <div className="error">{combinedError}</div>}
      {!isError && combinedError && <div className="error">{combinedError}</div>}

      <PostList
        posts={sortedPosts}
        editingId={editingId}
        editDraft={editDraft}
        onStartEdit={startEdit}
        onEditField={handleEditField}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={cancelEdit}
        onDelete={handleDelete}
        action={currentAction}
      />
    </div>
  )
}
