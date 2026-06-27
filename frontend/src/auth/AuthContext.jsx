import { createContext, useContext, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext()

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    })

    const data = response.data.data
    const accessToken = data.token
    const loggedUser = data.user

    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(loggedUser))

    setToken(accessToken)
    setUser(loggedUser)

    return loggedUser
  }

  const register = async (formData) => {
    const response = await api.post('/auth/register', formData)
    return response.data
  }

  const refreshUser = async () => {
    const response = await api.get('/auth/me')
    const updatedUser = response.data.data

    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)

    return updatedUser
  }

  const updateProfile = async (formData) => {
    const response = await api.put('/auth/me', formData)
    const updatedUser = response.data.data

    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)

    return updatedUser
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, refreshUser, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}