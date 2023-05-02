import { defineStore } from 'pinia'
import { api } from '@/api'
import { Jwt, AuthorizeUserResponse } from '@/types'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { parseJwt, memorizedJwtRefresh } from '@/helpers'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as Jwt | null,
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
      this.isLoggedIn = true
    },

    async logout(): Promise<void> {
      if (this.isLoggedIn) {
        await api.post('/integrations/auth/logout', {})
        this.accessToken = null
        this.isLoggedIn = false
        await router.push({ name: ROUTE_NAMES.login })
      }
    },

    async restoreSession(): Promise<void> {
      const { access } = await memorizedJwtRefresh()
      this.accessToken = parseJwt(access)
    },
  },
  getters: {
    currentUserId: state => state.accessToken?.userId || null,
  },
})
