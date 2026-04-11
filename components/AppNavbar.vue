<template>
  <!-- Sticky Dark Navbar -->
  <nav class="sticky top-0 z-50 bg-[#050b18] text-white shadow-[var(--shadow-navbar)]">
    <div class="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between gap-6">

      <!-- Izquierda: ícono + label -->
      <div class="flex items-center gap-2 shrink-0">
        <span class="material-symbols-outlined text-slate-400 text-xl">inventory_2</span>
        <span class="text-[11px] font-bold tracking-widest text-slate-400 uppercase hidden sm:block">
          {{ t('nav.inventory') }}
        </span>
      </div>

      <!-- Centro: links de navegación -->
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

      <!-- Derecha: buscador + idioma + auth -->
      <div class="flex items-center gap-3 flex-1 justify-end">

        <!-- Buscador -->
        <div class="relative w-full max-w-xs hidden lg:block">
          <input
            type="text"
            :placeholder="t('nav.search')"
            class="w-full bg-[#111927] border-none rounded py-1.5 pl-9 pr-4
                   text-xs text-slate-200 placeholder-slate-500
                   focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim/60
                   transition-all"
          />
          <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
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
        <div class="w-px h-5 bg-slate-700 hidden sm:block shrink-0" />

        <!-- Auth: usuario autenticado o botón de login -->
        <template v-if="auth.isAuthenticated">
          <!-- Avatar + nombre + settings -->
          <div class="flex items-center gap-2.5">
            <div class="text-right hidden sm:block">
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
          <!-- Botón de login (visual) -->
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

        <!-- Menú hamburguesa (mobile) -->
        <button
          class="lg:hidden text-slate-400 hover:text-white transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="material-symbols-outlined text-xl">
            {{ mobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>

      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden bg-[#070f1f] border-t border-slate-800 px-8 py-4 flex flex-col gap-1"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.key"
          :to="link.to"
          class="py-2.5 px-3 rounded text-sm text-slate-300
                 hover:text-white hover:bg-white/8 transition-all"
          @click="mobileMenuOpen = false"
        >
          {{ t(`nav.${link.key}`) }}
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const { t, locale } = useI18n({ useScope: 'global' })
const auth = useAuthStore()
const mobileMenuOpen = ref(false)

const navLinks = [
  { key: 'catalog', to: '/catalog' },
  { key: 'about',   to: '/about' },
  { key: 'contact', to: '/contact' },
]

function toggleLocale() {
  const next = locale.value === 'es' ? 'en' : 'es'
  document.cookie = `itc_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
  window.location.reload()
}

// Por ahora solo cierra el menú — login modal se implementa con auth real
function openLoginModal() {
  // TODO: abrir modal de login cuando exista la tabla de usuarios
  console.info('Login modal pendiente de implementación')
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
