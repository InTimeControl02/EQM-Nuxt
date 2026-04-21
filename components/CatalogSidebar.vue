<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="font-headline font-bold text-lg text-primary">
        {{ t('catalog.sidebar_title') }}
      </h2>
      <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
        {{ t('catalog.sidebar_subtitle') }}
      </p>
    </div>

    <nav class="flex flex-col gap-0.5">
      <!-- Todas las categorías -->
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
        :class="selectedId === null
          ? 'bg-primary text-white shadow-sm'
          : 'text-slate-600 hover:text-primary hover:bg-surface-container-low'"
        @click="emit('select', null)"
      >
        <span class="material-symbols-outlined text-base">apps</span>
        {{ t('catalog.all_categories') }}
      </button>

      <!-- Árbol recursivo -->
      <CatalogSidebarNode
        v-for="cat in tree"
        :key="cat.id"
        :cat="cat"
        :selected-id="selectedId"
        :depth="0"
        :expanded-ids="expandedIds"
        @select="emit('select', $event)"
        @toggle="onToggle"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number
  id_padre: number | null
  codigo: string
  nombre_es: string
  nombre_en: string
  nodo: number
  children?: Category[]
}

const props = defineProps<{
  categories: Category[]
  selectedId: number | null
}>()

const emit = defineEmits<{
  select: [id: number | null]
}>()

const { t } = useI18n({ useScope: 'global' })

// ── Construir árbol desde lista plana ─────────────────────────────
const tree = computed<Category[]>(() => {
  const map = new Map<number, Category>()
  props.categories.forEach(c => map.set(c.id, { ...c, children: [] }))

  const roots: Category[] = []
  props.categories.forEach(c => {
    const node = map.get(c.id)!
    if (!c.id_padre) {
      roots.push(node)
    } else {
      map.get(c.id_padre)?.children?.push(node)
    }
  })
  return roots
})

// ── Estado de expansión (centralizado en el padre) ────────────────
const expandedIds = ref<Set<number>>(new Set())

// Al seleccionar una categoría desde afuera, expandir la ruta hasta ella
watch(
  () => props.selectedId,
  (id) => {
    if (id === null) return
    // Expandir todos los ancestros del nodo seleccionado
    const ancestors = getAncestors(id)
    ancestors.forEach(a => expandedIds.value.add(a))
    expandedIds.value = new Set(expandedIds.value)
  },
  { immediate: true },
)

function getAncestors(id: number): number[] {
  const map = new Map(props.categories.map(c => [c.id, c]))
  const result: number[] = []
  let current = map.get(id)
  while (current?.id_padre) {
    result.push(current.id_padre)
    current = map.get(current.id_padre)
  }
  return result
}

function onToggle(id: number) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
  expandedIds.value = new Set(expandedIds.value)
}
</script>
