<template>
  <div>
    <!-- Botón del nodo -->
    <button
      class="w-full flex items-center justify-between rounded-lg text-sm font-medium transition-all"
      :style="{ paddingLeft: `${12 + depth * 14}px`, paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px' }"
      :class="selectedId === cat.id
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-slate-600 hover:text-primary hover:bg-surface-container-low'"
      @click="onNodeClick"
    >
      <!-- Indicador de profundidad -->
      <span class="flex items-center gap-2 truncate text-left min-w-0">
        <span
          v-if="depth > 0"
          class="shrink-0 rounded-full bg-current opacity-40"
          :style="{ width: `${Math.max(3, 5 - depth)}px`, height: `${Math.max(3, 5 - depth)}px` }"
        />
        <span class="truncate" :class="depth === 0 ? 'text-sm' : depth === 1 ? 'text-xs' : 'text-[11px]'">
          {{ catName }}
        </span>
      </span>
      <!-- Flecha si tiene hijos -->
      <span
        v-if="cat.children?.length"
        class="material-symbols-outlined text-sm shrink-0 transition-transform duration-200 ml-1"
        :class="isExpanded ? 'rotate-90' : ''"
      >
        chevron_right
      </span>
    </button>

    <!-- Hijos (recursivo) -->
    <Transition name="expand">
      <div v-if="isExpanded && cat.children?.length">
        <CatalogSidebarNode
          v-for="child in cat.children"
          :key="child.id"
          :cat="child"
          :selected-id="selectedId"
          :depth="depth + 1"
          :expanded-ids="expandedIds"
          @select="emit('select', $event)"
          @toggle="emit('toggle', $event)"
        />
      </div>
    </Transition>
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
  cat: Category
  selectedId: number | null
  depth: number
  expandedIds: Set<number>
}>()

const emit = defineEmits<{
  select: [id: number]
  toggle: [id: number]
}>()

const { locale } = useI18n({ useScope: 'global' })

const isExpanded = computed(() => props.expandedIds.has(props.cat.id))
const catName    = computed(() => locale.value === 'es' ? props.cat.nombre_es : props.cat.nombre_en)

function onNodeClick() {
  if (props.cat.children?.length) {
    emit('toggle', props.cat.id)
  }
  emit('select', props.cat.id)
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 9999px;
}
</style>
