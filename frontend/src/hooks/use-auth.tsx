import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import type { AuthResponse, AuthUser } from '@/lib/auth'
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  persistAuthSession,
} from '@/lib/auth-session'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  syncFromStorage: () => void
  setSession: (response: AuthResponse) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser())

  function syncFromStorage(): void {
    setUser(getStoredUser())
  }

  function setSession(response: AuthResponse): void {
    persistAuthSession(response)
    setUser(response.user)
  }

  function signOut(): void {
    clearAuthSession()
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: getAccessToken() !== null,
      syncFromStorage,
      setSession,
      signOut,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
