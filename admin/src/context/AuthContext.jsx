import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/services.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      getMe()
        .then(r => setAdmin(r.data))
        .catch(() => {
          localStorage.removeItem('admin_token')
          setAdmin(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginAdmin = useCallback((token, adminData) => {
    localStorage.setItem('admin_token', token)
    setAdmin(adminData)
    navigate('/', { replace: true })
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    setAdmin(null)
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <AuthContext.Provider value={{ admin, loading, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
