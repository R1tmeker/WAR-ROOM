import { Spinner } from '../components/Spinner'
import { AuthPanel } from '../components/AuthPanel'
import { ChatBoard } from '../components/ChatBoard'
import { useAuth } from '../../app/providers/AuthContext'

export default function App() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="app-shell">
        <div className="row" style={{ alignItems: 'center', gap: 12 }}>
          <Spinner />
          <p className="status-text">Проверяем сессию...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app-shell">
        <header className="app-bar">
          <div>
            <h1>WAR ROOM</h1>
            <p className="subtitle">Войдите или зарегистрируйтесь для доступа к мессенджеру</p>
          </div>
        </header>
        <div className="auth-centered">
          <AuthPanel />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell messenger-mode">
      <header className="app-bar">
        <div>
          <h1>WAR ROOM</h1>
          <p className="subtitle">Защищённый мессенджер</p>
        </div>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <span className="badge">{user?.name || user?.email}</span>
          {user?.role && <span className="badge">{user.role}</span>}
          <button type="button" className="ghost" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <ChatBoard />
    </div>
  )
}