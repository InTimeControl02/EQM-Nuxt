<template>
  <div class="min-h-[calc(100vh-56px)] bg-surface">
    <div class="max-w-4xl mx-auto px-4 md:px-8 py-10">

      <!-- No autenticado -->
      <template v-if="!auth.isAuthenticated">
        <div class="py-32 text-center">
          <span class="material-symbols-outlined text-6xl text-slate-200 block mb-4">assignment</span>
          <p class="text-slate-500 mb-6">{{ t('cart.login_required') }}</p>
          <button
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white
                   font-bold hover:bg-primary-container transition-all"
            @click="authModal.open('login')"
          >
            <span class="material-symbols-outlined">login</span>
            {{ t('nav.login') }}
          </button>
        </div>
      </template>

      <template v-else>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-headline font-extrabold text-primary">{{ t('requests.title') }}</h1>
            <p v-if="response?.total" class="text-sm text-slate-400 mt-1">
              {{ t('requests.total', { total: response.total }) }}
            </p>
          </div>
          <NuxtLink
            to="/catalog"
            class="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <span class="material-symbols-outlined text-base">inventory_2</span>
            {{ t('catalog.breadcrumb') }}
          </NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="pending" class="py-24 flex items-center justify-center gap-3 text-slate-400">
          <span class="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
          <span>{{ t('requests.loading') }}</span>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="py-24 text-center">
          <span class="material-symbols-outlined text-5xl text-error block mb-3">error</span>
          <p class="text-slate-500">{{ t('requests.error') }}</p>
        </div>

        <!-- Vacío -->
        <div v-else-if="!response?.data.length" class="py-32 text-center">
          <span class="material-symbols-outlined text-6xl text-slate-200 block mb-4">assignment</span>
          <p class="text-xl font-bold text-slate-400 mb-2">{{ t('requests.empty') }}</p>
          <NuxtLink
            to="/catalog"
            class="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-primary text-white
                   font-bold hover:bg-primary-container transition-all"
          >
            <span class="material-symbols-outlined">inventory_2</span>
            {{ t('requests.empty_cta') }}
          </NuxtLink>
        </div>

        <!-- Lista -->
        <template v-else>
          <div class="space-y-3">
            <NuxtLink
              v-for="sol in response.data"
              :key="sol.id"
              :to="`/requests/${sol.id}`"
              class="block bg-surface-container-lowest rounded-2xl p-5 border border-slate-100
                     shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div class="flex items-start justify-between gap-4">
                <!-- Info principal -->
                <div class="flex items-center gap-4 min-w-0">
                  <div
                    class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    :class="statusBg(sol.status)"
                  >
                    <span class="material-symbols-outlined text-xl" :class="statusIcon(sol.status).color">
                      {{ statusIcon(sol.status).icon }}
                    </span>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-3 flex-wrap">
                      <span class="font-bold text-on-surface">
                        {{ t('requests.detail_title') }} #{{ sol.id }}
                      </span>
                      <span
                        class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ring-1"
                        :class="statusClass(sol.status)"
                      >
                        {{ statusLabel(sol.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-slate-400 mt-1">
                      {{ itemsLabel(sol.items?.length ?? 0) }}
                      ·
                      {{ fmtDate(sol.submitted_at ?? sol.created_at) }}
                    </p>
                  </div>
                </div>

                <!-- Flecha -->
                <span
                  class="material-symbols-outlined text-slate-300 group-hover:text-primary
                         group-hover:translate-x-0.5 transition-all shrink-0"
                >
                  chevron_right
                </span>
              </div>

              <!-- Preview de items (máx 3) -->
              <div v-if="sol.items?.length" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="item in sol.items.slice(0, 3)"
                  :key="item.id"
                  class="px-2 py-0.5 rounded-lg bg-surface-container text-[11px] text-slate-500 font-mono"
                >
                  {{ item.codigo_snapshot }}
                </span>
                <span
                  v-if="(sol.items?.length ?? 0) > 3"
                  class="px-2 py-0.5 rounded-lg bg-surface-container text-[11px] text-slate-400"
                >
                  +{{ sol.items.length - 3 }}
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Paginación -->
          <div
            v-if="response.last_page > 1"
            class="flex items-center justify-center gap-1 mt-8"
          >
            <button
              :disabled="currentPage === 1"
              class="p-2 rounded-lg hover:bg-surface-container disabled:opacity-40
                     disabled:cursor-not-allowed text-slate-600 hover:text-primary transition-colors"
              @click="goToPage(currentPage - 1)"
            >
              <span class="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            <button
              v-for="page in response.last_page"
              :key="page"
              class="w-9 h-9 rounded-lg text-sm font-bold transition-colors"
              :class="currentPage === page
                ? 'bg-primary text-white'
                : 'text-slate-600 hover:bg-surface-container'"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              :disabled="currentPage === response.last_page"
              class="p-2 rounded-lg hover:bg-surface-container disabled:opacity-40
                     disabled:cursor-not-allowed text-slate-600 hover:text-primary transition-colors"
              @click="goToPage(currentPage + 1)"
            >
              <span class="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

interface SolicitudItem {
  id: number
  solicitud_id: number
  equipment_id: number
  codigo_snapshot: string
  nombre_snapshot: string
  es_contable_snapshot: boolean
  cantidad: number | null
}

interface Solicitud {
  id: number
  front_user_id: number
  status: string
  notas_usuario: string | null
  notas_internas: string | null
  submitted_at: string | null
  created_at: string
  items: SolicitudItem[]
}

interface SolicitudesResponse {
  current_page: number
  data: Solicitud[]
  last_page: number
  total: number
  per_page: number
  from: number
  to: number
}

const { t, locale } = useI18n({ useScope: 'global' })
const auth      = useAuthStore()
const authModal = useAuthModal()
const route     = useRoute()
const router    = useRouter()
const { apiFetch } = useApi()

const currentPage = computed(() => Number(route.query.page) || 1)

const { data: response, pending, error } = await useAsyncData<SolicitudesResponse>(
  'solicitudes-list',
  () => auth.isAuthenticated
    ? apiFetch<SolicitudesResponse>('/eqm/solicitudes', 'user', {
        params: { page: currentPage.value },
      })
    : Promise.resolve(null as any),
  { server: false, watch: [currentPage, () => auth.isAuthenticated] },
)

function itemsLabel(count: number): string {
  const raw   = t('requests.items_label') ?? ''
  const parts = raw.split('|')
  const sing  = parts[0]?.trim() ?? ''
  const plur  = parts[1]?.trim() ?? sing
  return `${count} ${count === 1 ? sing : plur}`
}

function goToPage(page: number) {
  router.push({ query: { ...route.query, page } })
}

// ── Status helpers ────────────────────────────────────────────────
const STATUS_CLASS: Record<string, string> = {
  enviada:   'bg-blue-100 text-blue-700 ring-blue-200',
  aprobada:  'bg-green-100 text-green-700 ring-green-200',
  rechazada: 'bg-red-100 text-red-700 ring-red-200',
  pendiente: 'bg-amber-100 text-amber-700 ring-amber-200',
  cancelada: 'bg-slate-100 text-slate-500 ring-slate-200',
}
const STATUS_BG: Record<string, string> = {
  enviada:   'bg-blue-50',
  aprobada:  'bg-green-50',
  rechazada: 'bg-red-50',
  pendiente: 'bg-amber-50',
  cancelada: 'bg-slate-100',
}
const STATUS_ICON: Record<string, { icon: string; color: string }> = {
  enviada:   { icon: 'send',        color: 'text-blue-500' },
  aprobada:  { icon: 'check_circle',color: 'text-green-500' },
  rechazada: { icon: 'cancel',      color: 'text-red-500' },
  pendiente: { icon: 'schedule',    color: 'text-amber-500' },
  cancelada: { icon: 'block',       color: 'text-slate-400' },
}

function statusClass(s: string)  { return STATUS_CLASS[s] ?? 'bg-slate-100 text-slate-500 ring-slate-200' }
function statusBg(s: string)     { return STATUS_BG[s]    ?? 'bg-slate-100' }
function statusIcon(s: string)   { return STATUS_ICON[s]  ?? { icon: 'help', color: 'text-slate-400' } }
function statusLabel(s: string)  {
  const key = `requests.status_${s}` as any
  return t(key) || s
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(locale.value === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric', month: 'short', day: '2-digit',
  })
}

useHead({ title: () => `${t('requests.title')} — Intime Control` })
</script>
