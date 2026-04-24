<template>
  <section class="snap-start min-h-screen flex flex-col justify-center
                  px-8 py-16 bg-surface-container-lowest">
    <div class="max-w-7xl mx-auto w-full">

      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-extrabold font-headline text-primary mb-4 itc-animate-in itc-delay-1">
          {{ t('categories.title') }}
        </h2>
        <p class="text-lg text-secondary max-w-2xl mx-auto itc-animate-in itc-delay-2">
          {{ t('categories.subtitle') }}
        </p>
      </div>

      <!-- Estado: cargando -->
      <div v-if="pending" class="flex items-center justify-center gap-3 py-24 text-slate-400">
        <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
        <span class="text-sm">{{ t('categories.loading') }}</span>
      </div>

      <!-- Estado: error -->
      <div v-else-if="error" class="py-24 text-center">
        <span class="material-symbols-outlined text-error text-3xl block mb-2">error</span>
        <p class="text-sm text-slate-500">{{ t('categories.error') }}</p>
      </div>

      <!-- Grid de categorías -->
      <div
        v-else
        class="grid grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <NuxtLink
          v-for="(category, i) in displayCategories"
          :key="category.id"
          :to="`/catalog?category=${category.id}`"
          class="group card overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300
                 itc-animate-in"
          :class="`itc-delay-${Math.min(i + 2, 6)}`"
        >
          <!-- Placeholder colorido con icono -->
          <div
            class="h-40 flex items-center justify-center"
            :class="categoryBg(i)"
          >
            <span class="material-symbols-outlined text-6xl text-white/90">{{ categoryIcon(i) }}</span>
          </div>

          <!-- Info -->
          <div class="flex flex-col flex-1 p-5">
            <h3 class="font-headline font-bold text-base text-on-surface leading-snug line-clamp-2 mb-2">
              {{ locale === 'es' ? category.nombre_es : category.nombre_en }}
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
              {{ (locale === 'es' ? category.descripcion_es : category.descripcion_en) || t('categories.no_desc') }}
            </p>

            <div class="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
              <span class="font-mono text-[10px] font-bold text-primary bg-surface-container px-2 py-0.5 rounded">
                #{{ category.codigo }}
              </span>
              <span class="flex items-center gap-1 text-xs font-semibold text-primary
                           group-hover:gap-2 transition-all duration-200">
                {{ t('categories.browse') }}
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- CTA ver todo -->
      <div v-if="!pending && !error && displayCategories.length" class="text-center mt-10 itc-animate-in itc-delay-6">
        <NuxtLink to="/catalog" class="btn-ghost inline-flex items-center gap-2">
          {{ t('categories.view_all') }}
          <span class="material-symbols-outlined text-xl">grid_view</span>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'global' })
const { apiFetch } = useApi()

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

const { data, pending, error } = await useAsyncData<Category[]>(
  'eqm-categories',
  () => apiFetch<Category[]>('/eqm/categories', 'public'),
)

const displayCategories = computed<Category[]>(() =>
  (data.value ?? []).filter((c) => c.nodo === 1).slice(0, 8),
)

const ICONS = [
  'category',           // General
  'architecture',       // Civil y arquitectura
  'foundation',         // Estructuras
  'settings',           // Mecánico
  'plumbing',           // Tuberías
  'bolt',               // Eléctrica
  'precision_manufacturing', // Instrumentación
  'cell_tower',         // Comunicaciones
]

const BG_CLASSES = [
  'bg-blue-700',
  'bg-slate-700',
  'bg-indigo-700',
  'bg-cyan-700',
  'bg-teal-700',
  'bg-violet-700',
  'bg-sky-700',
  'bg-emerald-700',
]

function categoryIcon(i: number): string {
  return ICONS[i % ICONS.length]
}

function categoryBg(i: number): string {
  return BG_CLASSES[i % BG_CLASSES.length]
}
</script>
