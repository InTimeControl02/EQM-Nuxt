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

          <!-- ── Header ──────────────────────────────────────────────── -->

          <!-- Verify step header -->
          <div
            v-if="modal.isVerifyStep.value"
            class="flex items-center justify-between border-b border-white/10 bg-[#050b18] px-5 py-3.5"
          >
            <div class="flex items-center gap-2">
              <button
                class="text-slate-400 hover:text-white transition-colors"
                @click="backFromVerify"
              >
                <span class="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <span class="text-sm font-bold text-white">{{ t('auth.verify_title') }}</span>
            </div>
            <button
              class="px-1 text-slate-500 hover:text-white transition-colors"
              @click="modal.close()"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Login / Register tabs header -->
          <div v-else class="flex border-b border-white/10 bg-[#050b18]">
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

          <!-- ── Verificación OTP ────────────────────────────────────── -->
          <div v-if="modal.isVerifyStep.value" class="px-6 py-6 bg-[#0f172a] space-y-5">

            <!-- Ícono + descripción -->
            <div class="text-center">
              <div class="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-primary text-3xl">mark_email_unread</span>
              </div>
              <p class="text-sm text-slate-400 leading-relaxed">
                {{ t('auth.verify_subtitle') }}
              </p>
              <p class="text-sm text-white font-semibold mt-1">{{ modal.pendingEmail.value }}</p>
            </div>

            <!-- OTP inputs -->
            <div
              class="flex gap-2 justify-center"
              :class="{ 'otp-shake': otpShake }"
            >
              <input
                v-for="i in 6"
                :key="i"
                :ref="(el) => { if (el) otpInputs[i - 1] = el as HTMLInputElement }"
                :value="otpDigits[i - 1]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-11 h-14 text-center text-2xl font-bold rounded-xl transition-all
                       bg-slate-800 border text-white focus:outline-none focus:ring-2"
                :class="otpError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-600 focus:border-primary focus:ring-primary/25'"
                @input="onOtpInput(i - 1, $event)"
                @keydown="onOtpKeydown($event, i - 1)"
                @paste.prevent="onOtpPaste($event)"
              />
            </div>

            <!-- Error -->
            <p v-if="otpError" class="text-xs text-red-400 text-center -mt-1">
              {{ otpError }}
            </p>

            <!-- Submit -->
            <button
              :disabled="otpCode.length < 6 || auth.isLoading"
              class="w-full py-2.5 rounded bg-primary text-white text-sm font-bold
                     hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center gap-2"
              @click="submitVerify"
            >
              <span
                v-if="auth.isLoading"
                class="material-symbols-outlined text-base animate-spin"
              >progress_activity</span>
              {{ auth.isLoading ? t('auth.loading') : t('auth.verify_submit') }}
            </button>

            <!-- Reenviar + volver -->
            <div class="text-center space-y-2">
              <Transition name="fade-quick">
                <p v-if="resendSent" class="text-xs text-green-400">
                  {{ t('auth.verify_resend_sent') }}
                </p>
              </Transition>
              <button
                :disabled="resendCooldown > 0"
                class="text-xs transition-colors block mx-auto"
                :class="resendCooldown > 0
                  ? 'text-slate-600 cursor-default'
                  : 'text-primary-fixed-dim hover:text-white'"
                @click="doResend"
              >
                {{ resendCooldown > 0
                  ? t('auth.verify_resend_wait', { s: resendCooldown })
                  : t('auth.verify_resend') }}
              </button>
              <button
                type="button"
                class="text-xs text-slate-500 hover:text-slate-300 transition-colors block mx-auto"
                @click="backFromVerify"
              >
                {{ t('auth.verify_back') }}
              </button>
            </div>
          </div>

          <!-- ── Login form ──────────────────────────────────────────── -->
          <form
            v-else-if="modal.activeTab.value === 'login'"
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

            <!-- Error general (ej: contraseña incorrecta sin field errors) -->
            <p v-if="loginMessage" class="text-xs text-red-400 text-center">
              {{ loginMessage }}
            </p>

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

          <!-- ── Register form ───────────────────────────────────────── -->
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
  { key: 'login'    as const },
  { key: 'register' as const },
]

// ── Login ──────────────────────────────────────────────────────────
const loginForm    = reactive({ correo: '', password: '' })
const loginErrors  = ref<Record<string, string[]> | undefined>()
const loginMessage = ref<string | undefined>()

async function submitLogin() {
  loginErrors.value  = undefined
  loginMessage.value = undefined
  const result = await auth.login(loginForm.correo, loginForm.password)
  if (result.success) {
    modal.close()
    loginForm.correo = loginForm.password = ''
  } else if ('needsVerification' in result && result.needsVerification) {
    // 403 → backend re-envió código automáticamente
    modal.enterVerify(loginForm.correo)
    startResendCooldown()
  } else {
    loginErrors.value  = 'errors'  in result ? result.errors  : undefined
    loginMessage.value = 'message' in result ? result.message : undefined
  }
}

// ── Register ───────────────────────────────────────────────────────
const registerForm = reactive({
  nombre: '', correo: '', telefono: '', password: '', password_confirmation: '',
})
const registerErrors = ref<Record<string, string[]> | undefined>()

