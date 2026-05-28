<template>
  <div class="min-h-[calc(100vh-56px)] bg-surface">
    <div class="max-w-3xl mx-auto px-4 md:px-8 py-10">

      <!-- No autenticado -->
      <template v-if="!auth.isAuthenticated">
        <div class="py-32 text-center">
          <span class="material-symbols-outlined text-6xl text-slate-200 block mb-4">person</span>
          <p class="text-slate-500 mb-6">{{ t('cart.login_required') }}</p>
          <button
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white
                   font-bold hover:bg-primary-container transition-all"
            @click="authModal.open('login')"
          >
            <span class="material-symbols-outlined">login</span>
            {{ t('nav.login') }}
          </button>
        </div>
      </template>

      <template v-else>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-headline font-extrabold text-primary">{{ t('account.title') }}</h1>
        </div>

        <!-- ── Tarjeta de perfil ──────────────────────────────────── -->
        <div class="bg-surface-container-lowest rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">

          <!-- Banner + avatar -->
          <div class="h-24 bg-gradient-to-r from-primary to-primary-container relative">
            <div
              class="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl
                     bg-on-primary-fixed-variant border-4 border-surface-container-lowest
                     flex items-center justify-center text-2xl font-bold text-white shadow-lg"
            >
              {{ auth.userInitials }}
            </div>
          </div>

          <!-- Info -->
          <div class="pt-12 pb-6 px-6 relative">
            <!-- Botones edición (top-right) -->
            <div class="absolute top-3 right-4 flex items-center gap-1">
              <template v-if="!editing">
                <button
                  class="w-8 h-8 rounded-lg flex items-center justify-center
                         text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                  :title="t('account.edit')"
                  @click="startEdit"
                >
                  <span class="material-symbols-outlined text-lg">edit</span>
                </button>
              </template>
              <template v-else>
                <button
                  class="w-8 h-8 rounded-lg flex items-center justify-center
                         text-primary hover:bg-primary/10 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="saving"
                  :title="t('account.save')"
                  @click="saveEdit"
                >
                  <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': saving }">
                    {{ saving ? 'progress_activity' : 'check' }}
                  </span>
                </button>
                <button
                  class="w-8 h-8 rounded-lg flex items-center justify-center
                         text-slate-400 hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  :title="t('account.cancel')"
                  @click="cancelEdit"
                >
                  <span class="material-symbols-outlined text-lg">close</span>
                </button>
              </template>
            </div>

            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <!-- Nombre: texto o input -->
                <h2 v-if="!editing" class="text-xl font-headline font-bold text-on-surface">
                  {{ auth.userName }}
                </h2>
                <input
                  v-else
                  v-model="editNombre"
                  type="text"
                  class="text-xl font-headline font-bold text-on-surface bg-surface-container-low
                         rounded-lg px-3 py-1 focus:outline-none
                         focus:ring-2 focus:ring-primary/30 w-64"
                />
                <p class="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">
                  {{ auth.userRole }}
                </p>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-slate-400">
                <span class="material-symbols-outlined text-sm">calendar_month</span>
                {{ t('account.member_since') }}:
                <span class="font-semibold text-on-surface">{{ fmtDate(auth.user?.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Información de contacto ───────────────────────────── -->
        <div class="bg-surface-container-lowest rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {{ t('account.contact') }}
            </h3>
          </div>

          <!-- Error de guardado -->
          <Transition name="fade-quick">
            <p v-if="saveError" class="text-xs text-red-500 mb-3 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">error</span>
              {{ saveError }}
            </p>
          </Transition>

          <div class="space-y-4">
            <!-- Correo -->
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-primary text-lg">mail</span>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {{ t('auth.correo') }}
                </p>
                <p class="text-sm font-semibold text-on-surface mt-0.5">{{ auth.user?.correo }}</p>
              </div>
            </div>

            <!-- Teléfono -->
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                :class="(editing || auth.user?.telefono) ? 'bg-primary/10' : 'bg-slate-100'"
              >
                <span
                  class="material-symbols-outlined text-lg transition-colors"
                  :class="(editing || auth.user?.telefono) ? 'text-primary' : 'text-slate-300'"
                >
                  phone
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {{ t('auth.telefono') }}
                </p>
                <p
                  v-if="!editing"
                  class="text-sm mt-0.5"
                  :class="auth.user?.telefono
                    ? 'font-semibold text-on-surface'
                    : 'text-slate-300 italic'"
                >
                  {{ auth.user?.telefono || t('account.no_phone') }}
                </p>
                <input
                  v-else
                  v-model="editTelefono"
                  type="tel"
                  :placeholder="t('account.no_phone')"
                  class="text-sm font-semibold text-on-surface bg-surface-container-low mt-0.5
                         rounded-lg px-3 py-1 w-full max-w-xs
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ── Accesos rápidos ────────────────────────────────────── -->
        <div class="bg-surface-container-lowest rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            {{ t('account.quick_links') }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink
              to="/requests"
              class="flex items-center gap-3 p-4 rounded-xl border border-slate-100
                     hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-blue-500 text-lg">assignment</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-on-surface">{{ t('account.go_requests') }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ t('requests.title') }}</p>
              </div>
              <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </NuxtLink>

            <NuxtLink
              to="/catalog"
              class="flex items-center gap-3 p-4 rounded-xl border border-slate-100
                     hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-primary text-lg">inventory_2</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-on-surface">{{ t('account.go_catalog') }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ t('catalog.title') }}</p>
              </div>
              <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </NuxtLink>

            <NuxtLink
              to="/cart"
              class="flex items-center gap-3 p-4 rounded-xl border border-slate-100
                     hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-green-500 text-lg">shopping_cart</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-on-surface">{{ t('cart.title') }}</p>
                <p class="text-xs text-slate-400 mt-0.5">
                  {{ cartStore.itemCount > 0
                    ? t('cart.qty_items', { n: cartStore.itemCount }, cartStore.itemCount)
                    : t('cart.empty') }}
                </p>
              </div>
              <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const { t, locale } = useI18n({ useScope: 'global' })
const auth      = useAuthStore()
const cartStore = useCartStore()
const authModal = useAuthModal()

// ── Edición de perfil ──────────────────────────────────────────────
const editing     = ref(false)
const saving      = ref(false)
const saveError   = ref('')
const editNombre   = ref('')
const editTelefono = ref('')

function startEdit() {
  editNombre.value   = auth.user?.nombre   ?? ''
  editTelefono.value = auth.user?.telefono ?? ''
  saveError.value    = ''
  editing.value      = true
}

function cancelEdit() {
  editing.value   = false
  saveError.value = ''
}

async function saveEdit() {
  if (!editNombre.value.trim()) return
  saving.value    = true
  saveError.value = ''
  const result = await auth.updateProfile({
    nombre:   editNombre.value.trim(),
    telefono: editTelefono.value.trim() || null,
  })
  saving.value = false
  if (result.success) {
    editing.value = false
  } else {
    saveError.value = result.message ?? Object.values(result.errors ?? {})[0]?.[0] ?? 'Error al guardar'
  }
}

// ── Utilidades ────────────────────────────────────────────────────
function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(locale.value === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric', month: 'long', day: '2-digit',
  })
}

useHead({ title: () => `${t('account.title')} — Intime Control` })
</script>

<style scoped>
.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity .2s; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
</style>
