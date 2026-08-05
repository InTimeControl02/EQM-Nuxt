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

          <!-- Verify / Forgot / Reset step header -->
          <div
            v-if="modal.isVerifyStep.value || modal.isForgotStep.value || modal.isResetStep.value"
            class="flex items-center justify-between border-b border-white/10 bg-[#050b18] px-5 py-3.5"
          >
            <div class="flex items-center gap-2">
              <button
                class="text-slate-400 hover:text-white transition-colors"
                @click="stepBack"
              >
                <span class="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <span class="text-sm font-bold text-white">{{ stepTitle }}</span>
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

            <OtpInput
              ref="verifyOtp"
              :has-error="!!otpError"
              @update:model-value="otpCode = $event"
              @complete="submitVerify"
            />

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

          <!-- ── Recuperar contraseña: paso 1, pedir correo ────────────── -->
          <div v-else-if="modal.isForgotStep.value" class="px-6 py-6 bg-[#0f172a] space-y-5">
            <div class="text-center">
              <div class="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-primary text-3xl">lock_reset</span>
              </div>
              <p class="text-sm text-slate-400 leading-relaxed">
                {{ t('auth.forgot_subtitle') }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.correo') }}
              </label>
              <input
                v-model="forgotForm.correo"
                type="email"
                autocomplete="email"
                required
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                @keydown.enter.prevent="submitForgot"
              />
              <FieldError :errors="forgotErrors?.correo" />
            </div>

            <!-- Error general (ej: correo no registrado) -->
            <p v-if="forgotMessage" class="text-xs text-red-400 text-center">
              {{ forgotMessage }}
            </p>

            <button
              type="button"
              :disabled="!forgotForm.correo || auth.isLoading"
              class="w-full py-2.5 rounded bg-primary text-white text-sm font-bold
                     hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center gap-2"
              @click="submitForgot"
            >
              <span
                v-if="auth.isLoading"
                class="material-symbols-outlined text-base animate-spin"
              >progress_activity</span>
              {{ auth.isLoading ? t('auth.loading') : t('auth.forgot_submit') }}
            </button>
          </div>

          <!-- ── Recuperar contraseña: paso 2, código + nueva contraseña ─ -->
          <div v-else-if="modal.isResetStep.value" class="px-6 py-6 bg-[#0f172a] space-y-5">
            <div class="text-center">
              <div class="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-primary text-3xl">password</span>
              </div>
              <p class="text-sm text-slate-400 leading-relaxed">
                {{ t('auth.reset_subtitle') }}
              </p>
              <p class="text-sm text-white font-semibold mt-1">{{ modal.pendingEmail.value }}</p>
            </div>

            <OtpInput
              ref="resetOtp"
              :has-error="!!resetCodeError"
              @update:model-value="resetCode = $event"
            />
            <p v-if="resetCodeError" class="text-xs text-red-400 text-center -mt-1">
              {{ resetCodeError }}
            </p>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.new_password') }}
              </label>
              <input
                v-model="resetForm.password"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <p class="text-[11px] text-slate-500 mt-1">{{ t('auth.password_min') }}</p>
              <FieldError :errors="resetErrors?.password" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                {{ t('auth.password_confirmation') }}
              </label>
              <input
                v-model="resetForm.password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2.5
                       text-sm text-white placeholder-slate-400
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <FieldError :errors="resetErrors?.password_confirmation" />
            </div>

            <button
              type="button"
              :disabled="resetCode.length < 6 || auth.isLoading"
              class="w-full py-2.5 rounded bg-primary text-white text-sm font-bold
                     hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center gap-2"
              @click="submitReset"
            >
              <span
                v-if="auth.isLoading"
                class="material-symbols-outlined text-base animate-spin"
              >progress_activity</span>
              {{ auth.isLoading ? t('auth.loading') : t('auth.reset_submit') }}
            </button>

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
                @click="doResendReset"
              >
                {{ resendCooldown > 0
                  ? t('auth.verify_resend_wait', { s: resendCooldown })
                  : t('auth.forgot_resend') }}
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

            <div class="flex justify-end -mt-2">
              <button
                type="button"
                class="text-[11px] text-primary-fixed-dim hover:text-white transition-colors"
                @click="openForgot"
              >
                {{ t('auth.forgot_password') }}
              </button>
            </div>

            <!-- Aviso de éxito (ej: contraseña restablecida) -->
            <p v-if="loginNotice" class="text-xs text-green-400 text-center">
              {{ loginNotice }}
            </p>

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

            <!-- Error general (ej: correo ya registrado, sin error de campo) -->
            <p v-if="registerMessage" class="text-xs text-red-400 text-center">
              {{ registerMessage }}
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
// Aviso de éxito tras restablecer contraseña; a propósito NO se limpia en el
// watcher genérico de cambio de tab (ver más abajo) — se pisaría a sí mismo
// por el orden asíncrono del watcher vs. la asignación en submitReset().
const loginNotice  = ref<string | undefined>()

async function submitLogin() {
  loginErrors.value  = undefined
  loginMessage.value = undefined
  loginNotice.value  = undefined
  const result = await auth.login(loginForm.correo, loginForm.password)
  if (result.success) {
    modal.close()
    loginForm.correo = loginForm.password = ''
  } else if ('needsVerification' in result && result.needsVerification) {
    // 403 → backend re-envió código automáticamente
    modal.enterVerify(loginForm.correo)
    startResendCooldown()
  } else {
    loginErrors.value = 'errors' in result ? result.errors : undefined
    // Contraseña incorrecta: el backend manda el mismo texto en `message` y
    // en `errors.correo` — mostrar ambos duplica el mensaje en pantalla.
    // El párrafo general solo aplica cuando NO hay error de campo que ya lo cubra.
    loginMessage.value = loginErrors.value ? undefined : ('message' in result ? result.message : undefined)
  }
}

// ── Register ───────────────────────────────────────────────────────
const registerForm = reactive({
  nombre: '', correo: '', telefono: '', password: '', password_confirmation: '',
})
const registerErrors  = ref<Record<string, string[]> | undefined>()
const registerMessage = ref<string | undefined>()

async function submitRegister() {
  registerErrors.value  = undefined
  registerMessage.value = undefined
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
    registerErrors.value  = result.errors
    // Caso "correo ya registrado": el backend responde solo `message`, sin
    // `errors` de campo — sin este fallback el formulario no mostraba nada.
    registerMessage.value = result.message ?? (!result.errors ? t('auth.register_error') : undefined)
  }
}

