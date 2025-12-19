/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const STORAGE_KEYS = {
  users: 'auth_users',
  session: 'user',
}

const seedUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Demo User',
    email: 'demo@demo.com',
    password: 'demo',
    role: 'user',
  },
]

const AuthContext = createContext(null)

const loadUsers = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.users)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch (error) {
      console.warn('Не удалось прочитать сохранённых пользователей:', error)
    }
  }
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seedUsers))
  return seedUsers
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Инициализация: подтягиваем список и активную сессию
  useEffect(() => {
    const existingUsers = loadUsers()
    setUsers(existingUsers)

    const savedUser = localStorage.getItem(STORAGE_KEYS.session)
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
      } catch (error) {
        console.error('Ошибка при восстановлении пользователя:', error)
        localStorage.removeItem(STORAGE_KEYS.session)
      }
    }
    setLoading(false)
  }, [])

  const persistUsers = (next) => {
    setUsers(next)
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(next))
  }

  const login = ({ email, password }) => {
    const trimmedEmail = (email || '').trim().toLowerCase()
    const trimmedPassword = (password || '').trim()

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Введите email и пароль')
    }

    const found = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === trimmedPassword,
    )

    if (!found) {
      throw new Error('Неверные данные для входа')
    }

    setUser(found)
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(found))
    return found
  }

  const register = ({ name, email, password }) => {
    const trimmedEmail = (email || '').trim().toLowerCase()
    const trimmedName = (name || '').trim()
    const trimmedPassword = (password || '').trim()

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Укажите email и пароль')
    }
    if (trimmedPassword.length < 4) {
      throw new Error('Пароль должен быть от 4 символов')
    }

    const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail)
    if (exists) {
      throw new Error('Такой email уже зарегистрирован')
    }

    const newUser = {
      id: Date.now(),
      name: trimmedName || trimmedEmail.split('@')[0],
      email: trimmedEmail,
      password: trimmedPassword,
      role: 'user',
    }

    const next = [...users, newUser]
    persistUsers(next)
    setUser(newUser)
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.session)
  }

  const isAuthenticated = useMemo(() => Boolean(user), [user])

  const value = {
    user,
    users,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }
  return context
}
