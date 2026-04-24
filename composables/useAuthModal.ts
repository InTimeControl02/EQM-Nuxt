export function useAuthModal() {
  const isOpen = useState('auth-modal-open', () => false)
  const activeTab = useState<'login' | 'register'>('auth-modal-tab', () => 'login')

  function open(tab: 'login' | 'register' = 'login') {
    activeTab.value = tab
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function switchTab(tab: 'login' | 'register') {
    activeTab.value = tab
  }

  return { isOpen, activeTab, open, close, switchTab }
}
