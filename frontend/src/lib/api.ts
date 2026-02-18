import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

import { clearAuthSession, getAccessToken } from '@/lib/auth-session'

const API_BASE_URL = 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = getAccessToken()
  if (accessToken !== null) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}

function onRequestError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error)
}

function onResponse<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  return response
}

function onResponseError(error: AxiosError): Promise<AxiosError> {
  if (error.response?.status === 401) {
    clearAuthSession()
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }
  return Promise.reject(error)
}

apiClient.interceptors.request.use(onRequest, onRequestError)
apiClient.interceptors.response.use(onResponse, onResponseError)
