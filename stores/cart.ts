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
    // equipment_id de items que el admin ocultó (mostrar_en_front=false)
    unavailableIds: [] as number[],
    isCheckingAvailability: false,
  }),

  getters: {
    itemCount: (state) => state.cart?.items.length ?? 0,
    items: (state) => state.cart?.items ?? [],
    isEmpty: (state) => !state.cart?.items.length,
    unavailableItems: (state) =>
      (state.cart?.items ?? []).filter(i => state.unavailableIds.includes(i.equipment_id)),
    hasUnavailable(): boolean {
      return this.unavailableItems.length > 0
    },
  },

  actions: {
    _cfg() {
      const config = useRuntimeConfig()
      return {
        base: config.public.apiBase as string,
        token: useAuthStore().token as string | null,
        publicToken: config.public.apiPublicToken as string,
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
      await this.checkAvailability()
    },

    /**
     * Verifica cada item del carrito contra GET /eqm/equipment/{id}.
     * Un 404 significa mostrar_en_front=false → equipo ya no disponible.
     * Otros errores (red, 5xx) se ignoran para no marcar falsos positivos.
     */
    async checkAvailability() {
      const items = this.items
      if (!items.length) {
        this.unavailableIds = []
        return
      }
      const { base, publicToken } = this._cfg()
      this.isCheckingAvailability = true
      try {
        const ids = [...new Set(items.map(i => i.equipment_id))]
        const results = await Promise.all(ids.map(async (equipmentId) => {
          try {
            await $fetch(`${base}/eqm/equipment/${equipmentId}`, {
              headers: {
                ...(publicToken ? { Authorization: `Bearer ${publicToken}` } : {}),
                Accept: 'application/json',
              },
            })
            return null
          } catch (err: any) {
            const status = err?.statusCode ?? err?.response?.status
            return status === 404 ? equipmentId : null
          }
        }))
        this.unavailableIds = results.filter((id): id is number => id !== null)
      } finally {
        this.isCheckingAvailability = false
      }
    },

    /** Marca como no disponibles los items cuyo nombre venga del 422 de submit. */
    markUnavailableByName(names: string[]) {
      const ids = this.items
        .filter(i => names.includes(i.nombre_snapshot))
        .map(i => i.equipment_id)
      this.unavailableIds = [...new Set([...this.unavailableIds, ...ids])]
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
          const removed = this.cart.items.find(i => i.id === item_id)
          this.cart.items = this.cart.items.filter(i => i.id !== item_id)
          // Si ya no queda ningun item con ese equipo, sale de la lista de no disponibles
          if (removed && !this.cart.items.some(i => i.equipment_id === removed.equipment_id)) {
            this.unavailableIds = this.unavailableIds.filter(id => id !== removed.equipment_id)
          }
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
        this.unavailableIds = []
        return { success: true as const, data: result }
      } catch (err: any) {
        return {
          success: false as const,
          message: (err?.data?.message ?? err?.data?.errors) as string | undefined,
          // Equipos ocultados por el admin después de agregarse al carrito
          unavailable: err?.data?.equipos_no_disponibles as string[] | undefined,
        }
      }
    },

    /** Quita del carrito todos los items marcados como no disponibles. */
    async removeUnavailableItems() {
      const targets = [...this.unavailableItems]
      for (const item of targets) await this.removeItem(item.id)
      this.unavailableIds = []
      return targets.length
    },

    reset() {
      this.cart = null
      this.unavailableIds = []
    },
  },
})
