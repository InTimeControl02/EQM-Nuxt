<template>
  <div ref="rootEl" class="relative shrink-0" :class="widthClass">
    <!-- Trigger -->
    <button
      ref="triggerEl"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      class="w-full flex items-center gap-2 pl-2.5 pr-2 py-2 rounded-lg border bg-white
             text-sm font-medium transition-all cursor-pointer
             focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      :class="hasValue
        ? 'border-primary text-primary'
        : 'border-slate-200 text-slate-600 hover:border-slate-300'"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span v-if="icon" class="material-symbols-outlined text-sm shrink-0" :class="hasValue ? 'text-primary' : 'text-slate-400'">
        {{ icon }}
      </span>

      <!-- min-w-0 + truncate: el ancho lo fija widthClass, nunca el contenido -->
      <span class="flex-1 min-w-0 truncate text-left" :title="selectedLabel">
        {{ selectedLabel }}
      </span>

      <span
        class="material-symbols-outlined text-xs shrink-0 transition-transform duration-200"
        :class="[hasValue ? 'text-primary' : 'text-slate-400', open ? 'rotate-180' : '']"
      >
        expand_more
      </span>
    </button>

    <!-- Panel -->
    <Transition name="fs-pop">
      <div
        v-if="open"
        role="listbox"
        class="absolute left-0 top-full mt-1 z-40 w-full min-w-full max-h-64 overflow-y-auto
               rounded-lg border border-slate-200 bg-white shadow-lg py-1"
      >
        <button
          v-for="(opt, i) in allOptions"
          :key="opt.value ?? '__all__'"
          type="button"
          role="option"
          :aria-selected="opt.value === modelValue"
          class="w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
          :class="[
            opt.value === modelValue
              ? 'text-primary font-semibold bg-surface-container-low'
              : 'text-slate-600 hover:bg-surface-container-low',
            i === activeIndex ? 'bg-surface-container-low' : '',
          ]"
          :title="opt.label"
          @click="select(opt.value)"
        >
          <span class="truncate">{{ opt.label }}</span>
          <span v-if="opt.value === modelValue" class="material-symbols-outlined text-sm ml-auto shrink-0">check</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | null
  label: string
}

const props = withDefaults(defineProps<{
  modelValue: string | null
  options: Option[]
  /** Etiqueta de la opción "sin filtro" (value = null) */
  placeholder: string
  /** Nombre de icono Material Symbols para el lado izquierdo */
  icon?: string
  /**
   * Ancho FIJO del control. Es lo que evita que el input crezca con el
   * contenido: la etiqueta se trunca en vez de estirar el layout.
   */
  widthClass?: string
}>(), {
  icon: undefined,
  widthClass: 'w-full sm:w-40 xl:w-48',
})

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const open        = ref(false)
const activeIndex = ref(-1)
const rootEl      = ref<HTMLElement | null>(null)
const triggerEl   = ref<HTMLButtonElement | null>(null)

const allOptions = computed<Option[]>(() => [
  { value: null, label: props.placeholder },
  ...props.options,
])

const hasValue = computed(() => props.modelValue !== null && props.modelValue !== '')

const selectedLabel = computed(() =>
  allOptions.value.find(o => o.value === props.modelValue)?.label ?? props.placeholder,
)

function toggle() {
  open.value = !open.value
  if (open.value) {
    activeIndex.value = allOptions.value.findIndex(o => o.value === props.modelValue)
  }
}

function close() {
  open.value = false
  activeIndex.value = -1
}

function select(value: string | null) {
  emit('update:modelValue', value)
  close()
  triggerEl.value?.focus()
}

function move(delta: number) {
  const last = allOptions.value.length - 1
  const next = activeIndex.value + delta
  activeIndex.value = next < 0 ? last : next > last ? 0 : next
}

function onTriggerKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Escape':
      if (open.value) { e.preventDefault(); close() }
      break
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault()
      if (!open.value) { toggle(); break }
      move(e.key === 'ArrowDown' ? 1 : -1)
      break
    case 'Home':
      if (open.value) { e.preventDefault(); activeIndex.value = 0 }
      break
    case 'End':
      if (open.value) { e.preventDefault(); activeIndex.value = allOptions.value.length - 1 }
      break
    case 'Enter':
      if (open.value && activeIndex.value >= 0) {
        e.preventDefault()
        select(allOptions.value[activeIndex.value]!.value)
      }
      break
  }
}

function onDocumentPointerDown(e: PointerEvent) {
  if (open.value && !rootEl.value?.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<style scoped>
.fs-pop-enter-active,
.fs-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fs-pop-enter-from,
.fs-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
