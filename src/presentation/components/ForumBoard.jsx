import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../app/providers/AuthContext'
import { addMessage, createTopic, selectTopic } from '../../application/store/slices/forumSlice'
import { selectSelectedTopic, selectSelectedTopicId, selectTopics } from '../../application/store/selectors/forumSelectors'
import { Spinner } from './Spinner'

export function ForumBoard() {
  const dispatch = useDispatch()
  const { user } = useAuth()

  const topics = useSelector(selectTopics)
  const selectedId = useSelector(selectSelectedTopicId)
  const selected = useSelector(selectSelectedTopic)

  const [showModal, setShowModal] = useState(false)
  const [topicTitle, setTopicTitle] = useState('')
  const [topicDesc, setTopicDesc] = useState('')
  const [messageText, setMessageText] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleCreateTopic = (e) => {
    e.preventDefault()
    setError('')
    if (!topicTitle.trim() || !topicDesc.trim()) {
      setError('Заполните название и описание')
      return
    }
    dispatch(
      createTopic({
        title: topicTitle,
        description: topicDesc,
        author: user?.name || user?.email || 'Гость',
      }),
    )
    setTopicTitle('')
    setTopicDesc('')
    setShowModal(false)
  }

  const handleAddMessage = (e) => {
    e.preventDefault()
    if (!selected?.id) return
    if (!messageText.trim()) return
    setPending(true)
    setTimeout(() => {
      dispatch(
        addMessage({
          topicId: selected.id,
          author: user?.name || user?.email || 'Гость',
          body: messageText,
        }),
      )
      setMessageText('')
      setPending(false)
    }, 200)
  }

  const participantCount = useMemo(() => {
    if (!selected) return 0
    const set = new Set(selected.messages.map((m) => m.author))
    return set.size
  }, [selected])

  return (
    <section className="card forum-card">
      <div className="status-bar" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ alignItems: 'center', gap: 8 }}>
          <strong>Мини-форум</strong>
          <span className="badge">Тем: {topics.length}</span>
        </div>
        <button className="ghost" type="button" onClick={() => setShowModal(true)}>
          Новая тема
        </button>
      </div>

      <div className="forum-layout">
        <div className="topics">
          {topics.map((t) => (
            <button
              key={t.id}
              className={`topic-btn ${t.id === selectedId ? 'active' : ''}`}
              onClick={() => dispatch(selectTopic(t.id))}
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span>{t.title}</span>
                <span className="badge">{t.messages.length}</span>
              </div>
              <p className="subtitle" style={{ margin: '4px 0 0' }}>
                {t.description.substring(0, 80)}
              </p>
            </button>
          ))}
          {!topics.length && <p className="subtitle">Тем нет — создайте первую.</p>}
        </div>

        <div className="topic-detail">
          {selected ? (
            <>
              <div className="status-bar" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ alignItems: 'center', gap: 8 }}>
                  <strong>{selected.title}</strong>
                  <span className="badge">Участников: {participantCount}</span>
                </div>
                <span className="badge">Сообщений: {selected.messages.length}</span>
              </div>
              <p className="subtitle" style={{ marginTop: 0 }}>{selected.description}</p>

              <div className="messages">
                {selected.messages.length === 0 && <p className="subtitle">Сообщений нет.</p>}
                {selected.messages.map((m) => (
                  <div key={m.id} className="message">
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{m.author}</strong>
                      <span className="badge">{new Date(m.createdAt).toLocaleTimeString('ru-RU')}</span>
                    </div>
                    <p style={{ margin: '6px 0 0' }}>{m.body}</p>
                  </div>
                ))}
              </div>

              <form className="row" onSubmit={handleAddMessage} style={{ marginTop: 12, gap: 8 }}>
                <input
                  className="message-input"
                  placeholder="Напишите сообщение"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={pending}
                />
                <button type="submit" disabled={pending || !selected?.id}>
                  {pending ? (
                    <span className="row" style={{ alignItems: 'center' }}>
                      <Spinner size={16} />
                      Отправка...
                    </span>
                  ) : (
                    'Отправить'
                  )}
                </button>
              </form>
            </>
          ) : (
            <p className="subtitle">Выберите тему слева.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="status-bar" style={{ justifyContent: 'space-between' }}>
              <strong>Новая тема</strong>
              <button className="ghost" type="button" onClick={() => setShowModal(false)}>
                Закрыть
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateTopic}>
              <div className="input-group">
                <label htmlFor="topic-title">Название</label>
                <input
                  id="topic-title"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="Например, Лог боя"
                />
              </div>
              <div className="input-group">
                <label htmlFor="topic-desc">Описание</label>
                <textarea
                  id="topic-desc"
                  rows={3}
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  placeholder="О чём эта дискуссия"
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit">Создать</button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
