import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createPost,
  deletePost,
  updatePost,
  clearPosts,
  clearError,
} from '../../application/store/slices/postsSlice'
import { selectPosts, selectPostsError } from '../../application/store/selectors/postsSelectors'
import styles from './PostsActions.module.css'

export const PostsActions = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectPosts)
  const error = useSelector(selectPostsError)

  const handleAdd = () => {
    dispatch(
      createPost({
        title: 'Новый пост',
        body: 'Описание нового поста',
        userId: 1,
      })
    )
  }

  const handleRemove = () => {
    if (items.length === 0) return
    dispatch(deletePost(items[0].id))
  }

  const handleUpdate = () => {
    if (items.length === 0) return
    dispatch(
      updatePost({
        id: items[0].id,
        payload: {
          title: 'Обновленный пост',
          body: 'Обновленное описание',
        },
      })
    )
  }

  const handleClear = () => {
    dispatch(clearPosts())
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Управление постами (Redux)</h3>

      <div className={styles.buttons}>
        <button className={styles.btn} onClick={handleAdd}>
           Добавить пост
        </button>
        <button className={styles.btn} onClick={handleRemove} disabled={items.length === 0}>
           Удалить первый
        </button>
        <button className={styles.btn} onClick={handleUpdate} disabled={items.length === 0}>
           Обновить первый
        </button>
        <button className={styles.btn} onClick={handleClear}>
           Очистить список
        </button>
        <button className={styles.btn} onClick={handleClearError} disabled={!error}>
           Сбросить ошибку
        </button>
      </div>

      <div className={styles.info}>
        <p>
          <strong>Всего постов:</strong> {items.length}
        </p>
        {items.length > 0 && (
          <div className={styles.firstItem}>
            <p>
              <strong>Первый пост:</strong> {items[0].title.substring(0, 50)}...
            </p>
          </div>
        )}
      </div>

      {error && <p className={styles.error}> Ошибка: {error}</p>}
    </div>
  )
}
