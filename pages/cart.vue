<template>
  <div class="min-h-[calc(100vh-56px)] bg-surface">
    <div class="max-w-3xl mx-auto px-4 md:px-8 py-10">

      <!-- ── No autenticado ─────────────────────────────────────────── -->
      <template v-if="!auth.isAuthenticated">
        <div class="py-32 text-center">
          <span class="material-symbols-outlined text-6xl text-slate-200 block mb-4">shopping_cart</span>
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

      <!-- ── Solicitud enviada ───────────────────────────────────────── -->
      <template v-else-if="submitted">
        <div class="py-32 text-center">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-4xl text-green-600">check_circle</span>
          </div>
          <h2 class="text-2xl font-headline font-bold text-primary mb-3">
            {{ t('cart.submitted_title') }}
          </h2>
          <p class="text-slate-500 mb-8">{{ t('cart.submitted_msg') }}</p>
          <NuxtLink
            to="/catalog"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white
                   font-bold hover:bg-primary-container transition-all"
          >
            <span class="material-symbols-outlined">inventory_2</span>
            {{ t('cart.go_catalog') }}
          </NuxtLink>
        </div>
      </template>

      <!-- ── Contenido del carrito ──────────────────────────────────── -->
      <template v-else>

        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-headline font-extrabold text-primary">{{ t('cart.title') }}</h1>
            <p v-if="cartStore.itemCount > 0" class="text-sm text-slate-400 mt-1">
              {{ t('cart.qty_items', { n: cartStore.itemCount }, cartStore.itemCount) }}
            </p>
          </div>
          <NuxtLink
            to="/catalog"
            class="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <span class="material-symbols-outlined text-base">arrow_back</span>
            {{ t('catalog.breadcrumb') }}
          </NuxtLink>
        </div>

        <!-- Loading inicial -->
        <div
          v-if="cartStore.isLoading && !cartStore.cart"
          class="py-24 flex items-center justify-center gap-3 text-slate-400"
        >
          <span class="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
        </div>

        <!-- Carrito vacío -->
        <div v-else-if="cartStore.isEmpty" class="py-32 text-center">
          <span class="material-symbols-outlined text-6xl text-slate-200 block mb-4">shopping_cart</span>
          <p class="text-xl font-bold text-slate-400 mb-2">{{ t('cart.empty') }}</p>
          <NuxtLink
            to="/catalog"
            class="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-primary text-white
                   font-bold hover:bg-primary-container transition-all"
          >
            <span class="material-symbols-outlined">inventory_2</span>
            {{ t('cart.empty_cta') }}
          </NuxtLink>
        </div>

        <!-- Items + submit -->
        <div v-else class="space-y-3">

          <!-- ── Aviso: equipos ocultados por el admin ──────────────── -->
          <div
            v-if="cartStore.hasUnavailable"
            class="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 !mb-5"
          >
            <p class="text-sm text-red-600 font-bold flex items-start gap-1.5">
              <span class="material-symbols-outlined text-base shrink-0">error</span>
              {{ t('cart.unavailable_warning', { n: cartStore.unavailableItems.length }, cartStore.unavailableItems.length) }}
            </p>
            <ul class="mt-2 ml-6 list-disc text-sm text-red-600 space-y-0.5">
              <li v-for="item in cartStore.unavailableItems" :key="item.id">
                {{ item.nombre_snapshot }}
              </li>
            </ul>
            <button
              class="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white
                     text-sm font-bold hover:bg-red-600 transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="cleaningUnavailable"
              @click="removeAllUnavailable"
            >
              <span
                class="material-symbols-outlined text-base"
                :class="{ 'animate-spin': cleaningUnavailable }"
              >
                {{ cleaningUnavailable ? 'progress_activity' : 'delete_sweep' }}
              </span>
              {{ t('cart.remove_unavailable', { n: cartStore.unavailableItems.length }, cartStore.unavailableItems.length) }}
            </button>
          </div>

          <!-- ── Cada item ─────────────────────────────────────────── -->
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="rounded-2xl p-5 border shadow-sm flex items-center gap-4"
            :class="isUnavailable(item)
              ? 'bg-red-50/60 border-red-200'
              : 'bg-surface-container-lowest border-slate-100'"
          >
            <!-- Ícono -->
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              :class="isUnavailable(item) ? 'bg-red-100' : 'bg-primary/10'"
            >
              <span
                class="material-symbols-outlined text-2xl"
                :class="isUnavailable(item) ? 'text-red-500' : 'text-primary'"
              >
                {{ isUnavailable(item) ? 'do_not_disturb_on' : 'precision_manufacturing' }}
              </span>
            </div>

            <!-- Nombre + código + error de stock -->
            <div class="flex-1 min-w-0">
              <p
                class="font-bold truncate"
                :class="isUnavailable(item) ? 'text-red-600 line-through' : 'text-on-surface'"
              >
                {{ item.nombre_snapshot }}
              </p>
              <p class="text-xs text-slate-400 font-mono mt-0.5">{{ item.codigo_snapshot }}</p>
              <p
                v-if="isUnavailable(item)"
                class="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1"
              >
                <span class="material-symbols-outlined text-sm">block</span>
                {{ t('cart.item_unavailable') }}
              </p>
              <Transition name="stock-err">
                <p
                  v-if="stockErrors[item.id]"
                  class="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1"
                >
                  <span class="material-symbols-outlined text-sm">warning</span>
                  {{ stockErrors[item.id] }}
                </p>
              </Transition>
            </div>

            <!-- Cantidad (solo si es_contable) -->
            <div v-if="item.es_contable_snapshot" class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-slate-400 hidden sm:block">{{ t('cart.qty') }}</span>
              <div
                class="flex items-center rounded-xl border overflow-hidden transition-colors"
                :class="stockErrors[item.id] ? 'border-amber-400' : 'border-slate-200'"
              >
                <button
                  class="w-8 h-9 flex items-center justify-center text-slate-500
                         hover:bg-slate-100 transition-colors disabled:opacity-40"
                  :disabled="item.cantidad <= 1 || updatingItems.has(item.id)"
                  @click="updateQty(item, item.cantidad - 1)"
                >
                  <span class="material-symbols-outlined text-base">remove</span>
                </button>
                <input
                  :value="item.cantidad"
                  type="number"
                  min="1"
                  class="w-12 text-center text-sm font-bold text-on-surface bg-white
                         focus:outline-none border-x border-slate-200 py-1.5"
                  @change="updateQty(item, +($event.target as HTMLInputElement).value)"
                />
                <button
                  class="w-8 h-9 flex items-center justify-center text-slate-500
                         hover:bg-slate-100 transition-colors disabled:opacity-40"
                  :disabled="updatingItems.has(item.id)"
                  @click="updateQty(item, item.cantidad + 1)"
                >
                  <span class="material-symbols-outlined text-base">add</span>
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 shrink-0">
              {{ t('cart.qty') }}: 1
            </div>

            <!-- Quitar -->
            <button
              class="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl
                     text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors
                     disabled:opacity-40"
              :disabled="removingItems.has(item.id)"
              :title="t('cart.remove')"
              @click="removeItem(item.id)"
            >
              <span
                class="material-symbols-outlined text-lg"
                :class="{ 'animate-spin': removingItems.has(item.id) }"
              >
                {{ removingItems.has(item.id) ? 'progress_activity' : 'delete' }}
              </span>
            </button>
          </div>

          <!-- ── Notas + Enviar ─────────────────────────────────────── -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 border border-slate-100 shadow-sm !mt-6">
            <label class="block text-sm font-bold text-on-surface mb-2">
              {{ t('cart.notes_label') }}
            </label>
            <textarea
              v-model="notes"
              :placeholder="t('cart.notes_placeholder')"
              rows="3"
              class="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface
                     border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30
                     resize-none placeholder-slate-400"
            />

            <!-- Error de envío -->
            <p
              v-if="submitError"
              class="mt-3 text-sm text-red-600 font-semibold flex items-start gap-1.5"
            >
              <span class="material-symbols-outlined text-base shrink-0">error</span>
              {{ submitError }}
            </p>

            <button
              class="mt-4 w-full bg-primary text-white py-4 rounded-xl font-headline
                     font-extrabold text-base shadow-lg shadow-primary/20
                     hover:bg-primary-container transition-all
                     flex items-center justify-center gap-3
                     hover:scale-[1.01] active:scale-[0.99]
                     disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
              :disabled="submitting || cartStore.isEmpty || cartStore.hasUnavailable"
              @click="submitCart"
            >
              <span
                class="material-symbols-outlined"
                :class="{ 'animate-spin': submitting }"
              >
                {{ submitting ? 'progress_activity' : 'send' }}
              </span>
              {{ submitting ? t('cart.submitting') : t('cart.submit') }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import type { CartItem } from '~/stores/cart'

const { t } = useI18n({ useScope: 'global' })
const auth      = useAuthStore()
const cartStore = useCartStore()
const authModal = useAuthModal()

const notes       = ref('')
const submitting  = ref(false)
const submitted   = ref(false)
const submitError = ref<string | null>(null)
const updatingItems = ref(new Set<number>())
const removingItems = ref(new Set<number>())
const stockErrors   = ref<Record<number, string>>({})
const cleaningUnavailable = ref(false)

// Equipos que el admin ocultó (mostrar_en_front=false) — detectados al cargar el carrito
const isUnavailable = (item: CartItem) =>
  cartStore.unavailableIds.includes(item.equipment_id)

onMounted(async () => {
  if (auth.isAuthenticated) await cartStore.fetchCart()
})

function setStockError(itemId: number, msg: string) {
  stockErrors.value = { ...stockErrors.value, [itemId]: msg }
  setTimeout(() => {
    const next = { ...stockErrors.value }
    delete next[itemId]
    stockErrors.value = next
  }, 5000)
}

async function updateQty(item: CartItem, qty: number) {
  if (qty < 1 || updatingItems.value.has(item.id)) return
  updatingItems.value = new Set([...updatingItems.value, item.id])
  const result = await cartStore.updateItem(item.id, qty)
  updatingItems.value = new Set([...updatingItems.value].filter(id => id !== item.id))
  if (!result.success && result.message) {
    setStockError(item.id, result.message)
  }
}

async function removeItem(itemId: number) {
  removingItems.value = new Set([...removingItems.value, itemId])
  await cartStore.removeItem(itemId)
  removingItems.value = new Set([...removingItems.value].filter(id => id !== itemId))
  if (!cartStore.hasUnavailable) submitError.value = null
}

async function removeAllUnavailable() {
  cleaningUnavailable.value = true
  await cartStore.removeUnavailableItems()
  cleaningUnavailable.value = false
  submitError.value = null
}

async function submitCart() {
  submitting.value  = true
  submitError.value = null
  const result = await cartStore.submit(notes.value.trim() || undefined)
  submitting.value  = false
  if (result.success) {
    submitted.value = true
  } else {
    submitError.value = result.message ?? t('cart.submit')
    if (result.unavailable?.length) cartStore.markUnavailableByName(result.unavailable)
  }
}

useHead({ title: () => `${t('cart.title')} — Intime Control` })
</script>

<style scoped>
.stock-err-enter-active, .stock-err-leave-active { transition: opacity .2s, transform .2s; }
.stock-err-enter-from, .stock-err-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
