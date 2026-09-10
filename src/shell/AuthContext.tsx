import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onForcedLogout, setCurrentToken } from '@/api/authSession'

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: Status
  login: (token: string) => void
  logout: () => void
}

const STORAGE_KEY = 'cortai-session'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')

  function login(token: string) {
    setCurrentToken(token)
    window.localStorage.setItem(STORAGE_KEY, token)
    setStatus('authenticated')
  }

  function logout() {
    setCurrentToken(null)
    window.localStorage.removeItem(STORAGE_KEY)
    setStatus('unauthenticated')
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setCurrentToken(stored)
      setStatus('authenticated')
    } else {
      setStatus('unauthenticated')
    }
    return onForcedLogout(logout)
  }, [])

  return <AuthContext.Provider value={{ status, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
