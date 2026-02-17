import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  return config
}

function onRequestError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error)
}

function onResponse<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  return response
}

function onResponseError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error)
}

apiClient.interceptors.request.use(onRequest, onRequestError)
apiClient.interceptors.response.use(onResponse, onResponseError)
