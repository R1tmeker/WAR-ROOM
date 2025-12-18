import { Spinner } from './Spinner'

export function PostRow({
  post,
  isEditing,
  editDraft,
  onStartEdit,
  onEditField,
  onSave,
  onCancel,
  onDelete,
  action,
}) {
  const isUpdating = action?.type === 'update' && action.id === post.id
  const isDeleting = action?.type === 'delete' && action.id === post.id

  if (isEditing) {
    return (
      <div className="card">
        <div className="status-bar">
          <strong>Редактировать (PATCH)</strong>
          <span className="badge">/posts/{post.id}</span>
        </div>
        <div className="input-group">
          <label htmlFor={`title-${post.id}`}>Заголовок</label>
          <input
            id={`title-${post.id}`}
            value={editDraft.title}
            onChange={(e) => onEditField('title', e.target.value)}
            disabled={isUpdating}
          />
        </div>
        <div className="input-group">
          <label htmlFor={`body-${post.id}`}>Текст</label>
          <textarea
            id={`body-${post.id}`}
            rows={3}
            value={editDraft.body}
            onChange={(e) => onEditField('body', e.target.value)}
            disabled={isUpdating}
          />
        </div>
        <div className="row">
          <button onClick={onSave} disabled={isUpdating}>
            {isUpdating ? (
              <span className="row" style={{ alignItems: 'center' }}>
                <Spinner size={16} /> Сохранение...
              </span>
            ) : (
              'Сохранить'
            )}
          </button>
          <button type="button" onClick={onCancel} disabled={isUpdating}>
            Отмена
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="status-bar" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <span className="badge">#{post.id}</span>
          <span className="badge">user {post.userId}</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button onClick={onStartEdit} disabled={isDeleting}>
            Редактировать
          </button>
          <button onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? (
              <span className="row" style={{ alignItems: 'center' }}>
                <Spinner size={16} /> Удаление...
              </span>
            ) : (
              'Удалить'
            )}
          </button>
        </div>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-body">{post.body}</p>
    </div>
  )
}