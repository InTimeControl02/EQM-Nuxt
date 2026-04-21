<template>
  <div>

    <!-- ══════════════════════════════════════════════════════════
         HERO — primera sección snap
         scroll-mt-14: el snap queda justo bajo el navbar sticky
    ══════════════════════════════════════════════════════════ -->
    <section class="snap-start relative w-full min-h-screen overflow-hidden flex flex-col justify-center">

      <div class="hero-overlay absolute inset-0 z-10" />

      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhO2EV4kwlVPf3fGoWZQQbkW309pPvN2JGNzqdbSQO8wJ1QHWguu5OUHs4ZLgKg3JL4HPcQOHV5wsx0WTAyq3Izov4NVrO6CGXGFEZX9pR9sfjHpHl3xOMh36GPhEOOvhQl2faXmDyN30Q60T5zSTbo28eBHEDj7xZraGVr0OVmGyi0n8NX0zqP5K4CME2E917Ncala_I9ewio1ndVxOeWQeNWd5BYuEWzLb0AKRfz5id0P9rmUeLZbOmos90nbVDoyA0e4a-6XKgI"
        alt="Industrial background"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="relative z-20 max-w-7xl mx-auto px-8 w-full">
        <span
          class="bg-primary-container text-primary-fixed-dim px-4 py-1.5
                 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-widest
                 border border-white/10
                 opacity-0-init animate-fade-up animate-delay-100"
        >
          {{ t('hero.badge') }}
        </span>

        <div class="space-y-1">
          <h1 class="text-5xl md:text-7xl font-extrabold text-white font-headline leading-none
                     opacity-0-init animate-fade-up animate-delay-200">
            {{ t('hero.title1') }}
          </h1>
          <h1 class="text-5xl md:text-7xl font-extrabold text-surface-dim font-headline leading-none
                     opacity-0-init animate-fade-up animate-delay-300">
            {{ t('hero.title2') }}
          </h1>
        </div>

        <p class="text-lg text-slate-200 mt-8 max-w-2xl font-body leading-relaxed
                  opacity-0-init animate-fade-up animate-delay-400">
          {{ t('hero.description') }}
        </p>

        <div class="flex flex-wrap gap-4 mt-10 opacity-0-init animate-fade-up animate-delay-500">
          <NuxtLink to="/catalog" class="btn-primary">
            {{ t('hero.cta_primary') }}
            <span class="material-symbols-outlined text-xl">analytics</span>
          </NuxtLink>
          <button class="btn-ghost">
            {{ t('hero.cta_secondary') }}
          </button>
        </div>
      </div>

      <!-- Indicador de scroll -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2
                  opacity-0-init animate-fade-up animate-delay-600">
        <span class="text-xs text-white/50 uppercase tracking-widest font-label">scroll</span>
        <span class="material-symbols-outlined text-white/40 animate-bounce">keyboard_arrow_down</span>
      </div>
    </section>


    <!-- ══════════════════════════════════════════════════════════
         WORKFLOW — segunda sección snap
    ══════════════════════════════════════════════════════════ -->
    <section class="snap-start min-h-screen flex flex-col justify-center
                    px-8 py-16 bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto w-full">

        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold font-headline text-primary mb-4 itc-animate-in itc-delay-1">
            {{ t('workflow.title') }}
          </h2>
          <p class="text-lg text-secondary max-w-3xl mx-auto itc-animate-in itc-delay-2">
            {{ t('workflow.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div class="hidden md:block absolute top-12 left-0 w-full h-px bg-slate-100 -z-0" />

          <div
            v-for="(step, i) in workflowSteps"
            :key="step.key"
            class="relative z-10 flex flex-col items-center text-center itc-animate-in"
            :class="`itc-delay-${i + 2}`"
          >
            <div class="w-24 h-24 rounded-2xl bg-surface-container-low flex items-center justify-center
                        text-primary mb-6 border border-slate-100 shadow-sm">
              <span class="material-symbols-outlined text-4xl">{{ step.icon }}</span>
            </div>
            <h4 class="font-bold text-lg mb-2 font-headline">{{ t(`workflow.${step.key}_title`) }}</h4>
            <p class="text-sm text-slate-500 leading-relaxed">{{ t(`workflow.${step.key}_desc`) }}</p>
          </div>
        </div>

        <div class="mt-12 bg-surface-container-low p-6 rounded-xl border border-primary/10
                    flex items-center gap-4 max-w-3xl mx-auto itc-animate-in itc-delay-5">
          <span class="material-symbols-outlined text-primary text-3xl shrink-0">info</span>
          <p class="text-sm text-on-secondary-container">
            <span class="font-bold">{{ t('workflow.notice_bold') }}</span>
            {{ ' ' + t('workflow.notice') }}
          </p>
        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════════════════════════
         CARRUSEL — tercera sección snap (scroll-mt dentro del componente)
    ══════════════════════════════════════════════════════════ -->
    <CategoryCarousel />


    <!-- ══════════════════════════════════════════════════════════
         FEATURES — cuarta sección snap
    ══════════════════════════════════════════════════════════ -->
    <section class="snap-start min-h-screen flex flex-col justify-center
                    px-8 py-16 bg-surface-container-low">
      <div class="max-w-7xl mx-auto w-full">

        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold font-headline text-primary mb-4 itc-animate-in itc-delay-1">
            {{ t('features.title') }}
          </h2>
          <p class="text-lg text-secondary itc-animate-in itc-delay-2">
            {{ t('features.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(feature, i) in featureCards"
            :key="feature.key"
            class="card p-10 flex flex-col items-center text-center itc-animate-in"
            :class="`itc-delay-${i + 2}`"
          >
            <div class="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-8">
              <span class="material-symbols-outlined filled text-5xl">{{ feature.icon }}</span>
            </div>
            <h3 class="font-bold text-xl mb-4 font-headline">{{ t(`features.${feature.key}_title`) }}</h3>
            <p class="text-slate-500 leading-relaxed text-sm">{{ t(`features.${feature.key}_desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({ title: 'Intime Control — Catálogo de Equipos Industriales' })

const workflowSteps = [
  { key: 'step1', icon: 'person_add' },
  { key: 'step2', icon: 'shopping_cart' },
  { key: 'step3', icon: 'send' },
  { key: 'step4', icon: 'fact_check' },
]

const featureCards = [
  { key: 'f1', icon: 'verified' },
  { key: 'f2', icon: 'inventory_2' },
  { key: 'f3', icon: 'history' },
]
</script>
