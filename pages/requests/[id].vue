<template>
  <div class="min-h-[calc(100vh-56px)] bg-surface">
    <div class="max-w-4xl mx-auto px-4 md:px-8 py-10">

      <!-- Loading -->
      <div v-if="pending" class="py-24 flex items-center justify-center gap-3 text-slate-400">
        <span class="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
        <span>{{ t('requests.loading') }}</span>
      </div>

      <!-- Error / no encontrada -->
      <div v-else-if="error || !solicitud" class="py-24 text-center">
        <span class="material-symbols-outlined text-5xl text-error block mb-3">error</span>
        <p class="text-slate-500 mb-4">{{ t('requests.error') }}</p>
        <NuxtLink
          to="/requests"
          class="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {{ t('requests.back') }}
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 mb-6">
          <NuxtLink
            to="/requests"
            class="text-[10px] font-bold text-primary/40 uppercase tracking-widest
                   hover:text-primary transition-colors"
          >
            {{ t('requests.title') }}
          </NuxtLink>
          <span class="material-symbols-outlined text-xs text-primary/30">chevron_right</span>
          <span class="text-[10px] font-bold text-primary uppercase tracking-widest">
            #{{ solicitud.id }}
          </span>
        </nav>

        <!-- ── Header card ────────────────────────────────────────── -->
        <div class="bg-surface-container-lowest rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div class="flex items-center gap-3 mb-2 flex-wrap">
                <h1 class="text-2xl font-headline font-extrabold text-primary">
                  {{ t('requests.detail_title') }} #{{ solicitud.id }}
                </h1>
                <span
                  class="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ring-1"
                  :class="statusClass(solicitud.status)"
                >
                  {{ statusLabel(solicitud.status) }}
                </span>
              </div>

              <div class="flex items-center gap-6 flex-wrap text-sm text-slate-400">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-base">send</span>
                  <span>{{ t('requests.submitted_at') }}: {{ fmtDate(solicitud.submitted_at) }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-base">event</span>
                  <span>{{ t('requests.created_at') }}: {{ fmtDate(solicitud.created_at) }}</span>
                </div>
              </div>
            </div>

            <NuxtLink
              to="/requests"
              class="flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors shrink-0"
            >
              <span class="material-symbols-outlined text-base">arrow_back</span>
              {{ t('requests.back') }}
            </NuxtLink>
          </div>
        </div>

        <!-- ── Equipos ─────────────────────────────────────────────── -->
        <div class="bg-surface-container-lowest rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6">
          <div class="px-6 py-4 bg-surface-container-low flex items-center justify-between">
            <h2 class="text-base font-headline font-bold text-primary">
              {{ t('equipment.accessories') !== '' ? t('catalog.title') : 'Equipos' }}
            </h2>
            <span class="text-xs text-slate-400">
              {{ solicitud.items.length }}
              {{ solicitud.items.length === 1
                ? t('requests.items_label').split('|')[0].trim()
                : t('requests.items_label').split('|')[1].trim() }}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-surface-container-low">
                  <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">
                    {{ t('requests.code') }}
                  </th>
                  <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">
                    {{ t('requests.name') }}
                  </th>
                  <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">
                    {{ t('requests.qty') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-container-low">
                <tr v-for="item in solicitud.items" :key="item.id">
                  <td class="px-6 py-4">
                    <NuxtLink
                      :to="`/catalog/${item.equipment_id}`"
                      class="font-mono text-sm text-primary hover:underline"
                    >
                      {{ item.codigo_snapshot }}
                    </NuxtLink>
                  </td>
                  <td class="px-6 py-4 text-sm text-on-surface">
                    {{ item.nombre_snapshot }}
                  </td>
                  <td class="px-6 py-4 text-right text-sm font-semibold text-on-surface">
                    {{ item.es_contable_snapshot && item.cantidad ? item.cantidad : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── Notas ──────────────────────────────────────────────── -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Notas del usuario -->
          <div class="bg-surface-container-lowest rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
              {{ t('requests.notes') }}
            </h3>
            <p
              v-if="solicitud.notas_usuario"
              class="text-sm text-on-surface leading-relaxed"
            >
              {{ solicitud.notas_usuario }}
            </p>
            <p v-else class="text-sm text-slate-300 italic">
              {{ t('requests.no_notes') }}
            </p>
          </div>

          <!-- Notas internas (solo si existen) -->
          <div
            v-if="solicitud.notas_internas"
            class="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm"
          >
            <h3 class="text-sm font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">info</span>
              {{ t('requests.internal_notes') }}
            </h3>
            <p class="text-sm text-amber-800 leading-relaxed">
              {{ solicitud.notas_internas }}
            </p>
          </div>
        </div>
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

const { t, locale } = useI18n({ useScope: 'global' })
const auth  = useAuthStore()
const route = useRoute()
const { apiFetch } = useApi()

const id = computed(() => route.params.id as string)

const { data: solicitud, pending, error } = await useAsyncData<Solicitud>(
  `solicitud-${id.value}`,
  () => auth.isAuthenticated
    ? apiFetch<Solicitud>(`/eqm/solicitudes/${id.value}`, 'user')
    : Promise.resolve(null as any),
  { server: false },
)

// ── Status helpers ────────────────────────────────────────────────
const STATUS_CLASS: Record<string, string> = {
  enviada:   'bg-blue-100 text-blue-700 ring-blue-200',
  aprobada:  'bg-green-100 text-green-700 ring-green-200',
  rechazada: 'bg-red-100 text-red-700 ring-red-200',
  pendiente: 'bg-amber-100 text-amber-700 ring-amber-200',
  cancelada: 'bg-slate-100 text-slate-500 ring-slate-200',
}

function statusClass(s: string) {
  return STATUS_CLASS[s] ?? 'bg-slate-100 text-slate-500 ring-slate-200'
}
function statusLabel(s: string) {
  return t(`requests.status_${s}` as any) || s
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(locale.value === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric', month: 'short', day: '2-digit',
  })
}

useHead({
  title: () => solicitud.value
    ? `${t('requests.detail_title')} #${solicitud.value.id} — Intime Control`
    : 'Intime Control',
})
</script>
