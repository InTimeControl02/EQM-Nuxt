<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modal.isOpen.value"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @mousedown.self="modal.close()"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <!-- Card -->
        <div class="relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden">

          <!-- Header con tabs — color navbar -->
          <div class="flex border-b border-white/10 bg-[#050b18]">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="flex-1 py-3.5 text-sm font-bold transition-colors"
              :class="modal.activeTab.value === tab.key
                ? 'text-white border-b-2 border-primary-fixed-dim bg-white/5'
                : 'text-slate-500 hover:text-slate-300'"
              @click="modal.switchTab(tab.key)"
            >
              {{ t(`auth.tab_${tab.key}`) }}
            </button>
            <button
              class="px-4 text-slate-500 hover:text-white transition-colors"
              @click="modal.close()"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Login form -->
          <form
            v-if="modal.activeTab.value === 'login'"
            class="px-6 py-5 space-y-4 bg-[#0f172a]"
            @submit.prevent="submitLogin"
          >
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.correo') }}
              </label>
              <input
                v-model="loginForm.correo"
                type="email"
                autocomplete="email"
                required
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <FieldError :errors="loginErrors?.correo" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.password') }}
              </label>
              <input
                v-model="loginForm.password"
                type="password"
                autocomplete="current-password"
                required
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <FieldError :errors="loginErrors?.password" />
            </div>

            <button
              type="submit"
              :disabled="auth.isLoading"
              class="w-full py-2.5 rounded bg-primary text-white text-sm font-bold
                     hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
            >
              <span v-if="auth.isLoading" class="flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                {{ t('auth.loading') }}
              </span>
              <span v-else>{{ t('auth.submit_login') }}</span>
            </button>

            <p class="text-center text-xs text-slate-400 pt-1">
              {{ t('auth.no_account') }}
              <button
                type="button"
                class="text-primary-fixed-dim hover:text-white transition-colors font-bold"
                @click="modal.switchTab('register')"
              >
                {{ t('auth.switch_to_register') }}
              </button>
            </p>
          </form>

          <!-- Register form -->
          <form
            v-else
            class="px-6 py-5 space-y-4 bg-[#0f172a]"
            @submit.prevent="submitRegister"
          >
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.nombre') }}
              </label>
              <input
                v-model="registerForm.nombre"
                type="text"
                autocomplete="name"
                required
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <FieldError :errors="registerErrors?.nombre" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.correo') }}
              </label>
              <input
                v-model="registerForm.correo"
                type="email"
                autocomplete="email"
                required
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <FieldError :errors="registerErrors?.correo" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.telefono') }}
              </label>
              <input
                v-model="registerForm.telefono"
                type="tel"
                autocomplete="tel"
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <FieldError :errors="registerErrors?.telefono" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.password') }}
              </label>
              <input
                v-model="registerForm.password"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <p class="text-[11px] text-slate-500 mt-1">{{ t('auth.password_min') }}</p>
              <FieldError :errors="registerErrors?.password" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.password_confirmation') }}
              </label>
              <input
                v-model="registerForm.password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <FieldError :errors="registerErrors?.password_confirmation" />
            </div>

            <button
              type="submit"
              :disabled="auth.isLoading"
              class="w-full py-2.5 rounded bg-primary text-white text-sm font-bold
                     hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
            >
              <span v-if="auth.isLoading" class="flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                {{ t('auth.loading') }}
              </span>
              <span v-else>{{ t('auth.submit_register') }}</span>
            </button>

            <p class="text-center text-xs text-slate-400 pt-1">
              {{ t('auth.have_account') }}
              <button
                type="button"
                class="text-primary-fixed-dim hover:text-white transition-colors font-bold"
                @click="modal.switchTab('login')"
              >
                {{ t('auth.switch_to_login') }}
              </button>
            </p>
          </form>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const auth  = useAuthStore()
const modal = useAuthModal()

const tabs = [
  { key: 'login' as const },
  { key: 'register' as const },
]

// ── Login ────────────────────────────────────────────────────────────
const loginForm = reactive({ correo: '', password: '' })
const loginErrors = ref<Record<string, string[]> | undefined>()

async function submitLogin() {
  loginErrors.value = undefined
  const result = await auth.login(loginForm.correo, loginForm.password)
  if (result.success) {
    modal.close()
    loginForm.correo = ''
    loginForm.password = ''
  } else {
    loginErrors.value = result.errors
  }
}

// ── Register ─────────────────────────────────────────────────────────
const registerForm = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  password: '',
  password_confirmation: '',
})
const registerErrors = ref<Record<string, string[]> | undefined>()

async function submitRegister() {
  registerErrors.value = undefined
  const payload = {
    nombre: registerForm.nombre,
    correo: registerForm.correo,
    password: registerForm.password,
    password_confirmation: registerForm.password_confirmation,
    ...(registerForm.telefono ? { telefono: registerForm.telefono } : {}),
  }
  const result = await auth.register(payload)
  if (result.success) {
    modal.close()
    Object.assign(registerForm, { nombre: '', correo: '', telefono: '', password: '', password_confirmation: '' })
  } else {
    registerErrors.value = result.errors
  }
}

// Reset errors on tab switch
watch(() => modal.activeTab.value, () => {
  loginErrors.value = undefined
  registerErrors.value = undefined
})
</script>

<!-- FieldError: inline helper component -->
<script lang="ts">
import { defineComponent, h } from 'vue'

export const FieldError = defineComponent({
  props: { errors: Array as () => string[] | undefined },
  setup(props) {
    return () => props.errors?.length
      ? h('p', { class: 'text-[11px] text-red-400 mt-1' }, props.errors[0])
      : null
  },
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateY(8px);
  opacity: 0;
}
</style>
