import type { AuthResponse, AuthUser } from '@/lib/auth'

const ACCESS_TOKEN_STORAGE_KEY = 'dispatch_access_token'
const REFRESH_TOKEN_STORAGE_KEY = 'dispatch_refresh_token'
const USER_STORAGE_KEY = 'dispatch_user'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function getStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (rawUser === null) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    return null
  }
}

export function persistAuthSession(response: AuthResponse): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.tokens.access_token)
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.tokens.refresh_token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user))
}

export function clearAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}
