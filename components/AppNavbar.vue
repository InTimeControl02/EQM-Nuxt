<template>
  <!-- Sticky Dark Navbar -->
  <nav class="sticky top-0 z-50 bg-[#050b18] text-white shadow-[var(--shadow-navbar)]">
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-6">

      <!-- Izquierda: ícono + label -->
      <div class="flex items-center gap-2 shrink-0">
        <span class="material-symbols-outlined text-slate-400 text-xl">inventory_2</span>
        <span class="text-[11px] font-bold tracking-widest text-slate-400 uppercase hidden sm:block">
          {{ t('nav.inventory') }}
        </span>
      </div>

      <!-- Centro: links de navegación (desktop) -->
      <div class="hidden lg:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.key"
          :to="link.to"
          class="px-4 py-1.5 rounded text-sm font-medium text-slate-300
                 hover:text-white hover:bg-white/8 transition-all duration-150"
          active-class="text-white bg-white/10"
        >
          {{ t(`nav.${link.key}`) }}
        </NuxtLink>
      </div>

      <!-- Derecha: buscador + idioma + auth (desktop) -->
      <div class="hidden lg:flex items-center gap-3 flex-1 justify-end">

        <!-- Buscador -->
        <div class="relative w-full max-w-xs">
          <input
            v-model="searchInput"
            type="text"
            :placeholder="t('nav.search')"
            class="w-full bg-[#111927] border-none rounded py-1.5 pl-9 pr-8
                   text-xs text-slate-200 placeholder-slate-500
                   focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim/60
                   transition-all"
            @keydown.enter="submitSearch"
            @keydown.escape="clearNavSearch"
          />
          <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
          <button
            v-if="searchInput"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            tabindex="-1"
            @click="clearNavSearch"
          >
            <span class="material-symbols-outlined text-base leading-none">close</span>
          </button>
        </div>

        <!-- Toggle de idioma -->
        <button
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded
                 border border-slate-700 text-slate-300 text-xs font-bold
                 hover:border-slate-500 hover:text-white transition-all shrink-0"
          :title="locale === 'es' ? 'Switch to English' : 'Cambiar a Español'"
          @click="toggleLocale"
        >
          <span class="text-sm leading-none">{{ locale === 'es' ? '🇲🇽' : '🇺🇸' }}</span>
          <span>{{ locale === 'es' ? 'ES' : 'EN' }}</span>
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-slate-700 shrink-0" />

        <!-- Auth: usuario autenticado o botón de login -->
        <template v-if="auth.isAuthenticated">
          <div class="flex items-center gap-2.5">
            <div class="text-right">
              <p class="text-xs font-bold leading-none text-white">{{ auth.userName }}</p>
              <p class="text-[9px] text-slate-500 leading-none mt-1 uppercase font-bold tracking-tighter">
                {{ auth.userRole }}
              </p>
            </div>
            <div
              class="w-8 h-8 rounded-lg bg-on-primary-fixed-variant
                     flex items-center justify-center
                     border border-slate-700 text-xs font-bold text-white"
            >
              {{ auth.userInitials }}
            </div>
            <button
              class="text-slate-400 hover:text-white transition-colors"
              :title="t('nav.logout')"
              @click="auth.logout()"
            >
              <span class="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </template>

        <template v-else>
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded
                   bg-primary text-white text-xs font-bold
                   hover:bg-primary-container transition-all shrink-0"
            @click="openLoginModal"
          >
            <span class="material-symbols-outlined text-base">login</span>
            {{ t('nav.login') }}
          </button>
        </template>
      </div>

      <!-- Botón hamburguesa (móvil) -->
      <button
        class="lg:hidden text-slate-400 hover:text-white transition-colors"
        @click="mobileMenuOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">menu</span>
      </button>
    </div>

    <!-- Menú hamburguesa móvil (overlay) -->
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-[60]">
          <!-- Fondo oscurecido -->
          <div class="absolute inset-0 bg-black/70" @click="mobileMenuOpen = false" />

          <!-- Panel del menú -->
          <div class="absolute right-0 top-0 bottom-0 w-72 bg-[#050b18] overflow-y-auto">
            <!-- Header del menú -->
            <div class="sticky top-0 bg-[#050b18] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <span class="text-white font-bold">{{ t('nav.inventory') }}</span>
              <button
                class="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                @click="mobileMenuOpen = false"
              >
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- Contenido del menú -->
            <div class="px-6 py-4">
              <!-- Links de navegación -->
              <div class="mb-6">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Navegación</p>
                <NuxtLink
                  v-for="link in navLinks"
                  :key="link.key"
                  :to="link.to"
                  class="block py-3 px-4 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                  active-class="!text-white !bg-white/10"
                  @click="mobileMenuOpen = false"
                >
                  {{ t(`nav.${link.key}`) }}
                </NuxtLink>
              </div>

              <!-- Buscador móvil -->
              <div class="mb-6">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Búsqueda</p>
                <div class="relative">
                  <input
                    v-model="searchInput"
                    type="text"
                    :placeholder="t('nav.search')"
                    class="w-full bg-[#111927] border border-slate-700 rounded py-2.5 pl-9 pr-8
                           text-sm text-slate-200 placeholder-slate-500
                           focus:outline-none focus:border-primary transition-all"
                    @keydown.enter="submitSearchMobile"
                  />
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    search
                  </span>
                </div>
              </div>

              <!-- Idioma -->
              <div class="mb-6">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Idioma</p>
                <button
                  class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded
                         border border-slate-700 text-slate-300 text-sm font-bold
                         hover:border-slate-500 hover:text-white transition-all"
                  @click="toggleLocale"
                >
                  <span class="text-lg">{{ locale === 'es' ? '🇲🇽' : '🇺🇸' }}</span>
                  <span>{{ locale === 'es' ? 'Español' : 'English' }}</span>
                </button>
              </div>

              <!-- Auth -->
              <div>
                <template v-if="auth.isAuthenticated">
                  <div class="flex items-center gap-3 mb-4">
                    <div
                      class="w-10 h-10 rounded-lg bg-on-primary-fixed-variant
                             flex items-center justify-center
                             border border-slate-700 text-sm font-bold text-white"
                    >
                      {{ auth.userInitials }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-white">{{ auth.userName }}</p>
                      <p class="text-xs text-slate-500">{{ auth.userRole }}</p>
                    </div>
                  </div>
                  <button
                    class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded
                           border border-red-800 text-red-400 text-sm font-bold
                           hover:bg-red-900/30 transition-all"
                    @click="auth.logout()"
                  >
                    <span class="material-symbols-outlined text-lg">logout</span>
                    {{ t('nav.logout') }}
                  </button>
                </template>
                <template v-else>
                  <button
                    class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded
                           bg-primary text-white text-sm font-bold
                           hover:bg-primary-container transition-all"
                    @click="openLoginModal"
                  >
                    <span class="material-symbols-outlined text-lg">login</span>
                    {{ t('nav.login') }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const { t, locale } = useI18n({ useScope: 'global' })
const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()
const mobileMenuOpen = ref(false)

// ── Buscador ────────────────────────────────────────────────────────
const searchInput = ref('')

// Sincronizar con URL cuando el usuario está en /catalog
watch(
  () => route.query.search,
  (val) => { searchInput.value = (val as string) ?? '' },
  { immediate: true },
)

function submitSearch() {
  const q = searchInput.value.trim()
  router.push({ path: '/catalog', query: { ...(q ? { search: q } : {}), page: 1 } })
}

function submitSearchMobile() {
  submitSearch()
  mobileMenuOpen.value = false
}

function clearNavSearch() {
  searchInput.value = ''
  if (route.path === '/catalog') {
    const q = { ...route.query }
    delete q.search
    q.page = '1'
    router.push({ query: q })
  }
}

const navLinks = [
  { key: 'catalog', to: '/catalog' },
  { key: 'about',   to: '/' },
  { key: 'contact', to: '/' },
]

function toggleLocale() {
  const next = locale.value === 'es' ? 'en' : 'es'
  document.cookie = `itc_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
  window.location.reload()
}

const authModal = useAuthModal()

function openLoginModal() {
  authModal.open('login')
  mobileMenuOpen.value = false
}
</script>

<style scoped>
/* Transición del menú móvil */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}
.mobile-menu-enter-active > div:last-child,
.mobile-menu-leave-active > div:last-child {
  transition: transform 0.3s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
.mobile-menu-enter-from > div:last-child,
.mobile-menu-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
