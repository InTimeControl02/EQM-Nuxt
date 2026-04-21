<template>
  <div class="flex bg-surface">

    <!-- ── Botón hamburguesa (móvil) ──────────────────────────────── -->
    <button
      class="md:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg
             flex items-center justify-center hover:bg-primary-container transition-colors"
      @click="sidebarOpen = true"
    >
      <span class="material-symbols-outlined text-2xl">menu</span>
    </button>

    <!-- ── Sidebar (desktop) ─────────────────────────────────────── -->
    <aside
      class="hidden md:block w-72 shrink-0 bg-slate-50 border-r border-slate-100
             sticky top-14 h-[calc(100vh-56px)] overflow-y-auto no-scrollbar"
    >
      <CatalogSidebar
        :categories="allCategories"
        :selected-id="selectedCategoryId"
        @select="onCategorySelect"
      />
    </aside>

    <!-- ── Sidebar móvil (overlay) ───────────────────────────────── -->
    <Teleport to="body">
      <Transition name="sidebar">
        <div v-if="sidebarOpen" class="md:hidden fixed inset-0 z-50">
          <!-- Fondo oscurecido -->
          <div class="absolute inset-0 bg-black/50" @click="sidebarOpen = false" />

          <!-- Panel del sidebar -->
          <aside class="absolute left-0 top-0 bottom-0 w-72 bg-slate-50 overflow-y-auto no-scrollbar shadow-xl">
            <!-- Header del sidebar móvil -->
            <div class="sticky top-0 bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <button
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
                @click="sidebarOpen = false"
              >
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- Contenido del sidebar -->
            <CatalogSidebar
              :categories="allCategories"
              :selected-id="selectedCategoryId"
              @select="(id) => { onCategorySelect(id); sidebarOpen = false }"
            />
          </aside>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Contenido principal ───────────────────────────────────── -->
    <div class="flex-1 min-w-0 p-8">

      <!-- Cabecera -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <nav class="flex items-center gap-1.5 mb-2">
            <span class="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
              {{ t('catalog.breadcrumb') }}
            </span>
            <span class="material-symbols-outlined text-xs text-primary/40">chevron_right</span>
            <span class="text-[10px] font-bold text-primary uppercase tracking-widest">
              {{ t('catalog.active_units') }}
            </span>
          </nav>
          <h1 class="text-4xl font-extrabold tracking-tight font-headline text-on-background">
            {{ t('catalog.title') }}
          </h1>
        </div>

        <!-- Toggle vista -->
        <div class="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg shrink-0">
          <button
            class="px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold transition-all"
            :class="view === 'card' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'"
            @click="view = 'card'"
          >
            <span class="material-symbols-outlined text-sm">grid_view</span>
            {{ t('catalog.card_view') }}
          </button>
          <button
            class="px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all"
            :class="view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'"
            @click="view = 'list'"
          >
            <span class="material-symbols-outlined text-sm">list</span>
            {{ t('catalog.list_view') }}
          </button>
        </div>
      </div>

      <!-- Chip de búsqueda activa -->
      <div v-if="searchQuery" class="mb-5 flex items-center gap-2">
        <span class="text-xs text-slate-500">{{ t('catalog.search_active') }}:</span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <span class="material-symbols-outlined text-sm">search</span>
          "{{ searchQuery }}"
          <button class="ml-1 hover:text-primary/60 transition-colors" @click="clearSearch">
            <span class="material-symbols-outlined text-sm leading-none">close</span>
          </button>
        </span>
      </div>

      <!-- Estado: cargando -->
      <div v-if="pending" class="flex items-center gap-3 py-24 justify-center text-slate-400">
        <span class="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
        <span>{{ t('catalog.loading') }}</span>
      </div>

      <!-- Estado: error -->
      <div v-else-if="error" class="py-24 text-center">
        <span class="material-symbols-outlined text-error text-4xl block mb-3">error</span>
        <p class="text-slate-500">{{ t('catalog.error') }}</p>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="!items.length" class="py-24 text-center">
        <span class="material-symbols-outlined text-slate-300 text-5xl block mb-3">inventory_2</span>
        <p class="text-slate-500">{{ t('catalog.no_results') }}</p>
      </div>

      <!-- Grid de tarjetas -->
      <div
        v-else-if="view === 'card'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8"
      >
        <EquipmentCard v-for="item in items" :key="item.id" :equipment="item" />
      </div>

      <!-- Vista lista -->
      <div v-else class="flex flex-col gap-2 mb-8">
        <div
          v-for="item in items"
          :key="item.id"
          class="bg-surface-container-lowest rounded-xl px-5 py-4 flex items-center gap-5
                 shadow-[0_2px_10px_rgba(7,30,39,0.04)] hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <!-- Imagen -->
          <div
            class="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
            :class="imageUrl(item.cover_image?.path) ? 'bg-white p-1' : 'bg-surface-container-low'"
          >
            <img
              v-if="imageUrl(item.cover_image?.path)"
              :src="imageUrl(item.cover_image?.path)!"
              :alt="locale === 'es' ? item.nombre_es : item.nombre_en"
              class="h-full w-full object-contain"
            />
            <span v-else class="material-symbols-outlined text-slate-300 text-2xl">precision_manufacturing</span>
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <h3 class="font-headline font-bold text-sm text-primary leading-snug line-clamp-1">
                {{ locale === 'es' ? item.nombre_es : item.nombre_en }}
              </h3>
              <span
                class="shrink-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ring-1"
                :class="listStatusClass(item.status)"
              >
                {{ item.status }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">{{ item.marca }} · {{ item.modelo }}</p>
          </div>
          <!-- Código completo -->
          <div class="shrink-0 hidden sm:flex flex-col items-end gap-0.5">
            <span class="text-[9px] font-bold text-slate-400 uppercase">{{ t('catalog.code') }}</span>
            <span class="font-mono text-xs text-slate-500 tracking-tight">{{ item.codigo }}</span>
          </div>
        </div>
      </div>

      <!-- ── Paginación ─────────────────────────────────────────────── -->
      <div
        v-if="meta && meta.total > 0"
        class="pt-6 border-t border-slate-200 space-y-4"
      >
        <!-- Info + selector per_page -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p class="text-xs text-slate-500">
            {{ t('catalog.showing', { from: meta.from, to: meta.to, total: meta.total }) }}
            <span class="mx-1.5 text-slate-300">·</span>
            {{ t('catalog.page_of', { current: currentPage, last: meta.last_page }) }}
          </p>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400">{{ t('catalog.per_page') }}:</span>
            <div class="flex items-center gap-1">
              <button
                v-for="n in [12, 24, 48]"
                :key="n"
                class="px-2.5 py-1 rounded text-xs font-semibold transition-all"
                :class="currentPerPage === n
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 text-slate-500 hover:bg-slate-50'"
                @click="changePerPage(n)"
              >
                {{ n }}
              </button>
            </div>
          </div>
        </div>

        <!-- Controles de página -->
        <div class="flex items-center justify-center gap-1.5 flex-wrap">
          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200
                   text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            :title="t('catalog.first_page')"
            @click="goToPage(1)"
          >
            <span class="material-symbols-outlined text-sm">first_page</span>
          </button>

          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200
                   text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>

          <template v-for="p in visiblePages" :key="p">
            <span v-if="p === '...'" class="px-1.5 text-slate-400 text-sm select-none">···</span>
            <button
              v-else
              class="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors"
              :class="p === currentPage
                ? 'bg-primary text-white shadow-sm'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'"
              @click="goToPage(p as number)"
            >
              {{ p }}
            </button>
          </template>

          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200
                   text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="currentPage === meta.last_page"
            @click="goToPage(currentPage + 1)"
          >
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>

          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200
                   text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="currentPage === meta.last_page"
            :title="t('catalog.last_page')"
            @click="goToPage(meta.last_page)"
          >
            <span class="material-symbols-outlined text-sm">last_page</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'global' })
