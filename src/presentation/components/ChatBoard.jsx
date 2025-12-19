import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../app/providers/AuthContext'
import {
  createRoom,
  selectRoom,
  sendMessage,
  setSearchQuery,
  togglePinRoom,
  togglePinMessage,
  deleteMessage,
  setTyping,
  clearTyping,
} from '../../application/store/slices/chatSlice'
import {
  selectFilteredRooms,
  selectOnlineUsers,
  selectSearchQuery,
  selectSelectedRoom,
  selectTotalUnread,
  selectPinnedRooms,
  selectUnpinnedRooms,
} from '../../application/store/selectors/chatSelectors'
import { Spinner } from './Spinner'

export function ChatBoard() {
  const dispatch = useDispatch()
  const { user } = useAuth()

  const searchQuery = useSelector(selectSearchQuery)
  const filteredRooms = useSelector(selectFilteredRooms)
  const selected = useSelector(selectSelectedRoom)
  const totalUnread = useSelector(selectTotalUnread)
  const onlineUsers = useSelector(selectOnlineUsers)
  const pinnedRooms = useSelector(selectPinnedRooms)
  const unpinnedRooms = useSelector(selectUnpinnedRooms)

  const [showModal, setShowModal] = useState(false)
  const [roomTitle, setRoomTitle] = useState('')
  const [roomParticipants, setRoomParticipants] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const messagesRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [selected?.messages?.length])

  const handleCreateRoom = (e) => {
    e.preventDefault()
    setError('')
    if (!roomTitle.trim()) {
      setError('Нужно название чата')
      return
    }
    const participants = roomParticipants
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    dispatch(createRoom({ title: roomTitle, participants }))
    setRoomTitle('')
    setRoomParticipants('')
    setShowModal(false)
  }

  const handleTyping = () => {
    if (!selected?.id) return
    const userName = user?.name || user?.email || 'Гость'
    dispatch(setTyping({ roomId: selected.id, user: userName }))
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      dispatch(clearTyping(selected.id))
    }, 2000)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!selected?.id) return
    if (!message.trim()) return
    setPending(true)
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    dispatch(clearTyping(selected.id))
    
    setTimeout(() => {
      dispatch(
        sendMessage({
          roomId: selected.id,
          author: user?.name || user?.email || 'Гость',
          body: message,
        }),
      )
      setMessage('')
      setPending(false)
    }, 200)
  }

  const handleDeleteMessage = (messageId) => {
    if (!window.confirm('Удалить это сообщение?')) return
    dispatch(deleteMessage({ roomId: selected.id, messageId }))
  }

  const pinnedMessages = useMemo(() => {
    return selected?.messages.filter((m) => m.pinned) || []
  }, [selected])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Сегодня'
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
    return date.toLocaleDateString('ru-RU')
  }

  const isOnline = (userName) => onlineUsers.includes(userName)

  const renderRoomItem = (r) => {
    const last = r.messages.at(-1)
    const online = r.participants.some((p) => isOnline(p))

    return (
      <button
        key={r.id}
        className={`chat-room ${r.id === selected?.id ? 'active' : ''} ${r.pinned ? 'pinned' : ''}`}
        onClick={() => dispatch(selectRoom(r.id))}
        onContextMenu={(e) => {
          e.preventDefault()
          dispatch(togglePinRoom(r.id))
        }}
      >
        <div className="room-header">
          <div className="row" style={{ alignItems: 'center', gap: 6 }}>
            {online && <span className="online-dot" />}
            <span className="room-title">{r.title}</span>
          </div>
          <div className="row" style={{ gap: 4 }}>
            {r.pinned && <span className="badge pin-badge">📌</span>}
            {r.unread > 0 && <span className="badge unread-badge">{r.unread}</span>}
          </div>
        </div>
        <div className="room-preview">
          <p className="subtitle">
            {last ? `${last.author}: ${last.body.slice(0, 40)}...` : 'Нет сообщений'}
          </p>
          {last && <span className="time">{formatTime(last.createdAt)}</span>}
        </div>
      </button>
    )
  }

  return (
    <section className="messenger-container">
      <div className="messenger-sidebar">
        <div className="sidebar-header">
          <input
            className="search-input"
            placeholder="Поиск чатов..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          <button className="new-chat-btn" type="button" onClick={() => setShowModal(true)}>
            + Чат
          </button>
        </div>

        {totalUnread > 0 && (
          <div className="unread-counter">
            Непрочитанных: <span className="badge">{totalUnread}</span>
          </div>
        )}

        <div className="rooms-list">
          {pinnedRooms.length > 0 && (
            <>
              {pinnedRooms.map(renderRoomItem)}
              {unpinnedRooms.length > 0 && <div className="rooms-divider" />}
            </>
          )}
          {unpinnedRooms.map(renderRoomItem)}
          {filteredRooms.length === 0 && <p className="subtitle">Чатов не найдено</p>}
        </div>
      </div>

      <div className="messenger-main">
        {selected ? (
          <>
            <div className="chat-header">
              <div>
                <h2>{selected.title}</h2>
                <p className="subtitle">
                  {selected.participants.length} участников
                  {selected.typing && ` • ${selected.typing} печатает...`}
                </p>
              </div>
            </div>

            {pinnedMessages.length > 0 && (
              <div className="pinned-messages">
                {pinnedMessages.map((m) => (
                  <div key={m.id} className="pinned-item">
                    <span>📌 {m.body.slice(0, 60)}</span>
                    <button
                      className="ghost-sm"
                      onClick={() => dispatch(togglePinMessage({ roomId: selected.id, messageId: m.id }))}
                    >
                      Открепить
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="chat-messages" ref={messagesRef}>
              {selected.messages.length === 0 && <p className="subtitle">Нет сообщений.</p>}
              {selected.messages.map((m, idx) => {
                const mine = (user?.name || user?.email) === m.author
                const prevMsg = selected.messages[idx - 1]
                const showDate =
                  !prevMsg || formatDate(m.createdAt) !== formatDate(prevMsg.createdAt)

                return (
                  <div key={m.id}>
                    {showDate && <div className="date-separator">{formatDate(m.createdAt)}</div>}
                    <div
                      className={`bubble ${mine ? 'mine' : 'other'}`}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        const action = window.confirm('Закрепить это сообщение?')
                          ? () => dispatch(togglePinMessage({ roomId: selected.id, messageId: m.id }))
                          : () => handleDeleteMessage(m.id)
                        action()
                      }}
                    >
                      <div className="bubble-header">
                        <strong>{m.author}</strong>
                        <span className="time">{formatTime(m.createdAt)}</span>
                      </div>
                      <p className="bubble-text">{m.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <form className="chat-input-form" onSubmit={handleSend}>
              <input
                className="message-input"
                placeholder="Сообщение"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  handleTyping()
                }}
                disabled={pending}
              />
              <button type="submit" disabled={pending || !selected?.id}>
                {pending ? (
                  <span className="row" style={{ alignItems: 'center' }}>
                    <Spinner size={16} />
                  </span>
                ) : (
                  '➤'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="empty-state">
            <p className="subtitle">Выберите чат для начала общения</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="status-bar" style={{ justifyContent: 'space-between' }}>
              <strong>Новый чат</strong>
              <button className="ghost" type="button" onClick={() => setShowModal(false)}>
                Закрыть
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateRoom}>
              <div className="input-group">
                <label htmlFor="room-title">Название</label>
                <input
                  id="room-title"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  placeholder="Например, Лобби"
                />
              </div>
              <div className="input-group">
                <label htmlFor="room-participants">Участники (через запятую)</label>
                <input
                  id="room-participants"
                  value={roomParticipants}
                  onChange={(e) => setRoomParticipants(e.target.value)}
                  placeholder="Admin, Demo User"
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
