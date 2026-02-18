import { apiClient } from '@/lib/api'

export interface AuthUser {
  id: number
  email: string
  full_name: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AuthResponse {
  tokens: AuthTokens
  user: AuthUser
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload)
  return response.data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload)
  return response.data
}

export function persistAuthSession(response: AuthResponse): void {
  localStorage.setItem('dispatch_access_token', response.tokens.access_token)
  localStorage.setItem('dispatch_refresh_token', response.tokens.refresh_token)
  localStorage.setItem('dispatch_user', JSON.stringify(response.user))
}
