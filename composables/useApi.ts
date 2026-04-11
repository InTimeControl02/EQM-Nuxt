/**
 * composables/useApi.ts
 *
 * Composable central para llamadas a la API de Laravel.
 * Inyecta automáticamente el Bearer token según el contexto:
 *   - Token público (NUXT_PUBLIC_API_PUBLIC_TOKEN) → catálogo, categorías
 *   - Token privado (API_PRIVATE_TOKEN, solo servidor) → carrito, solicitudes
 */

export type ApiToken = 'public' | 'private'

export function useApi() {
  const config = useRuntimeConfig()

  /**
   * Realiza un fetch a la API de Laravel con el token Bearer correspondiente.
   *
   * @param endpoint  Ruta relativa, ej: '/eqm/categories'
   * @param token     'public' (default) | 'private'
   * @param options   Opciones adicionales de $fetch
   */
  async function apiFetch<T>(
    endpoint: string,
    token: ApiToken = 'public',
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> {
    // El token público está disponible en cliente y servidor.
    // El token privado SOLO debe usarse en server-side (server routes / useAsyncData en SSR).
    const bearerToken =
      token === 'public'
        ? config.public.apiPublicToken
        : config.apiPrivateToken

    const baseURL = config.public.apiBase

    return $fetch<T>(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })
  }

  return { apiFetch }
}
