import { useState } from 'react'
import { useAuth } from '../../app/providers/AuthContext'
import { Spinner } from './Spinner'

const MODE = {
  login: 'login',
  register: 'register',
}

export function AuthPanel() {
  const { login, register, loading } = useAuth()

  const [mode, setMode] = useState(MODE.login)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (mode === MODE.login) {
        await login({ email, password })
      } else {
        await register({ name, email, password })
      }
      setPassword('')
    } catch (err) {
      setError(err?.message || 'Не удалось выполнить запрос')
    }
  }

  const isRegister = mode === MODE.register

  return (
    <div className="card auth-card">
      <div className="status-bar">
        <div className="row" style={{ alignItems: 'center', gap: 8 }}>
          <strong>{isRegister ? 'Регистрация' : 'Вход'}</strong>
          <span className="badge">Local Auth</span>
        </div>
        <div className="row auth-switch">
          <button
            type="button"
            className={mode === MODE.login ? 'ghost active' : 'ghost'}
            onClick={() => setMode(MODE.login)}
            disabled={loading}
          >
            Войти
          </button>
          <button
            type="button"
            className={mode === MODE.register ? 'ghost active' : 'ghost'}
            onClick={() => setMode(MODE.register)}
            disabled={loading}
          >
            Регистрация
          </button>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isRegister && (
          <div className="input-group">
            <label htmlFor="auth-name">Имя</label>
            <input
              id="auth-name"
              placeholder="Например, Nova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="auth-password">Пароль</label>
          <input
            id="auth-password"
            type="password"
            placeholder="••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="row" style={{ alignItems: 'center' }}>
              <Spinner size={16} />
              {isRegister ? 'Создаём...' : 'Входим...'}
            </span>
          ) : (
            isRegister ? 'Создать аккаунт' : 'Войти'
          )}
        </button>
      </form>

      <div className="hint">
        <p className="subtitle" style={{ marginBottom: 6 }}>
          Быстрые учётки для проверки:
        </p>
        <div className="row">
          <span className="badge">admin@admin.com / admin</span>
          <span className="badge">demo@demo.com / demo</span>
        </div>
      </div>
    </div>
  )
}
