import { useMemo, useState } from 'react'
import { Spinner } from './Spinner'

const generateCode = () => Math.floor(100 + Math.random() * 900)

const describeGuess = (guess, target) => {
  if (guess === target) return 'success'
  if (Math.abs(guess - target) <= 10) return 'hot'
  if (guess > target) return 'high'
  return 'low'
}

export function MiniGame() {
  const [target, setTarget] = useState(generateCode)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState([])
  const [status, setStatus] = useState('Введите трёхзначный код')
  const [busy, setBusy] = useState(false)

  const lastAttempt = attempts.at(-1)

  const difficulty = useMemo(() => {
    if (attempts.length === 0) return 'Rookie'
    if (attempts.length <= 3) return 'Operative'
    if (attempts.length <= 6) return 'Agent'
    return 'Veteran'
  }, [attempts.length])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (busy) return

    const numeric = Number(guess)
    if (!Number.isInteger(numeric) || numeric < 100 || numeric > 999) {
      setStatus('Нужен код из 3 цифр (100-999)')
      return
    }

    setBusy(true)
    setTimeout(() => {
      const result = describeGuess(numeric, target)
      setAttempts((prev) => [...prev, { value: numeric, result }])
      setStatus(
        result === 'success'
          ? 'Доступ получен — код совпал!'
          : result === 'hot'
            ? 'Очень близко — держи курс!'
            : result === 'high'
              ? 'Слишком высоко — снизь значение'
              : 'Слишком низко — подними значение',
      )
      setGuess('')
      setBusy(false)
    }, 300)
  }

  const handleReset = () => {
    setTarget(generateCode())
    setAttempts([])
    setGuess('')
    setStatus('Новый код загружен')
  }

  return (
    <div className="card mini-game">
      <div className="status-bar" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ alignItems: 'center', gap: 8 }}>
          <strong>Мини-игра: Перехват кода</strong>
          <span className="badge">{difficulty}</span>
        </div>
        <button type="button" className="ghost" onClick={handleReset} disabled={busy}>
          Сбросить код
        </button>
      </div>

      <p className="subtitle" style={{ marginBottom: 12 }}>
        Угадай трёхзначный код, чтобы открыть терминал. Подсказки покажут, выше или ниже твой ответ.
      </p>

      <form className="row" onSubmit={handleSubmit} style={{ alignItems: 'center' }}>
        <input
          className="code-input"
          type="number"
          min="100"
          max="999"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="000"
          disabled={busy}
        />
        <button type="submit" disabled={busy}>
          {busy ? (
            <span className="row" style={{ alignItems: 'center' }}>
              <Spinner size={16} />
              Сканируем...
            </span>
          ) : (
            'Отправить код'
          )}
        </button>
      </form>

      <div className={`status-pill ${lastAttempt?.result || ''}`}>{status}</div>

      <div className="attempts">
        {attempts.length === 0 ? (
          <p className="subtitle">Нет попыток — действуй.</p>
        ) : (
          attempts
            .slice()
            .reverse()
            .map((item, idx) => (
              <div key={`${item.value}-${idx}`} className={`attempt ${item.result}`}>
                <span className="badge">#{attempts.length - idx}</span>
                <strong>{item.value}</strong>
                <span className="hint">{item.result}</span>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
