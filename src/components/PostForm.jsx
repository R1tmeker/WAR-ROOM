import { useEffect, useState } from 'react'
import { Spinner } from './Spinner'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchUsers } from '../store/slices/usersSlice'
import { selectUsers, selectUsersError, selectUsersStatus } from '../store/selectors/usersSelectors'
import { selectSelectedUserId } from '../store/selectors/uiSelectors'
import { setSelectedUserId } from '../store/slices/uiSlice'

export function PostForm({ onSubmit, disabled }) {
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const users = useAppSelector(selectUsers)
  const usersStatus = useAppSelector(selectUsersStatus)
  const usersError = useAppSelector(selectUsersError)
  const userId = useAppSelector(selectSelectedUserId)

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, usersStatus])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    onSubmit({ title, body, userId })
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

      <div className="input-group">
        <label htmlFor="author">Автор (userId)</label>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <select
            id="author"
            value={userId}
            onChange={(e) => dispatch(setSelectedUserId(Number(e.target.value)))}
            disabled={disabled || usersStatus === 'loading' || usersError}
          >
            {usersStatus === 'loading' && <option>Загрузка...</option>}
            {usersStatus === 'failed' && <option>Ошибка загрузки пользователей</option>}
            {usersStatus !== 'loading' && !usersError &&
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
          {usersStatus === 'succeeded' && !usersError && users.length > 0 && (
            <span className="badge">
              user #{userId}
            </span>
          )}
        </div>
      </div>

      <button type="submit" disabled={disabled}>
        {disabled ? (
          <span className="row" style={{ alignItems: 'center' }}>
            <Spinner size={16} /> Отправка...
          </span>
        ) : (
          'Отправить'
        )}
      </button>
    </form>
  )
}
