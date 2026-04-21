<template>
  <!-- Brand Header -->
  <header class="bg-white w-full border-b border-slate-100">
    <div class="max-w-7xl mx-auto flex items-stretch">

      <!-- Logo -->
      <div class="py-3 px-8 flex items-center gap-4 bg-white shrink-0">
        <img src="/assets/imgs/itc tittle.png" alt="Intime Control" class="h-14 w-auto object-contain" />
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
