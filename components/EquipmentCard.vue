<template>
  <NuxtLink :to="`/catalog/${equipment.id}`"
    class="bg-surface-container-lowest rounded-xl overflow-hidden
           shadow-[0_4px_20px_rgba(7,30,39,0.04)]
           hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
  >
    <!-- Imagen / Placeholder -->
    <div
      class="relative h-40 flex items-center justify-center shrink-0 overflow-hidden"
      :class="coverUrl && !imgError ? 'bg-white p-2' : 'bg-surface-container-low p-4'"
    >
      <img
        v-if="coverUrl && !imgError"
        :src="coverUrl"
        :alt="name"
        class="h-full w-full object-contain"
        @error="imgError = true"
      />
      <span v-else class="material-symbols-outlined text-slate-300 text-5xl">precision_manufacturing</span>

      <!-- Badge de estado -->
      <span
        class="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ring-1"
        :class="statusClass"
      >
        {{ equipment.status }}
      </span>
    </div>

    <!-- Contenido -->
    <div class="p-4 flex flex-col flex-1">
      <h3 class="font-headline font-bold text-base text-primary leading-snug mb-3 min-h-[3rem] line-clamp-2">
        {{ name }}
      </h3>

      <div class="space-y-1.5 text-[13px] flex-1">
        <div class="flex justify-between border-b border-slate-50 pb-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">{{ t('catalog.mfr') }}</span>
          <span class="font-medium text-on-surface">{{ equipment.marca || '—' }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-50 pb-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">{{ t('catalog.model') }}</span>
          <span class="font-medium text-on-surface">{{ equipment.modelo || '—' }}</span>
        </div>
        <div class="flex justify-between border-b border-slate-50 pb-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">{{ t('catalog.location') }}</span>
          <span class="font-medium text-on-surface text-right truncate max-w-[55%]">{{ locationLabel }}</span>
        </div>
        <div class="flex flex-col gap-0.5 border-b border-slate-50 pb-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">{{ t('catalog.code') }}</span>
          <span class="font-medium text-on-surface font-mono text-[11px] tracking-tight">{{ equipment.codigo || '—' }}</span>
        </div>
        <div v-if="capacidad" class="flex justify-between">
          <span class="text-[10px] font-bold text-slate-400 uppercase">{{ t('catalog.capacity') }}</span>
          <span class="font-medium text-on-surface">{{ capacidad }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface EquipmentImage {
  id: number
  path: string
  disk: string
  type: string
}

interface CapacidadRango {
  [key: string]: { valor: string; codigo: string }
}

interface EquipmentLocation {
  project?: { nombre_proy: string; ciudad?: string }
}

interface Equipment {
  id: number
  codigo: string
  nombre_es: string
  nombre_en: string
  marca: string
  modelo: string
  numero_serie: string
  anio_fabricacion: number
  capacidad_rango: CapacidadRango | null
  unidad_medida: string
  status: string
  cantidad_total: number | null
  cover_image: EquipmentImage | null
  current_location: EquipmentLocation | null
}

const props = defineProps<{ equipment: Equipment }>()

const { t, locale } = useI18n({ useScope: 'global' })
const { imageUrl } = useImageUrl()

const name = computed(() =>
  locale.value === 'es' ? props.equipment.nombre_es : props.equipment.nombre_en,
)

const imgError = ref(false)
const coverUrl = computed(() => imageUrl(props.equipment.cover_image?.path))

const locationLabel = computed(() =>
  props.equipment.current_location?.project?.nombre_proy || '—',
)

const capacidad = computed(() => {
  const rango = props.equipment.capacidad_rango
  if (!rango || typeof rango !== 'object') return null
  const vals = Object.values(rango).map((r) => r.valor).filter(Boolean)
  if (!vals.length) return null
  const unit = props.equipment.unidad_medida || ''
  return `${vals[0]}${vals[1] ? ' ~ ' + vals[1] : ''} ${unit}`.trim()
})

// ── Colores por estado ────────────────────────────────────────────
const STATUS_MAP: Record<string, string> = {
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

const statusClass = computed(
  () => STATUS_MAP[props.equipment.status] ?? 'bg-slate-100 text-slate-600 ring-slate-200',
)
</script>
