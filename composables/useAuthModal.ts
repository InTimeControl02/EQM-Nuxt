export function useAuthModal() {
  const isOpen       = useState('auth-modal-open',    () => false)
  const activeTab    = useState<'login' | 'register'>('auth-modal-tab',   () => 'login')
  const isVerifyStep = useState('auth-modal-verify',  () => false)
  const isForgotStep = useState('auth-modal-forgot',  () => false)
  const isResetStep  = useState('auth-modal-reset',   () => false)
  const pendingEmail = useState('auth-modal-email',   () => '')

  function open(tab: 'login' | 'register' = 'login') {
    activeTab.value    = tab
    isVerifyStep.value = false
    isForgotStep.value = false
    isResetStep.value  = false
    pendingEmail.value = ''
    isOpen.value       = true
  }

  function close() {
    isOpen.value       = false
    isVerifyStep.value = false
    isForgotStep.value = false
    isResetStep.value  = false
    pendingEmail.value = ''
  }

  function switchTab(tab: 'login' | 'register') {
    activeTab.value    = tab
    isVerifyStep.value = false
    isForgotStep.value = false
    isResetStep.value  = false
  }

  function enterVerify(email: string) {
    pendingEmail.value = email
    isVerifyStep.value = true
  }

  function exitVerify() {
    isVerifyStep.value = false
    pendingEmail.value = ''
    activeTab.value    = 'login'
  }

  // ── Recuperar contraseña: correo → código + nueva password ─────────
  function enterForgot() {
    isForgotStep.value = true
    isResetStep.value  = false
  }

  function exitForgot() {
    isForgotStep.value = false
    activeTab.value    = 'login'
  }

  function enterReset(email: string) {
    pendingEmail.value = email
    isResetStep.value  = true
    isForgotStep.value = false
  }

  // "Atrás" desde el paso de código vuelve a pedir el correo, no al login
  function exitReset() {
    isResetStep.value  = false
    isForgotStep.value = true
  }

  return {
    isOpen, activeTab, isVerifyStep, isForgotStep, isResetStep, pendingEmail,
    open, close, switchTab,
    enterVerify, exitVerify,
    enterForgot, exitForgot, enterReset, exitReset,
  }
}
