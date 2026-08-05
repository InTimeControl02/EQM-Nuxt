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

function _deviceName(): string {
  if (!import.meta.client) return 'Server'
  const ua = navigator.userAgent
  const browser =
    /Edg\//.test(ua)     ? 'Edge'    :
    /Chrome\//.test(ua)  ? 'Chrome'  :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Safari\//.test(ua)  ? 'Safari'  : 'Browser'
  const os =
    /Windows/.test(ua)        ? 'Windows' :
    /Android/.test(ua)        ? 'Android' :
    /iPhone|iPad/.test(ua)    ? 'iOS'     :
    /Mac/.test(ua)            ? 'macOS'   :
    /Linux/.test(ua)          ? 'Linux'   : 'Unknown'
  const cores = navigator.hardwareConcurrency ?? '?'
  return `${browser} · ${os} · ${cores} cores`
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userName:        (state) => state.user?.nombre ?? '',
    userInitials:    (state) => {
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
      this.user  = user
      if (import.meta.client) localStorage.setItem(TOKEN_KEY, token)
    },

    _clearSession() {
      this.token = null
      this.user  = null
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
        const res = await $fetch<{ status?: string; token?: string; user?: AuthUser }>(
          `${config.public.apiBase}/eqm/auth/register`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.public.apiPublicToken}`,
              Accept: 'application/json',
            },
            body: { ...data, device_name: _deviceName() },
          },
        )

        if (res.status === 'verification_required') {
          return { success: true as const, verificationRequired: true as const }
        }
        this._setSession(res.token!, res.user!)
        return { success: true as const, verificationRequired: false as const }
      } catch (err: any) {
        // Correo ya registrado y verificado → 422 solo con `message`, sin `errors`
        // (validación normal de campos sí trae `errors`; ambos casos se cubren aquí).
        return {
          success: false as const,
          errors:  err?.data?.errors  as Record<string, string[]> | undefined,
          message: err?.data?.message as string | undefined,
        }
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
          body: { correo, password, device_name: _deviceName() },
        })
        this._setSession(res.token, res.user)
        return { success: true as const }
      } catch (err: any) {
        const status = err?.status ?? err?.statusCode ?? err?.response?.status
        // No verificado → backend reenvió código automáticamente
        if (status === 403) {
          return { success: false as const, needsVerification: true as const }
        }
        // Correo no registrado → mostrar error en campo correo
        if (status === 404) {
          return {
            success: false as const,
            errors: { correo: [err?.data?.message ?? 'Correo no encontrado'] } as Record<string, string[]>,
          }
        }
        return {
          success: false as const,
          errors:  err?.data?.errors  as Record<string, string[]> | undefined,
          message: err?.data?.message as string | undefined,
        }
      } finally {
        this.isLoading = false
      }
    },

    async verifyEmail(correo: string, code: string) {
      this.isLoading = true
      const config = useRuntimeConfig()
      try {
        const res = await $fetch<AuthResponse>(`${config.public.apiBase}/eqm/auth/verify-email`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.public.apiPublicToken}`,
            Accept: 'application/json',
          },
          body: { correo, code, device_name: _deviceName() },
        })
        this._setSession(res.token, res.user)
        return { success: true as const }
      } catch (err: any) {
        return {
          success: false as const,
          message: err?.data?.message as string | undefined,
        }
      } finally {
        this.isLoading = false
      }
    },

    async forgotPassword(correo: string) {
      this.isLoading = true
      const config = useRuntimeConfig()
      try {
        const res = await $fetch<{ message: string }>(
          `${config.public.apiBase}/eqm/auth/forgot-password`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.public.apiPublicToken}`,
              Accept: 'application/json',
            },
            body: { correo },
          },
        )
        return { success: true as const, message: res.message }
      } catch (err: any) {
        return {
          success: false as const,
          errors:  err?.data?.errors  as Record<string, string[]> | undefined,
          message: err?.data?.message as string | undefined,
        }
      } finally {
        this.isLoading = false
      }
    },

    async resetPassword(data: {
      correo: string
      code: string
      password: string
      password_confirmation: string
    }) {
      this.isLoading = true
      const config = useRuntimeConfig()
      try {
        const res = await $fetch<{ message: string }>(
          `${config.public.apiBase}/eqm/auth/reset-password`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.public.apiPublicToken}`,
              Accept: 'application/json',
            },
            body: data,
          },
        )
        return { success: true as const, message: res.message }
      } catch (err: any) {
        return {
          success: false as const,
          errors:  err?.data?.errors  as Record<string, string[]> | undefined,
          message: err?.data?.message as string | undefined,
        }
      } finally {
        this.isLoading = false
      }
    },

    async resendVerification(correo: string) {
      const config = useRuntimeConfig()
      try {
        await $fetch(`${config.public.apiBase}/eqm/auth/resend-verification`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.public.apiPublicToken}`,
            Accept: 'application/json',
          },
          body: { correo },
        })
        return { success: true as const }
      } catch (err: any) {
        return {
          success: false as const,
          message: err?.data?.message as string | undefined,
        }
      }
    },

    async logout() {
      if (!this.token) return
      const config = useRuntimeConfig()
      const token  = this.token
      this._clearSession()
      useCartStore().reset()
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

    async updateProfile(data: { nombre: string; telefono?: string | null }) {
      if (!this.token) return { success: false as const }
      const config = useRuntimeConfig()
      try {
        const user = await $fetch<AuthUser>(`${config.public.apiBase}/eqm/auth/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
          body: data,
        })
        this.user = user
        return { success: true as const }
      } catch (err: any) {
        return {
          success: false as const,
          errors:  err?.data?.errors  as Record<string, string[]> | undefined,
          message: err?.data?.message as string | undefined,
        }
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
