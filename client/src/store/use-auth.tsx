import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  _id: string
  fullName: string
  name: string
  email: string
  role: 'Student' | 'Teacher'
  createdAt: string
  updatedAt: string
  accessToken: string
}

interface AuthState {
  user: null | User
  access_token: string | null
  isAuthorized: boolean
  login: (user: User, access_token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      isAuthorized: false,

      login: (user, access_token) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set({ user, isAuthorized: true, access_token })
      },
      logout: () => set({ user: null, access_token: null, isAuthorized: false })
    }),
    { name: 'auth-storage' }
  )
)
