import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  equipment_id: number
  codigo_snapshot: string
  nombre_snapshot: string
  es_contable_snapshot: boolean
  cantidad: number
}

export interface Cart {
  id: number
  front_user_id: number
  status: string
  notas_usuario: string | null
  submitted_at: string | null
  items: CartItem[]
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null as Cart | null,
    isLoading: false,
  }),

  getters: {
    itemCount: (state) => state.cart?.items.length ?? 0,
    items: (state) => state.cart?.items ?? [],
    isEmpty: (state) => !state.cart?.items.length,
  },

  actions: {
    _cfg() {
      return {
        base: useRuntimeConfig().public.apiBase as string,
        token: useAuthStore().token as string | null,
      }
    },

    _headers() {
      const { token } = this._cfg()
      return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    },

    async fetchCart() {
      const { token } = this._cfg()
      if (!token) return
      this.isLoading = true
      try {
        const { base } = this._cfg()
        this.cart = await $fetch<Cart>(`${base}/eqm/cart`, {
          headers: this._headers(),
        })
      } catch {
        this.cart = null
      } finally {
        this.isLoading = false
      }
    },

    async addItem(equipment_id: number, cantidad?: number) {
      const { base } = this._cfg()
      try {
        await $fetch(`${base}/eqm/cart/items`, {
          method: 'POST',
          headers: this._headers(),
          body: {
            equipment_id,
            ...(cantidad !== undefined ? { cantidad } : {}),
          },
        })
        await this.fetchCart()
        return { success: true as const }
      } catch (err: any) {
        return {
          success: false as const,
          errors: err?.data?.errors as Record<string, string[]> | undefined,
          message: err?.data?.message as string | undefined,
        }
      }
    },

    async updateItem(item_id: number, cantidad: number) {
      const { base } = this._cfg()
      try {
        await $fetch(`${base}/eqm/cart/items/${item_id}`, {
          method: 'PUT',
          headers: this._headers(),
          body: { cantidad },
        })
        // Actualización local optimista
        if (this.cart) {
          const item = this.cart.items.find(i => i.id === item_id)
          if (item) item.cantidad = cantidad
        }
        return { success: true as const }
      } catch (err: any) {
        return {
          success:    false as const,
          errors:     err?.data?.errors     as Record<string, string[]> | undefined,
          message:    err?.data?.message    as string | undefined,
          disponible: err?.data?.disponible as number | undefined,
        }
      }
    },

    async removeItem(item_id: number) {
      const { base } = this._cfg()
      try {
        await $fetch(`${base}/eqm/cart/items/${item_id}`, {
          method: 'DELETE',
          headers: this._headers(),
        })
        if (this.cart) {
          this.cart.items = this.cart.items.filter(i => i.id !== item_id)
        }
        return { success: true as const }
      } catch {
        return { success: false as const }
      }
    },

    async submit(notas?: string) {
      const { base } = this._cfg()
      try {
        const result = await $fetch<Cart>(`${base}/eqm/cart/submit`, {
          method: 'POST',
          headers: this._headers(),
          body: notas ? { notas_usuario: notas } : {},
        })
        this.cart = null
        return { success: true as const, data: result }
      } catch (err: any) {
        return {
          success: false as const,
          message: err?.data?.message ?? err?.data?.errors as string | undefined,
        }
      }
    },

    reset() {
      this.cart = null
    },
  },
})
