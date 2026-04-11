<template>
  <footer class="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

      <!-- Marca -->
      <div class="col-span-1">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-9 h-9 bg-primary rounded flex items-center justify-center">
            <span class="material-symbols-outlined filled text-white text-xl">precision_manufacturing</span>
          </div>
          <span class="text-xl font-bold text-white font-headline">Intime Control</span>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed">
          {{ t('footer.tagline') }}
        </p>
      </div>

      <!-- Links rápidos -->
      <div>
        <h4 class="font-bold mb-6 text-slate-200 text-sm uppercase tracking-wider">
          {{ t('footer.links') }}
        </h4>
        <ul class="space-y-3 text-sm text-slate-400">
          <li
            v-for="i in 4"
            :key="i"
            class="hover:text-white transition-colors cursor-pointer"
          >
            {{ t(`footer.link${i}`) }}
          </li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h4 class="font-bold mb-6 text-slate-200 text-sm uppercase tracking-wider">
          {{ t('footer.legal') }}
        </h4>
        <ul class="space-y-3 text-sm text-slate-400">
          <li
            v-for="i in 4"
            :key="i"
            class="hover:text-white transition-colors cursor-pointer"
          >
            {{ t(`footer.legal${i}`) }}
          </li>
        </ul>
      </div>

      <!-- Contacto -->
      <div>
        <h4 class="font-bold mb-6 text-slate-200 text-sm uppercase tracking-wider">
          {{ t('footer.contact') }}
        </h4>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary-fixed-dim text-xl mt-0.5">location_on</span>
            <p class="text-sm text-slate-400">{{ t('footer.address') }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary-fixed-dim text-xl">call</span>
            <p class="text-sm text-slate-400">{{ t('footer.phone') }}</p>
          </div>

          <!-- Redes sociales -->
          <div class="flex gap-3 mt-6">
            <!-- LinkedIn -->
            <a
              href="#"
              class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center
                     hover:bg-primary transition-colors"
              aria-label="LinkedIn"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <!-- Twitter/X -->
            <a
              href="#"
              class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center
                     hover:bg-primary transition-colors"
              aria-label="Twitter"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.599 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="max-w-7xl mx-auto px-8 pt-8 border-t border-slate-800
                flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-xs text-slate-500">{{ t('footer.copy') }}</p>
      <div class="flex gap-6 text-xs text-slate-500 uppercase tracking-widest font-bold">
        <a
          v-for="value in footerValues"
          :key="value"
          href="#"
          class="hover:text-white transition-colors"
        >
          {{ value }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()

const footerValues = computed(() => {
  const { t } = useI18n()
  return t('footer.values') as unknown as string[]
})
</script>