// ── OTP / Verificación ─────────────────────────────────────────────
type OtpHandle = { clear: (focus?: boolean) => void; shake: () => void; focusFirst: () => void }

const verifyOtp = ref<OtpHandle | null>(null)
const otpCode   = ref('')
const otpError  = ref<string | undefined>()

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
    verifyOtp.value?.shake()
    verifyOtp.value?.clear()
    otpCode.value = ''
  }
}

// ── Reenviar código (compartido entre verificación y reset) ────────
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
  otpCode.value         = ''
  otpError.value        = undefined
  modal.exitVerify()
}

// ── Olvidé mi contraseña: paso 1, pedir correo ──────────────────────
const forgotForm    = reactive({ correo: '' })
const forgotErrors  = ref<Record<string, string[]> | undefined>()
const forgotMessage = ref<string | undefined>()

function openForgot() {
  forgotForm.correo    = loginForm.correo
  forgotErrors.value   = undefined
  forgotMessage.value  = undefined
  modal.enterForgot()
}

async function submitForgot() {
  if (!forgotForm.correo || auth.isLoading) return
  forgotErrors.value  = undefined
  forgotMessage.value = undefined
  const result = await auth.forgotPassword(forgotForm.correo)
  if (result.success) {
    modal.enterReset(forgotForm.correo)
    startResendCooldown()
  } else if (result.errors) {
    forgotErrors.value = result.errors
  } else {
    // Correo no registrado (404) llega solo como `message`, sin `errors`.
    forgotMessage.value = result.message ?? t('auth.forgot_error')
  }
}