const route  = useRoute()
const router = useRouter()
const { imageUrl } = useImageUrl()

useHead({ title: () => `${t('catalog.title')} — Intime Control` })

// ── Tipos ──────────────────────────────────────────────────────────
interface Category {
  id: number
  id_padre: number | null
  codigo: string
  nombre_es: string
  nombre_en: string
  nodo: number
}

interface EquipmentImage { id: number; path: string; disk: string; type: string }

interface Equipment {
  id: number
  codigo: string
  nombre_es: string
  nombre_en: string
  marca: string
  modelo: string
  numero_serie: string
  anio_fabricacion: number
  capacidad_rango: Record<string, { valor: string; codigo: string }> | null
  unidad_medida: string
  status: string
  cantidad_total: number | null
  cover_image: EquipmentImage | null
  current_location: { project?: { nombre_proy: string } } | null
}

interface PaginatedResponse {
  data: Equipment[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  next_page_url: string | null
  prev_page_url: string | null
}

// La API puede devolver array plano O wrapper Laravel paginado
type EquipmentApiResponse = Equipment[] | PaginatedResponse

// ── Estado ─────────────────────────────────────────────────────────
const view = ref<'card' | 'list'>('card')
const sidebarOpen = ref(false)

const currentPage        = computed(() => Number(route.query.page)     || 1)
const currentPerPage     = computed(() => Number(route.query.per_page) || 12)
const selectedCategoryId = computed(() => route.query.category ? Number(route.query.category) : null)
const searchQuery        = computed(() => (route.query.search as string) || undefined)

// ── Colores estado (vista lista) ──────────────────────────────────
const LIST_STATUS_MAP: Record<string, string> = {
  'Nuevo':           'bg-green-100 text-green-700 ring-green-200',
  'Bueno':           'bg-green-100 text-green-700 ring-green-200',
  'Activo':          'bg-green-100 text-green-700 ring-green-200',
  'Usado':           'bg-slate-100 text-slate-600 ring-slate-200',
  'Regular':         'bg-slate-100 text-slate-600 ring-slate-200',
  'En Reparación':   'bg-orange-100 text-orange-700 ring-orange-200',
  'Reparación':      'bg-orange-100 text-orange-700 ring-orange-200',
  'Dañado':          'bg-red-100 text-red-700 ring-red-200',
  'Descompuesto':    'bg-red-100 text-red-700 ring-red-200',
  'Reacondicionado': 'bg-purple-100 text-purple-700 ring-purple-200',
  'Reservado':       'bg-amber-100 text-amber-700 ring-amber-200',
  'Prestado':        'bg-blue-100 text-blue-700 ring-blue-200',
}
function listStatusClass(status: string) {
  return LIST_STATUS_MAP[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200'
}

function clearSearch() {
  const q = { ...route.query }
  delete q.search
  q.page = '1'
  router.push({ query: q })
}

// ── Fetch ──────────────────────────────────────────────────────────
const { apiFetch } = useApi()

const { data: categoriesData } = await useAsyncData<Category[]>(
  'catalog-categories',
  () => apiFetch<Category[]>('/eqm/categories', 'public'),
)
const allCategories = computed(() => categoriesData.value ?? [])

// Clave dinámica para que useAsyncData re-fetche al cambiar parámetros
const equipmentKey = computed(() =>
  `catalog-equipment:${currentPage.value}:${currentPerPage.value}:${selectedCategoryId.value ?? 'all'}:${searchQuery.value ?? ''}`,
)

const { data: equipmentData, pending, error } = await useAsyncData<EquipmentApiResponse>(
  equipmentKey.value,
  () => apiFetch<EquipmentApiResponse>('/eqm/equipment', 'public', {
    params: {
      page:     currentPage.value,
      per_page: currentPerPage.value,
      ...(selectedCategoryId.value !== null ? { category_with_children: selectedCategoryId.value } : {}),
      ...(searchQuery.value                 ? { search: searchQuery.value }                         : {}),
    },
  }),
  { watch: [equipmentKey] },
)

// Normalizar respuesta: array plano o paginado → siempre array
const items = computed<Equipment[]>(() => {
  const d = equipmentData.value
  if (!d) return []
  if (Array.isArray(d)) return d
  return d.data ?? []
})

// Meta de paginación: null cuando la respuesta es array plano sin total
const meta = computed(() => {
  const d = equipmentData.value
  if (!d) return null
  if (!Array.isArray(d) && 'total' in d) {
    return {
      current_page: d.current_page,
      last_page:    d.last_page,
      per_page:     d.per_page,
      total:        d.total,
      from:         d.from ?? 0,
      to:           d.to   ?? 0,
    }
  }
  // Array plano: no mostrar paginación (la API no devolvió metadatos)
  return null
})

// ── Navegación ─────────────────────────────────────────────────────
function goToPage(page: number) {
  router.push({ query: { ...route.query, page } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function changePerPage(n: number) {
  router.push({ query: { ...route.query, per_page: n, page: 1 } })
}

function onCategorySelect(id: number | null) {
  const q: Record<string, string | number> = { page: 1 }
  if (id !== null)           q.category = id
  if (route.query.search)    q.search   = route.query.search as string
  if (route.query.per_page)  q.per_page = route.query.per_page as string
  router.push({ query: q })
}

// ── Páginas visibles ───────────────────────────────────────────────
const visiblePages = computed(() => {
  const last = meta.value?.last_page ?? 1
  const cur  = currentPage.value
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (cur > 3) pages.push('...')
  for (let p = Math.max(2, cur - 1); p <= Math.min(last - 1, cur + 1); p++) pages.push(p)
  if (cur < last - 2) pages.push('...')
  pages.push(last)
  return pages
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Transición del sidebar móvil */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity 0.3s ease;
}
.sidebar-enter-active aside,
.sidebar-leave-active aside {
  transition: transform 0.3s ease;
}
.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}
.sidebar-enter-from aside,
.sidebar-leave-to aside {
  transform: translateX(-100%);
}
</style>
