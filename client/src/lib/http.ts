import { refreshToken } from '@/services/auth.services'
import { useAuthStore } from '@/store/use-auth'
import type { ApiResponse } from '@/types/api'
import { type AxiosInstance, type AxiosResponse, AxiosError, type AxiosRequestConfig } from 'axios'
import axios from 'axios'

class Http {
  private instance: AxiosInstance
  private readonly publicRoutes = ['/login', '/register']
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        const { pathname } = new URL(config.url!, config.baseURL)
        // Only attach token if not a public route
        if (!this.publicRoutes.includes(pathname)) {
          const { access_token } = useAuthStore.getState()
          if (access_token) {
            config.headers!.Authorization = `Bearer ${access_token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(this.handleError(error))
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data
      },
      async (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.data.message == 'Token expired' && error.response.status === 401) {
            const config = error.response!.config
            const { user, login } = useAuthStore.getState()
            const data = (await refreshToken(user!._id)) as ApiResponse<{ access_token: string }>
            console.log(data.data.access_token)
            config.headers.Authorization = `Bearer ${data.data.access_token}`
            login(user!, data.data.access_token)
            return this.instance.request(config)
          }
        }
        return Promise.reject(this.handleError(error))
      }
    )
  }
  private handleError(error: AxiosError) {
    // Network/Connection errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return {
          message: 'Request timeout. Please check your connection and try again.',
          code: 'TIMEOUT_ERROR'
        }
      }

      if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
        return {
          message: 'Network error. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        }
      }

      return {
        message: 'Failed to reach the server. Please try again later.',
        code: 'CONNECTION_ERROR'
      }
    }

    // Server responded with error status
    const { status, data } = error.response as AxiosResponse

    // Handle specific status codes
    switch (status) {
      case 401: {
        return {
          message: 'Authentication failed. Please log in again.',
          status,
          code: 'UNAUTHORIZED'
        }
      }

      case 403:
        return {
          message: "Access denied. You don't have permission to perform this action.",
          status,
          code: 'FORBIDDEN'
        }

      case 404:
        return {
          message: 'Resource not found.',
          status,
          code: 'NOT_FOUND'
        }

      case 422:
        return {
          message: data?.message || 'Validation error. Please check your input.',
          status,
          code: 'VALIDATION_ERROR'
        }

      case 429:
        return {
          message: 'Too many requests. Please wait before trying again.',
          status,
          code: 'RATE_LIMIT'
        }

      case 500:
        return {
          message: 'Internal server error. Please try again later.',
          status,
          code: 'SERVER_ERROR'
        }

      default:
        return {
          message: data?.message || `Request failed with status ${status}`,
          status,
          code: 'API_ERROR'
        }
    }
  }
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config)
  }

  async post<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config)
  }

  async put<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config)
  }

  async patch<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.patch(url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config)
  }
}
export const httpService = new Http()
