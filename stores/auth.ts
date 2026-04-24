import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  nombre: string
  correo: string
  telefono: string | null
  created_at: string
}

interface AuthResponse {
  token: string
  user: AuthUser
}

const TOKEN_KEY = 'itc_auth_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userName: (state) => state.user?.nombre ?? '',
    userInitials: (state) => {
      if (!state.user?.nombre) return ''
      const parts = state.user.nombre.trim().split(/\s+/)
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase()
    },
    userRole: () => 'Cliente',
  },

  actions: {
    _setSession(token: string, user: AuthUser) {
      this.token = token
      this.user = user
      if (import.meta.client) localStorage.setItem(TOKEN_KEY, token)
    },

    _clearSession() {
      this.token = null
      this.user = null
      if (import.meta.client) localStorage.removeItem(TOKEN_KEY)
    },

    async register(data: {
      nombre: string
      correo: string
      telefono?: string
      password: string
      password_confirmation: string
    }) {
      this.isLoading = true
      const config = useRuntimeConfig()
      try {
        const res = await $fetch<AuthResponse>(`${config.public.apiBase}/eqm/auth/register`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.public.apiPublicToken}`,
            Accept: 'application/json',
          },
          body: data,
        })
        this._setSession(res.token, res.user)
        return { success: true as const }
      } catch (err: any) {
        return { success: false as const, errors: err?.data?.errors as Record<string, string[]> | undefined }
      } finally {
        this.isLoading = false
      }
    },

    async login(correo: string, password: string) {
      this.isLoading = true
      const config = useRuntimeConfig()
      try {
        const res = await $fetch<AuthResponse>(`${config.public.apiBase}/eqm/auth/login`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.public.apiPublicToken}`,
            Accept: 'application/json',
          },
          body: { correo, password },
        })
        this._setSession(res.token, res.user)
        return { success: true as const }
      } catch (err: any) {
        return { success: false as const, errors: err?.data?.errors as Record<string, string[]> | undefined }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      if (!this.token) return
      const config = useRuntimeConfig()
      const token = this.token
      this._clearSession()
      try {
        await $fetch(`${config.public.apiBase}/eqm/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
      } catch {
        // silent — session already cleared locally
      }
    },

    async fetchMe() {
      if (!this.token) return
      const config = useRuntimeConfig()
      try {
        const user = await $fetch<AuthUser>(`${config.public.apiBase}/eqm/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
        })
        this.user = user
      } catch {
        this._clearSession()
      }
    },

    hydrate() {
      if (!import.meta.client) return
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        this.token = token
        this.fetchMe()
      }
    },
  },
})