async function submitRegister() {
  registerErrors.value = undefined
  const payload = {
    nombre:                registerForm.nombre,
    correo:                registerForm.correo,
    password:              registerForm.password,
    password_confirmation: registerForm.password_confirmation,
    ...(registerForm.telefono ? { telefono: registerForm.telefono } : {}),
  }
  const result = await auth.register(payload)
  if (result.success) {
    if (result.verificationRequired) {
      modal.enterVerify(registerForm.correo)
      startResendCooldown()
    } else {
      modal.close()
      Object.assign(registerForm, { nombre: '', correo: '', telefono: '', password: '', password_confirmation: '' })
    }
  } else {
    registerErrors.value = result.errors
  }
}

// ── OTP / Verificación ─────────────────────────────────────────────
const otpDigits  = ref(['', '', '', '', '', ''])
const otpInputs  = ref<HTMLInputElement[]>([])
const otpError   = ref<string | undefined>()
const otpShake   = ref(false)

const otpCode = computed(() => otpDigits.value.join(''))

function onOtpInput(idx: number, event: Event) {
  const target = event.target as HTMLInputElement
  const val    = target.value.replace(/\D/g, '').slice(-1)
  otpDigits.value[idx] = val
  target.value = val
  otpError.value = undefined

  if (val && idx < 5) {
    nextTick(() => otpInputs.value[idx + 1]?.focus())
  }
  if (otpDigits.value.every(d => d)) {
    nextTick(submitVerify)
  }
}

function onOtpKeydown(e: KeyboardEvent, idx: number) {
  if (e.key === 'Backspace' && !otpDigits.value[idx] && idx > 0) {
    otpDigits.value[idx - 1] = ''
    nextTick(() => otpInputs.value[idx - 1]?.focus())
  }
}

function onOtpPaste(e: ClipboardEvent) {
  const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6)
  text.split('').forEach((ch, i) => { if (i < 6) otpDigits.value[i] = ch })
  const lastIdx = Math.min(text.length, 5)
  nextTick(() => {
    otpInputs.value[lastIdx]?.focus()
    if (text.length === 6) submitVerify()
  })
}

async function submitVerify() {
  if (otpCode.value.length < 6 || auth.isLoading) return
  otpError.value = undefined
  const result = await auth.verifyEmail(modal.pendingEmail.value, otpCode.value)
  if (result.success) {
    modal.close()
    // Resetear formularios de fondo
    loginForm.correo = loginForm.password = ''
    Object.assign(registerForm, { nombre: '', correo: '', telefono: '', password: '', password_confirmation: '' })
  } else {
    otpError.value = result.message ?? t('auth.verify_error')
    // Shake + clear
    otpShake.value = true
    setTimeout(() => { otpShake.value = false }, 450)
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => otpInputs.value[0]?.focus())
  }
}

// ── Reenviar código ────────────────────────────────────────────────
const resendCooldown = ref(0)
const resendSent     = ref(false)
let   resendTimer: ReturnType<typeof setInterval> | null = null

function startResendCooldown(seconds = 60) {
  resendCooldown.value = seconds
  if (resendTimer) clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer!)
      resendTimer = null
    }
  }, 1000)
}

async function doResend() {
  if (resendCooldown.value > 0) return
  const result = await auth.resendVerification(modal.pendingEmail.value)
  if (result.success) {
    resendSent.value = true
    startResendCooldown()
    setTimeout(() => { resendSent.value = false }, 3000)
  }
}

function backFromVerify() {
  if (resendTimer) clearInterval(resendTimer)
  resendCooldown.value = 0
  resendSent.value     = false
  otpDigits.value      = ['', '', '', '', '', '']
  otpError.value       = undefined
  modal.exitVerify()
}

// ── Watchers ───────────────────────────────────────────────────────
// Enfocar primer input al entrar en verify
watch(
  () => modal.isVerifyStep.value,
  (v) => {
    if (v) {
      otpDigits.value = ['', '', '', '', '', '']
      otpError.value  = undefined
      nextTick(() => otpInputs.value[0]?.focus())
    } else {
      if (resendTimer) clearInterval(resendTimer)
    }
  },
)

// Reset errores al cambiar tab
watch(
  () => modal.activeTab.value,
  () => {
    loginErrors.value  = undefined
    loginMessage.value = undefined
    registerErrors.value = undefined
  },
)

// Limpiar timer al cerrar
watch(
  () => modal.isOpen.value,
  (v) => { if (!v && resendTimer) clearInterval(resendTimer) },
)

onUnmounted(() => {
  if (resendTimer) clearInterval(resendTimer)
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
.modal-leave-to { opacity: 0; }
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateY(8px);
  opacity: 0;
}

/* OTP shake animation */
@keyframes otp-shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}
.otp-shake { animation: otp-shake 0.45s ease; }

/* Fade quick para "Código reenviado" */
.fade-quick-enter-active,
.fade-quick-leave-active { transition: opacity 0.2s ease; }
.fade-quick-enter-from,
.fade-quick-leave-to { opacity: 0; }
</style>
