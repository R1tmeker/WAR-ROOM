import { PostRow } from './PostRow'

export function PostList({
  posts,
  editingId,
  editDraft,
  onStartEdit,
  onEditField,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  action,
}) {
  if (!posts.length) {
    return <div className="empty">Нет данных. Нажмите «Обновить список» чтобы загрузить.</div>
  }

  return (
    <div className="stack">
      {posts.map((post) => (
        <PostRow
          key={post.id}
          post={post}
          isEditing={editingId === post.id}
          editDraft={editDraft}
          onStartEdit={() => onStartEdit(post)}
          onEditField={onEditField}
          onSave={() => onSaveEdit(post.id)}
          onCancel={onCancelEdit}
          onDelete={() => onDelete(post.id)}
          action={action}
        />
      ))}
    </div>
  )
}