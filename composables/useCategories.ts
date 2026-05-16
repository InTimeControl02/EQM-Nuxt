/**
 * Cache global de categorías.
 * Fetch solo una vez por sesión — los datos se comparten entre todas las páginas
 * vía useState. Recargar la página limpia el cache (comportamiento deseado).
 */

interface Category {
  id: number
  id_padre: number | null
  nombre_es: string
  nombre_en: string
  children?: Category[]
}

export function useCategories() {
  const categories = useState<Category[]>('categories', () => [])
  const loading    = useState<boolean>('categories-loading', () => false)
  const loaded     = useState<boolean>('categories-loaded',  () => false)

  const { apiFetch } = useApi()

  async function fetchIfNeeded() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      const data = await apiFetch<Category[]>('/eqm/categories', 'public')
      categories.value = data ?? []
      loaded.value     = true
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, loaded, fetchIfNeeded }
}
