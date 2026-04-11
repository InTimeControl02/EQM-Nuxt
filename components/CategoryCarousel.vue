<template>
  <!-- Sección carrusel -->
  <section class="snap-start min-h-screen flex flex-col justify-center
                  px-8 py-16 bg-surface-container-lowest overflow-hidden">
    <div class="max-w-7xl mx-auto w-full">

      <!-- Header del carrusel -->
      <div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 class="text-3xl font-extrabold font-headline text-primary itc-animate-in itc-delay-1">
            {{ t('categories.title') }}
          </h2>
          <p class="text-secondary mt-2 itc-animate-in itc-delay-2">
            {{ t('categories.subtitle') }}
          </p>
        </div>

        <!-- Controles -->
        <div class="flex items-center gap-3 itc-animate-in itc-delay-3">
          <span class="text-xs text-slate-400">
            {{ t('categories.items', { count: rootCategories.length }) }}
          </span>
          <button
            class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center
                   text-slate-400 hover:border-primary hover:text-primary transition-all
                   disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="!canScrollLeft"
            :title="t('categories.prev')"
            @click="scrollCarousel(-1)"
          >
            <span class="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <button
            class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center
                   text-slate-400 hover:border-primary hover:text-primary transition-all
                   disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="!canScrollRight"
            :title="t('categories.next')"
            @click="scrollCarousel(1)"
          >
            <span class="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- Estado: cargando -->
      <div v-if="pending" class="flex items-center gap-3 py-12 text-slate-400">
        <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
        <span class="text-sm">{{ t('categories.loading') }}</span>
      </div>

      <!-- Estado: error -->
      <div v-else-if="error" class="py-12 text-center">
        <span class="material-symbols-outlined text-error text-3xl block mb-2">error</span>
        <p class="text-sm text-slate-500">{{ t('categories.error') }}</p>
      </div>

      <!-- Carrusel -->
      <div
        v-else
        ref="carouselRef"
        class="flex gap-6 overflow-x-auto pb-4 hide-scrollbar select-none"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @scroll="updateScrollState"
        @mousedown="onDragStart"
        @mousemove="onDragMove"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
      >
        <div
          v-for="category in rootCategories"
          :key="category.id"
          class="min-w-[280px] max-w-[280px] min-h-[250px] max-h-[250px] card p-7 shrink-0
                 flex flex-col itc-animate-in"
          :style="isDragging ? 'pointer-events: none' : ''"
        >
          <!-- Nombre según locale -->
          <h4 class="font-bold text-lg mb-2 text-on-surface font-headline leading-snug line-clamp-2">
            {{ locale === 'es' ? category.nombre_es : category.nombre_en }}
          </h4>

          <!-- Descripción según locale — crece para llenar espacio -->
          <p class="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
            {{ (locale === 'es' ? category.descripcion_es : category.descripcion_en) || '—' }}
          </p>

          <!-- Código + badge de hijos -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
            <span class="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-1 rounded">
              #{{ category.codigo }}
            </span>
            <span
              v-if="category.children?.length"
              class="text-[11px] font-bold text-secondary bg-surface-container-low px-2 py-1 rounded-full"
            >
              {{ category.children.length }} sub
            </span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const { t, locale } = useI18n({ useScope: 'global' })
const { apiFetch } = useApi()

// ── Tipos ──────────────────────────────────────────────────────────
interface Category {
  id: number
  id_padre: number | null
  codigo: string
  nombre_es: string
  nombre_en: string
  descripcion_es: string | null
  descripcion_en: string | null
  nodo: number
  children?: Category[]
}

// ── Fetch de categorías ────────────────────────────────────────────
const { data, pending, error } = await useAsyncData<Category[]>(
  'eqm-categories',
  () => apiFetch<Category[]>('/eqm/categories', 'public'),
)

const rootCategories = computed<Category[]>(() =>
  (data.value ?? []).filter((c) => c.nodo === 1),
)

// ── Carrusel ───────────────────────────────────────────────────────
const carouselRef    = ref<HTMLElement | null>(null)
const canScrollLeft  = ref(false)
const canScrollRight = ref(false)
const CARD_WIDTH     = 280 + 24

function scrollCarousel(direction: -1 | 1) {
  carouselRef.value?.scrollBy({ left: direction * CARD_WIDTH, behavior: 'smooth' })
}

function updateScrollState() {
  const el = carouselRef.value
  if (!el) return
  canScrollLeft.value  = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

onMounted(async () => {
  await nextTick()
  updateScrollState()
})

watch(rootCategories, async () => {
  await nextTick()
  updateScrollState()
}, { immediate: false })

// ── Drag-to-scroll ─────────────────────────────────────────────────
const isDragging  = ref(false)
const dragStartX  = ref(0)
const scrollStart = ref(0)

function onDragStart(e: MouseEvent) {
  isDragging.value  = true
  dragStartX.value  = e.pageX
  scrollStart.value = carouselRef.value?.scrollLeft ?? 0
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value || !carouselRef.value) return
  carouselRef.value.scrollLeft = scrollStart.value - (e.pageX - dragStartX.value)
}

function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  updateScrollState()
}

// Touch
const touchStartX = ref(0)
const touchScrollStart = ref(0)

function onTouchStart(e: TouchEvent) {
  touchStartX.value     = e.touches[0].pageX
  touchScrollStart.value = carouselRef.value?.scrollLeft ?? 0
}

function onTouchMove(e: TouchEvent) {
  if (!carouselRef.value) return
  carouselRef.value.scrollLeft = touchScrollStart.value - (e.touches[0].pageX - touchStartX.value)
  updateScrollState()
}
</script>
