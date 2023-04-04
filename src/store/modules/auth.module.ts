import { defineStore } from 'pinia'
import { api } from '@/api'
import { Jwt, AuthorizeUserResponse } from '@/types'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { parseJwt, memorizedJwtRefresh } from '@/helpers'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as Jwt | null,
    refreshToken: null as Jwt | null,
    isLoggedIn: false,
  }),
  persist: true,
  actions: {
    async createSession(email: string, password: string): Promise<void> {
      const { data } = await api.post<AuthorizeUserResponse>(
        '/integrations/auth/login',
        {
          data: {
            type: 'login',
            attributes: {
              email: email,
              password: password,
            },
          },
        },
      )

      this.accessToken = parseJwt(data.access)
      this.refreshToken = parseJwt(data.refresh)
      this.isLoggedIn = true
    },

    logout(): void {
      if (this.isLoggedIn) {
        this.accessToken = null
        this.refreshToken = null
        this.isLoggedIn = false
        router.push({ name: ROUTE_NAMES.login })
      }
    },

    async restoreSession(): Promise<void> {
      const { access, refresh } = await memorizedJwtRefresh(
        this.refreshToken?.token,
      )
      this.accessToken = parseJwt(access)
      this.refreshToken = parseJwt(refresh)
    },
  },
  getters: {
    currentUserId: state => state.refreshToken?.userId || null,
  },
})
