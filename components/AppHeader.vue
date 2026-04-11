<template>
  <!-- Brand Header -->
  <header class="bg-white w-full border-b border-slate-100">
    <div class="max-w-7xl mx-auto flex items-stretch">

      <!-- Logo -->
      <div class="py-5 px-8 flex items-center gap-4 bg-white shrink-0">
        <div class="w-11 h-11 bg-primary rounded flex items-center justify-center shadow-sm">
          <span class="material-symbols-outlined filled text-white text-2xl">
            precision_manufacturing
          </span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-extrabold text-primary font-headline tracking-tight">
            Intime Control
          </span>
          <span class="text-[10px] uppercase tracking-widest text-slate-400 font-label leading-none mt-0.5">
            {{ t('brand.tagline') }}
          </span>
        </div>
      </div>

      <!-- Slogan strip -->
      <div
        class="flex-1 bg-surface-container-low py-5 px-10
               flex items-center justify-between
               border-l border-slate-100 rounded-l-xl my-3 mr-8
               hidden md:flex"
      >
        <div class="flex flex-col">
          <p class="text-primary font-bold text-sm">
            {{ t('brand.slogan') }}
          </p>
          <p class="text-slate-400 text-[10px] mt-1">
            {{ t('brand.bilingual') }}
          </p>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
