<template>
  <div class="flex gap-2 justify-center" :class="{ 'otp-shake': shaking }">
    <input
      v-for="i in length"
      :key="i"
      :ref="(el) => { if (el) inputs[i - 1] = el as HTMLInputElement }"
      :value="digits[i - 1]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="w-11 h-14 text-center text-2xl font-bold rounded-xl transition-all
             bg-slate-800 border text-white focus:outline-none focus:ring-2"
      :class="hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-600 focus:border-primary focus:ring-primary/25'"
      @input="onInput(i - 1, $event)"
      @keydown="onKeydown($event, i - 1)"
      @paste.prevent="onPaste($event)"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  length?: number
  hasError?: boolean
}>(), {
  length: 6,
  hasError: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

const digits  = ref<string[]>(Array(props.length).fill(''))
const inputs  = ref<HTMLInputElement[]>([])
const shaking = ref(false)

function sync() {
  emit('update:modelValue', digits.value.join(''))
}

function onInput(idx: number, event: Event) {
  const target = event.target as HTMLInputElement
  const val    = target.value.replace(/\D/g, '').slice(-1)
  digits.value[idx] = val
  target.value = val
  sync()

  if (val && idx < props.length - 1) {
    nextTick(() => inputs.value[idx + 1]?.focus())
  }
  if (digits.value.every(d => d)) {
    emit('complete', digits.value.join(''))
  }
}

function onKeydown(e: KeyboardEvent, idx: number) {
  if (e.key === 'Backspace' && !digits.value[idx] && idx > 0) {
    digits.value[idx - 1] = ''
    sync()
    nextTick(() => inputs.value[idx - 1]?.focus())
  }
}

function onPaste(e: ClipboardEvent) {
  const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, props.length)
  text.split('').forEach((ch, i) => { digits.value[i] = ch })
  sync()
  const lastIdx = Math.min(text.length, props.length - 1)
  nextTick(() => {
    inputs.value[lastIdx]?.focus()
    if (text.length === props.length) emit('complete', digits.value.join(''))
  })
}

/** Limpia los dígitos; usarlo tras un código rechazado por el backend. */
function clear(focus = true) {
  digits.value = Array(props.length).fill('')
  sync()
  if (focus) nextTick(() => inputs.value[0]?.focus())
}

function shake() {
  shaking.value = true
  setTimeout(() => { shaking.value = false }, 450)
}

function focusFirst() {
  nextTick(() => inputs.value[0]?.focus())
}

defineExpose({ clear, shake, focusFirst })
</script>

<style scoped>
@keyframes otp-shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}
.otp-shake { animation: otp-shake 0.45s ease; }
</style>
