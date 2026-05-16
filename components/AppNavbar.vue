<template>
  <!-- Sticky Dark Navbar -->
  <nav class="sticky top-0 z-50 bg-[#050b18] text-white shadow-[var(--shadow-navbar)]">
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-6">

      <!-- Izquierda: ícono + label -->
      <a class="flex items-center gap-2 group transition-colors" href="/catalog">
        <span class="material-symbols-outlined text-slate-400 text-xl group-hover:text-slate-200 transition-colors">inventory_2</span>
        <span class="text-[11px] font-bold tracking-widest text-slate-400 uppercase hidden sm:block group-hover:text-slate-200 transition-colors">
          {{ t('nav.inventory') }}
        </span>
      </a>

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

        <!-- Cart icon (solo autenticado) -->
        <NuxtLink
          v-if="auth.isAuthenticated"
          to="/cart"
          class="relative flex items-center justify-center w-9 h-9 rounded-lg
                 text-slate-300 hover:text-white hover:bg-white/8 transition-all shrink-0"
          :title="t('cart.title')"
        >
          <span class="material-symbols-outlined text-xl">shopping_cart</span>
          <span
            v-if="cartStore.itemCount > 0"
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full
                   bg-primary-fixed-dim text-on-primary-fixed text-[10px] font-bold
                   flex items-center justify-center leading-none"
          >
            {{ cartStore.itemCount }}
          </span>
        </NuxtLink>

        <!-- Auth: dropdown de perfil o botón login -->
        <template v-if="auth.isAuthenticated">
          <!-- Trigger + dropdown wrapper -->
          <div ref="profileMenuRef" class="relative shrink-0">
            <button
              class="flex items-center gap-2 rounded-lg px-2 py-1
                     hover:bg-white/8 transition-all"
              @click="profileMenuOpen = !profileMenuOpen"
            >
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
              <span
                class="material-symbols-outlined text-slate-500 text-base transition-transform duration-200"
                :class="{ 'rotate-180': profileMenuOpen }"
              >
                expand_more
              </span>
            </button>

            <!-- Menú desplegable -->
            <Transition name="dropdown">
              <div
                v-if="profileMenuOpen"
                class="absolute right-0 top-full mt-2 w-52
                       bg-[#050b17] border border-slate-700/60 rounded-xl
                       shadow-2xl shadow-black/60 overflow-hidden z-20"
              >
                <NuxtLink
                  to="/account"
                  class="flex items-center gap-3 px-4 py-3 text-sm text-slate-300
                         hover:bg-white/8 hover:text-white transition-colors"
                  @click="profileMenuOpen = false"
                >
                  <span class="material-symbols-outlined text-lg">person</span>
                  {{ t('nav.account') }}
                </NuxtLink>
                <NuxtLink
                  to="/requests"
                  class="flex items-center gap-3 px-4 py-3 text-sm text-slate-300
                         hover:bg-white/8 hover:text-white transition-colors"
                  @click="profileMenuOpen = false"
                >
                  <span class="material-symbols-outlined text-lg">assignment</span>
                  {{ t('nav.requests') }}
                </NuxtLink>
                <div class="h-px bg-slate-700/60 mx-3 my-1" />
                <button
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400
                         hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  @click="auth.logout(); profileMenuOpen = false"
                >
                  <span class="material-symbols-outlined text-lg">logout</span>
                  {{ t('nav.logout') }}
                </button>
              </div>
            </Transition>
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

    <!-- ── Menú móvil (overlay) ──────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-[60]">
          <!-- Fondo oscurecido -->
          <div class="absolute inset-0 bg-black/75" @click="mobileMenuOpen = false" />

          <!-- Panel -->
          <div class="absolute right-0 top-0 bottom-0 w-72 bg-[#050b17] overflow-y-auto flex flex-col">

            <!-- Botón cerrar (top-right absoluto) -->
            <button
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                     rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              @click="mobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>

            <!-- ── Perfil (si autenticado) ─────────────────────────── -->
            <template v-if="auth.isAuthenticated">
              <div class="px-6 pt-6 pb-5 border-b border-slate-800/60">
                <div class="flex items-center gap-4">
                  <div
                    class="w-14 h-14 rounded-2xl bg-on-primary-fixed-variant
                           flex items-center justify-center
                           border border-white/10 text-xl font-bold text-white shrink-0"
                  >
                    {{ auth.userInitials }}
                  </div>
                  <div>
                    <p class="text-base font-bold text-white leading-tight">{{ auth.userName }}</p>
                    <p class="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">
                      {{ auth.userRole }}
                    </p>
                  </div>
                </div>
              </div>
            </template>

            <!-- ── Buscador ────────────────────────────────────────── -->
            <div class="px-5 pt-5 pb-4 border-b border-slate-800/60">
              <div class="relative">
                <input
                  v-model="searchInput"
                  type="text"
                  :placeholder="t('nav.search')"
                  class="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4
                         text-sm text-slate-200 placeholder-slate-600
                         focus:outline-none focus:border-white/25 transition-all"
                  @keydown.enter="submitSearchMobile"
                />
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg">
                  search
                </span>
              </div>
            </div>

            <!-- ── Idioma ──────────────────────────────────────────── -->
            <div class="px-5 py-4 border-b border-slate-800/60">
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                Idioma
              </p>
              <button
                class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                       border border-white/10 text-slate-400 text-sm font-bold
                       hover:border-white/25 hover:text-white transition-all"
                @click="toggleLocale"
              >
                <span class="text-lg">{{ locale === 'es' ? '🇲🇽' : '🇺🇸' }}</span>
                <span>{{ locale === 'es' ? 'Español' : 'English' }}</span>
              </button>
            </div>

            <!-- ── Opciones de perfil (autenticado) ───────────────── -->
            <template v-if="auth.isAuthenticated">
              <div class="px-5 py-4 border-b border-slate-800/60 space-y-1">
                <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                  {{ t('nav.account') }}
                </p>

                <NuxtLink
                  to="/account"
                  class="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-slate-400
                         hover:text-white hover:bg-white/8 transition-all"
                  @click="mobileMenuOpen = false"
                >
                  <span class="material-symbols-outlined text-lg">person</span>
                  {{ t('nav.account') }}
                </NuxtLink>

                <NuxtLink
                  to="/requests"
                  class="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-slate-400
                         hover:text-white hover:bg-white/8 transition-all"
                  @click="mobileMenuOpen = false"
                >
                  <span class="material-symbols-outlined text-lg">assignment</span>
                  {{ t('nav.requests') }}
                </NuxtLink>

                <NuxtLink
                  to="/cart"
                  class="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl text-sm
                         text-slate-400 hover:text-white hover:bg-white/8 transition-all"
                  @click="mobileMenuOpen = false"
                >
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-lg">shopping_cart</span>
                    {{ t('cart.title') }}
                  </div>
                  <span
                    v-if="cartStore.itemCount > 0"
                    class="min-w-[20px] h-5 px-1.5 rounded-full bg-primary-fixed-dim
                           text-on-primary-fixed text-[10px] font-bold
                           flex items-center justify-center"
                  >
                    {{ cartStore.itemCount }}
                  </span>
                </NuxtLink>
              </div>

              <!-- Logout -->
              <div class="px-5 py-4 mt-auto">
                <button
                  class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         border border-red-900/50 text-red-500 text-sm font-bold
                         hover:bg-red-950/50 hover:text-red-400 transition-all"
                  @click="auth.logout(); mobileMenuOpen = false"
                >
                  <span class="material-symbols-outlined text-lg">logout</span>
                  {{ t('nav.logout') }}
                </button>
              </div>
            </template>

            <!-- ── Login (no autenticado) ──────────────────────────── -->
            <template v-else>
              <div class="px-5 py-4">
                <button
                  class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         bg-primary text-white text-sm font-bold
                         hover:bg-primary-container transition-all"
                  @click="openLoginModal"
                >
                  <span class="material-symbols-outlined text-lg">login</span>
                  {{ t('nav.login') }}
                </button>
              </div>
            </template>

          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const { t, locale } = useI18n({ useScope: 'global' })
const auth      = useAuthStore()
const cartStore = useCartStore()
const router    = useRouter()
const route     = useRoute()
const mobileMenuOpen  = ref(false)
const profileMenuOpen = ref(false)
const profileMenuRef  = ref<HTMLElement | null>(null)

watch(
  () => auth.isAuthenticated,
  (v) => { if (v) cartStore.fetchCart() },
  { immediate: true },
)

// Cierra el dropdown al hacer clic fuera
watch(profileMenuOpen, (open) => {
  if (!open) return
  const handler = (e: MouseEvent) => {
    if (profileMenuRef.value && !profileMenuRef.value.contains(e.target as Node)) {
      profileMenuOpen.value = false
      document.removeEventListener('click', handler)
    }
  }
  // nextTick para que el clic que abrió no lo cierre inmediatamente
  nextTick(() => document.addEventListener('click', handler))
})

// ── Buscador ─────────────────────────────────────────────────────────
const searchInput = ref('')

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
/* Menú móvil */
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

/* Dropdown desktop */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
