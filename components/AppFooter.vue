<template>
  <footer class="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-9 gap-12 mb-12">

      <!-- Marca -->
      <div class="col-span-3">
        <div class="flex items-center gap-3 mb-4">
          <img src="/assets/imgs/favicon_logo_ITC-removebg.png" alt="Intime Control" class="w-10 h-10 object-contain" />
          <span class="text-xl font-bold text-white font-headline">Intime Control</span>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed">
          {{ t('footer.tagline') }}
        </p>
      </div>

            <!-- Contacto -->
      <div class="col-span-3">
        <h4 class="font-bold mb-6 text-slate-200 text-sm uppercase tracking-wider">
          {{ t('footer.contact') }}
        </h4>
        <div class="grid grid-cols-1 gap-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary-fixed-dim text-xl mt-0.5">location_on</span>
            <a href="https://www.google.com/maps/place/IN+TIME+CONTROL/@25.7764407,-100.1308842,16.59z/data=!4m12!1m5!8m4!1e2!2s112084839161816291697!3m1!1e1!3m5!1s0x8662e9c5b0000001:0x75c2ebf4363d5a35!8m2!3d25.7769313!4d-100.1343505!16s%2Fg%2F11j8rkbkw9?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" class="text-sm text-slate-400 hover:text-white transition-colors">
              Parque industrial Milenium, Boulevard Milenium #5060, CP. 66626, Apodaca, N.L.
            </a>
          </div>
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary-fixed-dim text-xl">call</span>
            <p class="text-sm text-slate-400">{{ t('footer.phone') }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary-fixed-dim text-xl">email</span>
            <a href="mailto:info@intimecontrol.com" class="text-sm text-slate-400 hover:text-white transition-colors">
              info@intimecontrol.com
            </a>
          </div>
        </div>
      </div>

      <!-- Legal -->
      <div class="col-span-3">
        <h4 class="font-bold mb-6 text-slate-200 text-sm uppercase tracking-wider">
          {{ t('footer.legal') }}
        </h4>
        <div class="gap-4">
          <ul class="space-y-3 text-sm text-slate-400">
            <li>
              <a href="/docs/ISO 90012015.pdf" target="_blank" class="hover:text-white transition-colors">
                {{ t('footer.legal1') }} ISO 9001:2015
              </a>
            </li>
            <li>
              <a href="/docs/ISO 140012015.pdf" target="_blank" class="hover:text-white transition-colors">
                {{ t('footer.legal1') }} ISO 14001:2015
              </a>
            </li>
            <li>
              <a href="/docs/ISO 450012018.pdf" target="_blank" class="hover:text-white transition-colors">
                {{ t('footer.legal1') }} ISO 45001:2018
              </a>
            </li>
            <li>
              <a href="/docs/3. Politica Integral InTime Control Rev.03 Ene-2026.pdf" target="_blank"
                class="hover:text-white transition-colors">
                Política Integral
              </a>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="max-w-7xl mx-auto px-8 pt-8 border-t border-slate-800
                flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-xs text-slate-500">{{ t('footer.copy') }}</p>
      <div class="flex items-center gap-3">
        <!-- LinkedIn -->
        <a href="https://www.linkedin.com/company/in-time-control/posts/?feedView=all" target="_blank" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center
                     hover:bg-primary transition-colors" aria-label="LinkedIn">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <!-- Facebook -->
        <a href="https://www.facebook.com/intimecontrol" target="_blank" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center
                     hover:bg-primary transition-colors" aria-label="Facebook">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
