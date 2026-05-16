export function useAuthModal() {
  const isOpen       = useState('auth-modal-open',    () => false)
  const activeTab    = useState<'login' | 'register'>('auth-modal-tab',   () => 'login')
  const isVerifyStep = useState('auth-modal-verify',  () => false)
  const pendingEmail = useState('auth-modal-email',   () => '')

  function open(tab: 'login' | 'register' = 'login') {
    activeTab.value    = tab
    isVerifyStep.value = false
    pendingEmail.value = ''
    isOpen.value       = true
  }

  function close() {
    isOpen.value       = false
    isVerifyStep.value = false
    pendingEmail.value = ''
  }

  function switchTab(tab: 'login' | 'register') {
    activeTab.value    = tab
    isVerifyStep.value = false
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

  return { isOpen, activeTab, isVerifyStep, pendingEmail, open, close, switchTab, enterVerify, exitVerify }
}
