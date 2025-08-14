import { httpService } from '@/lib/http'
import type { LoginForm, RegisterForm } from '@/types/schemas/auth.schema'

const AUTH_URL = import.meta.env.VITE_API_URL + '/auth'

export const login = async (loginForm: LoginForm) => {
  return await httpService.post(AUTH_URL + '/login', loginForm)
}

export const register = async (registerForm: RegisterForm) => {
  return await httpService.post(AUTH_URL + '/register', registerForm)
}

export const refreshToken = async (userId: string) => {
  return await httpService.post(`${AUTH_URL}/refresh`, { userId })
}
