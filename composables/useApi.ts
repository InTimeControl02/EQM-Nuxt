/**
 * composables/useApi.ts
 *
 * Composable central para llamadas a la API de Laravel.
 * Inyecta automáticamente el Bearer token según el contexto:
 *   - Token público (NUXT_PUBLIC_API_PUBLIC_TOKEN) → catálogo, categorías
 *   - Token privado (API_PRIVATE_TOKEN, solo servidor) → carrito, solicitudes
 */

export type ApiToken = 'public' | 'private' | 'user'

export function useApi() {
  const config = useRuntimeConfig()

  /**
   * Realiza un fetch a la API de Laravel con el token Bearer correspondiente.
   *
   * @param endpoint  Ruta relativa, ej: '/eqm/categories'
   * @param token     'public' (default) | 'private' | 'user' (Bearer del front_user autenticado)
   * @param options   Opciones adicionales de $fetch
   */
  async function apiFetch<T>(
    endpoint: string,
    token: ApiToken = 'public',
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> {
    let bearerToken: string | null = null

    if (token === 'public') {
      bearerToken = config.public.apiPublicToken
    } else if (token === 'private') {
      bearerToken = config.apiPrivateToken
    } else {
      // 'user' — token del front_user autenticado (solo cliente)
      bearerToken = useAuthStore().token
    }

    const baseURL = config.public.apiBase

    return $fetch<T>(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })
  }

  return { apiFetch }
}