// ── Olvidé mi contraseña: paso 2, código + nueva contraseña ────────
const resetOtp        = ref<OtpHandle | null>(null)
const resetCode       = ref('')
const resetCodeError  = ref<string | undefined>()
const resetForm       = reactive({ password: '', password_confirmation: '' })
const resetErrors     = ref<Record<string, string[]> | undefined>()

async function submitReset() {
  if (resetCode.value.length < 6 || auth.isLoading) return
  resetErrors.value    = undefined
  resetCodeError.value = undefined
  const result = await auth.resetPassword({
    correo:                 modal.pendingEmail.value,
    code:                   resetCode.value,
    password:               resetForm.password,
    password_confirmation:  resetForm.password_confirmation,
  })
  if (result.success) {
    const correo = modal.pendingEmail.value
    if (resendTimer) clearInterval(resendTimer)
    modal.switchTab('login')
    loginForm.correo   = correo
    loginForm.password = ''
    loginNotice.value  = result.message ?? t('auth.reset_success')
    resetForm.password = resetForm.password_confirmation = ''
    resetCode.value = ''
  } else if (result.errors) {
    resetErrors.value = result.errors
  } else {
    // Código incorrecto/expirado → llega solo como `message`, igual que en
    // la verificación de correo.
    resetCodeError.value = result.message ?? t('auth.reset_error')
    resetOtp.value?.shake()
    resetOtp.value?.clear()
    resetCode.value = ''
  }
}

async function doResendReset() {
  if (resendCooldown.value > 0) return
  const result = await auth.forgotPassword(modal.pendingEmail.value)
  if (result.success) {
    resendSent.value = true
    startResendCooldown()
    setTimeout(() => { resendSent.value = false }, 3000)
  }
}

// ── Header de los pasos verify / forgot / reset ─────────────────────
const stepTitle = computed(() => {
  if (modal.isVerifyStep.value) return t('auth.verify_title')
  if (modal.isForgotStep.value) return t('auth.forgot_title')
  if (modal.isResetStep.value)  return t('auth.reset_title')
  return ''
})

function stepBack() {
  if (modal.isVerifyStep.value) backFromVerify()
  else if (modal.isForgotStep.value) modal.exitForgot()
  else if (modal.isResetStep.value) backFromReset()
}

function backFromReset() {
  if (resendTimer) clearInterval(resendTimer)
  resendCooldown.value = 0
  resendSent.value     = false
  resetCode.value       = ''
  resetErrors.value     = undefined
  resetCodeError.value  = undefined
  resetForm.password = resetForm.password_confirmation = ''
  modal.exitReset()
}

// ── Watchers ───────────────────────────────────────────────────────
// Enfocar primer input al entrar en verify
watch(
  () => modal.isVerifyStep.value,
  (v) => {
    if (v) {
      otpCode.value  = ''
      otpError.value = undefined
      nextTick(() => verifyOtp.value?.focusFirst())
    } else {
      if (resendTimer) clearInterval(resendTimer)
    }
  },
)

// Enfocar primer input al entrar en el paso 2 de reset
watch(
  () => modal.isResetStep.value,
  (v) => {
    if (v) {
      resetCode.value      = ''
      resetCodeError.value = undefined
      nextTick(() => resetOtp.value?.focusFirst())
    }
  },
)

// Reset errores al cambiar tab (loginNotice se excluye a propósito: lo pisa
// switchTab('login') al terminar submitReset(), justo antes de asignarlo)
watch(
  () => modal.activeTab.value,
  () => {
    loginErrors.value     = undefined
    loginMessage.value    = undefined
    registerErrors.value  = undefined
    registerMessage.value = undefined
  },
)

// Limpiar timer al cerrar; limpiar aviso de éxito trasnochado al reabrir
watch(
  () => modal.isOpen.value,
  (v) => {
    if (!v && resendTimer) clearInterval(resendTimer)
    if (v) loginNotice.value = undefined
  },
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

/* Fade quick para "Código reenviado" */
.fade-quick-enter-active,
.fade-quick-leave-active { transition: opacity 0.2s ease; }
.fade-quick-enter-from,
.fade-quick-leave-to { opacity: 0; }
</style>
