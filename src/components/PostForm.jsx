import { useState } from 'react'

export function PostForm({ onSubmit, disabled }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    onSubmit({ title, body })
    setTitle('')
    setBody('')
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="status-bar">
        <strong>Создать пост (POST)</strong>
        <span className="badge">/posts</span>
      </div>
      <div className="input-group">
        <label htmlFor="title">Заголовок</label>
        <input
          id="title"
          placeholder="Например, Отчёт по операции"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="input-group">
        <label htmlFor="body">Текст</label>
        <textarea
          id="body"
          placeholder="Краткое содержание"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={disabled}
        />
      </div>
      <button type="submit" disabled={disabled}>
        Отправить
      </button>
    </form>
  )
}
