import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { PostForm } from './components/PostForm'
import { PostList } from './components/PostList'
import { Spinner } from './components/Spinner'

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [action, setAction] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({ title: '', body: '' })

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.id - a.id),
    [posts],
  )

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    setAction({ type: 'load' })
    const { data, error: apiError } = await api.listPosts()
    if (apiError) {
      setError(apiError)
    } else {
      setPosts(data)
    }
    setAction(null)
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleCreate = async ({ title, body }) => {
    setError(null)
    setAction({ type: 'create' })
    const payload = { title, body, userId: 1 }
    const { data, error: apiError } = await api.createPost(payload)
    if (apiError) {
      setError(apiError)
    } else {
      setPosts((prev) => [{ ...payload, id: data.id ?? Date.now() }, ...prev])
    }
    setAction(null)
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

  const handleSaveEdit = async (id) => {
    setError(null)
    setAction({ type: 'update', id })
    const { data, error: apiError } = await api.updatePost(id, editDraft)
    if (apiError) {
      setError(apiError)
    } else {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...editDraft, ...(data || {}) } : p)),
      )
      cancelEdit()
    }
    setAction(null)
  }

  const handleDelete = async (id) => {
    setError(null)
    setAction({ type: 'delete', id })
    const { error: apiError } = await api.deletePost(id)
    if (apiError) {
      setError(apiError)
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }
    setAction(null)
  }

  const isBusy = Boolean(action)

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>WAR ROOM</h1>
          <p className="subtitle">GET / POST / PATCH / DELETE в действии (JSONPlaceholder)</p>
        </div>
        <div className="controls">
          <button onClick={loadPosts} disabled={loading}>
            {loading ? (
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
          {loading
            ? 'Загрузка...' 
            : isBusy
              ? 'Выполняется запрос...' 
              : 'Готов к работе'}
        </p>
        {action?.type && <span className="badge">{action.type.toUpperCase()}</span>}
      </div>

      {error && <div className="error">{error}</div>}

      <PostList
        posts={sortedPosts}
        editingId={editingId}
        editDraft={editDraft}
        onStartEdit={startEdit}
        onEditField={handleEditField}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={cancelEdit}
        onDelete={handleDelete}
        action={action}
      />
    </div>
  )
}
