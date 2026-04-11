/**
 * stores/auth.ts
 *
 * Store de autenticación con Pinia.
 * Por ahora es visual — la lógica real se implementará
 * cuando exista la tabla de usuarios en el front.
 */

import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  name: string
  email: string
  initials: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userInitials: (state) => state.user?.initials ?? '',
    userName: (state) => state.user?.name ?? '',
    userRole: (state) => state.user?.role ?? '',
  },

  actions: {
    // ── Placeholder login (se reemplazará con llamada real a la API) ──
    async login(email: string, _password: string) {
      this.isLoading = true
      // TODO: llamar a POST /api/v1/auth/login con useApi()
      // Por ahora simula un login visual
      await new Promise((r) => setTimeout(r, 600))
      this.user = {
        id: 1,
        name: 'Usuario Demo',
        email,
        initials: email.slice(0, 2).toUpperCase(),
        role: 'Cliente',
      }
      this.token = 'demo-token'
      this.isLoading = false
    },

    logout() {
      this.user = null
      this.token = null
    },

    // Rehidratar desde cookie al recargar (se implementará con sesiones reales)
    hydrate() {
      // TODO: leer token de cookie HttpOnly o localStorage
    },
  },
})
