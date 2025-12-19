import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './FakeStoreReviews.module.css'
import { useReviews } from '../model/useReviews'
import { useAuth } from '../../../app/providers/AuthContext'

const REVIEWS_PER_PAGE = 3

const FakeStoreReviews = () => {
  const { reviews, loading, error, deleteReview } = useReviews()
  const [page, setPage] = useState(1)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isAdmin = useMemo(() => {
    if (!user) return false

    const name = (user.name || '').toLowerCase().trim()
    const email = (user.email || '').toLowerCase().trim()

    return name === 'admin' || email === 'admin@admin.com'
  }, [user])

  console.log('user в FakeStoreReviews:', user, 'isAdmin:', isAdmin)

  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE))

  const pageReviews = useMemo(() => {
    const start = (page - 1) * REVIEWS_PER_PAGE
    return reviews.slice(start, start + REVIEWS_PER_PAGE)
  }, [page, reviews])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Точно удалить этот отзыв?')) return

    try {
      await deleteReview(id)
    } catch (err) {
      console.error('Ошибка при удалении отзыва:', err)
      alert(
        err?.response?.data?.error ||
          err?.message ||
          'Не удалось удалить отзыв',
      )
    }
  }

  if (loading) {
    return (
      <section className={styles.reviewsSection}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Отзывы</h2>
        </div>
        <p className={styles.infoText}>Загрузка…</p>
      </section>
    )
  }

  if (error) {
    const message =
      error?.response?.data?.error || error?.message || String(error)

    return (
      <section className={styles.reviewsSection}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Отзывы</h2>
        </div>
        <p className={styles.infoText}>Ошибка: {message}</p>
      </section>
    )
  }

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>Отзывы</h2>
          {isAdmin && <span className={styles.adminBadge}>ADMIN</span>}
        </div>

        <div className={styles.headerButtons}>
          <Link to="/" className={styles.navButton}>
            На главную
          </Link>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </div>

      <div className={styles.cardsRow}>
        {pageReviews.length === 0 && (
          <p className={styles.infoText}>Отзывов пока нет. Будь первой 😊</p>
        )}

        {pageReviews.map((r) => (
          <article key={r.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                {r.title?.[0]?.toUpperCase() || '?'}
              </div>

              <div className={styles.cardHeaderText}>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                {r.createdAt && (
                  <p className={styles.cardDate}>
                    {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>

              {isAdmin && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(r.id)}
                >
                  Удалить
                </button>
              )}
            </div>

            <p className={styles.cardText}>{r.description}</p>

            {r.image && (
              <img
                src={r.image}
                alt={r.title}
                className={styles.cardImage}
              />
            )}
          </article>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Назад
        </button>
        <span className={styles.pageInfo}>
          {page} / {totalPages}
        </span>
        <button
          className={styles.pageButton}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Вперёд
        </button>
      </div>
    </section>
  )
}

export default FakeStoreReviews
