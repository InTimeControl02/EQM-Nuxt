<template>
  <div class="flex bg-surface">

    <!-- ── Sidebar (desktop) ─────────────────────────────────────── -->
    <aside
      class="hidden md:block w-72 shrink-0 bg-slate-50 border-r border-slate-100
             sticky top-14 h-[calc(100vh-56px)] overflow-y-auto no-scrollbar"
    >
      <CatalogSidebar
        :categories="allCategories"
        :selected-id="null"
        @select="onCategorySelect"
      />
    </aside>

    <!-- ── Contenido ────────────────────────────────────────────── -->
    <main class="flex-1 min-w-0 px-6 md:px-10 pb-16 pt-6">

      <!-- ── Skeleton loader ──────────────────────────────────────── -->
      <div v-if="pending" class="animate-pulse">

        <!-- Breadcrumb skeleton -->
        <div class="flex items-center gap-2 mb-6">
          <div class="h-3 w-16 bg-slate-200 rounded-full" />
          <div class="h-3 w-2 bg-slate-100 rounded-full" />
          <div class="h-3 w-24 bg-slate-200 rounded-full" />
          <div class="h-3 w-2 bg-slate-100 rounded-full" />
          <div class="h-3 w-36 bg-slate-200 rounded-full" />
        </div>

        <!-- Grid principal -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

          <!-- Columna izquierda (7) -->
          <div class="lg:col-span-7 flex flex-col gap-6">

            <!-- Título skeleton -->
            <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start justify-between gap-4">
              <div class="flex-1 space-y-3">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-56 bg-slate-200 rounded-lg" />
                  <div class="h-5 w-20 bg-slate-100 rounded-full" />
                </div>
                <div class="h-3 w-32 bg-slate-100 rounded-full" />
                <div class="h-3 w-24 bg-slate-100 rounded-full" />
              </div>
              <div class="h-4 w-16 bg-slate-100 rounded-full shrink-0" />
            </div>

            <!-- Galería skeleton -->
            <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <!-- Tabs -->
              <div class="flex gap-4 px-4 pt-4 border-b border-surface-container-low pb-3">
                <div class="h-3 w-20 bg-slate-200 rounded-full" />
                <div class="h-3 w-24 bg-slate-100 rounded-full" />
                <div class="h-3 w-16 bg-slate-100 rounded-full" />
              </div>
              <!-- Imagen principal -->
              <div class="mx-4 mt-4 rounded-xl aspect-video bg-slate-100" />
              <!-- Miniaturas -->
              <div class="grid grid-cols-5 gap-2 p-4">
                <div v-for="i in 5" :key="i" class="aspect-square rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>

          <!-- Columna derecha (5) -->
          <div class="lg:col-span-5 flex flex-col gap-6">
            <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5">
              <!-- Título specs -->
              <div class="h-5 w-48 bg-slate-200 rounded-lg pb-3 border-b border-surface-container-low" />

              <!-- Filas de especificaciones (6 pares label/valor) -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <div class="h-2.5 w-10 bg-slate-100 rounded-full" />
                  <div class="h-4 w-20 bg-slate-200 rounded" />
                </div>
                <div class="space-y-1.5">
                  <div class="h-2.5 w-12 bg-slate-100 rounded-full" />
                  <div class="h-4 w-24 bg-slate-200 rounded" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <div class="h-2.5 w-14 bg-slate-100 rounded-full" />
                  <div class="h-4 w-28 bg-slate-200 rounded" />
                </div>
                <div class="space-y-1.5">
                  <div class="h-2.5 w-8 bg-slate-100 rounded-full" />
                  <div class="h-4 w-12 bg-slate-200 rounded" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <div class="h-2.5 w-16 bg-slate-100 rounded-full" />
                  <div class="h-4 w-20 bg-slate-200 rounded" />
                </div>
                <div class="space-y-1.5">
                  <div class="h-2.5 w-10 bg-slate-100 rounded-full" />
                  <div class="h-4 w-16 bg-slate-200 rounded" />
                </div>
              </div>
              <!-- Disponibilidad -->
              <div class="space-y-1.5">
                <div class="h-2.5 w-20 bg-slate-100 rounded-full" />
                <div class="h-5 w-24 bg-slate-200 rounded" />
              </div>
              <!-- Descripción -->
              <div class="space-y-1.5">
                <div class="h-2.5 w-20 bg-slate-100 rounded-full" />
                <div class="h-3 w-full bg-slate-100 rounded-full" />
                <div class="h-3 w-5/6 bg-slate-100 rounded-full" />
                <div class="h-3 w-4/6 bg-slate-100 rounded-full" />
              </div>

              <!-- CTA skeleton -->
              <div class="mt-auto pt-4 flex gap-3">
                <div class="w-28 h-14 bg-slate-100 rounded-xl" />
                <div class="flex-1 h-14 bg-slate-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tablas skeleton -->
        <div class="space-y-8">
          <!-- Cert table -->
          <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div class="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <div class="h-4 w-40 bg-slate-200 rounded" />
              <div class="h-3 w-16 bg-slate-100 rounded-full" />
            </div>
            <div class="divide-y divide-surface-container-low">
              <div v-for="i in 2" :key="i" class="px-6 py-4 grid grid-cols-4 gap-4">
                <div class="h-4 bg-slate-200 rounded" />
                <div class="h-4 bg-slate-100 rounded" />
                <div class="h-4 bg-slate-100 rounded" />
                <div class="h-6 w-12 bg-slate-100 rounded-lg ml-auto" />
              </div>
            </div>
          </div>
          <!-- Accessories table -->
          <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div class="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <div class="h-4 w-36 bg-slate-200 rounded" />
              <div class="h-3 w-12 bg-slate-100 rounded-full" />
            </div>
            <div class="divide-y divide-surface-container-low">
              <div v-for="i in 2" :key="i" class="px-6 py-4 flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                <div class="flex-1 h-4 bg-slate-200 rounded" />
                <div class="w-32 h-4 bg-slate-100 rounded" />
                <div class="w-8 h-4 bg-slate-100 rounded ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error || !equipment" class="py-24 text-center">
        <span class="material-symbols-outlined text-error text-5xl block mb-3">error</span>
        <p class="text-slate-500">{{ t('equipment.error') }}</p>
        <NuxtLink to="/catalog" class="mt-4 inline-block text-primary text-sm font-semibold hover:underline">
          {{ t('equipment.back') }}
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 mb-6 flex-wrap">
          <NuxtLink to="/catalog" class="text-[10px] font-bold text-primary/40 uppercase tracking-widest hover:text-primary transition-colors">
            {{ t('catalog.breadcrumb') }}
          </NuxtLink>
          <span class="material-symbols-outlined text-xs text-primary/30">chevron_right</span>
          <span v-if="equipment.category" class="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
            {{ locale === 'es' ? equipment.category.nombre_es : equipment.category.nombre_en }}
          </span>
          <span v-if="equipment.category" class="material-symbols-outlined text-xs text-primary/30">chevron_right</span>
          <span class="text-[10px] font-bold text-primary uppercase tracking-widest line-clamp-1">
            {{ equipmentName }}
          </span>
        </nav>

        <!-- ── Grid principal ────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

          <!-- ── Columna izquierda (7) ──────────────────────────── -->
          <div class="lg:col-span-7 flex flex-col gap-6">

            <!-- Título -->
            <section class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 class="text-3xl font-headline font-extrabold text-primary tracking-tight">
                    {{ equipmentName }}
                  </h1>
                  <span
                    class="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ring-1"
                    :class="statusClass"
                  >
                    {{ equipment.status }}
                  </span>
                </div>
                <p class="text-on-surface-variant text-sm flex items-center gap-1.5 mt-1">
                  <span class="material-symbols-outlined text-sm">fingerprint</span>
                  {{ equipment.codigo }}
                </p>
                <p v-if="equipment.category" class="text-xs text-slate-400 mt-1">
                  {{ t('equipment.category') }}: {{ locale === 'es' ? equipment.category.nombre_es : equipment.category.nombre_en }}
                </p>
              </div>
              <NuxtLink
                to="/catalog"
                class="shrink-0 flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors"
              >
                <span class="material-symbols-outlined text-base">arrow_back</span>
                <span class="hidden sm:inline">{{ t('equipment.back') }}</span>
              </NuxtLink>
            </section>

            <!-- Galería -->
            <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">

              <!-- Tabs de galería -->
              <div class="flex gap-1 px-4 pt-4 border-b border-surface-container-low overflow-x-auto no-scrollbar">
                <button
                  v-for="tab in availableTabs"
                  :key="tab.key"
                  class="pb-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors"
                  :class="activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-primary'"
                  @click="selectTab(tab.key)"
                >
                  {{ tab.label }}
                  <span class="ml-1 text-[10px] text-slate-400">({{ tab.images.length }})</span>
                </button>
              </div>

              <!-- Imagen principal -->
              <div class="relative bg-white aspect-video overflow-hidden group mx-4 mt-4 rounded-xl">
                <img
                  v-if="currentTabImages.length && selectedImgIdx < currentTabImages.length"
                  :key="selectedImgIdx"
                  :src="imageUrl(currentTabImages[selectedImgIdx].path)!"
                  :alt="equipmentName"
                  class="w-full h-full object-contain transition-opacity duration-300 cursor-zoom-in"
                  @click="openLightbox(currentTabImages, selectedImgIdx)"
                />
                <!-- Hint zoom -->
                <div
                  v-if="currentTabImages.length"
                  class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                         bg-black/50 rounded-lg px-2 py-1 flex items-center gap-1 pointer-events-none"
                >
                  <span class="material-symbols-outlined text-white text-sm">zoom_in</span>
                </div>
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                  <span class="material-symbols-outlined text-6xl">precision_manufacturing</span>
                  <span class="text-sm">{{ t('equipment.no_image') }}</span>
                </div>
              </div>

              <!-- Miniaturas -->
              <div v-if="currentTabImages.length > 1" class="grid grid-cols-5 gap-2 p-4">
                <button
                  v-for="(img, idx) in currentTabImages.slice(0, 5)"
                  :key="img.id"
                  class="aspect-square rounded-lg overflow-hidden border-2 transition-all"
                  :class="selectedImgIdx === idx
                    ? 'border-primary shadow-sm'
                    : 'border-transparent hover:border-primary/30'"
                  @click="selectedImgIdx = idx"
                >
                  <img
                    :src="imageUrl(img.path)!"
                    :alt="`${equipmentName} ${idx + 1}`"
                    class="w-full h-full object-contain bg-white"
                  />
                </button>
              </div>
              <div v-else class="pb-4" />
            </div>
          </div>

          <!-- ── Columna derecha (5) ─────────────────────────────── -->
          <div class="lg:col-span-5 flex flex-col gap-6">

            <!-- Especificaciones técnicas -->
            <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col">
              <h2 class="text-lg font-headline font-bold text-primary mb-5 pb-3 border-b border-surface-container-low">
                {{ t('equipment.tech_specs') }}
              </h2>

              <div class="space-y-4">
                <!-- Grid 2 col -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('catalog.mfr') }}</p>
                    <p class="text-sm font-semibold text-on-surface">{{ equipment.marca || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('catalog.model') }}</p>
                    <p class="text-sm font-semibold text-on-surface">{{ equipment.modelo || '—' }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('equipment.serial') }}</p>
                    <p class="text-sm font-mono text-on-surface">{{ equipment.numero_serie || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('equipment.year') }}</p>
                    <p class="text-sm font-semibold text-on-surface">{{ equipment.anio_fabricacion || '—' }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('equipment.ranges') }}</p>
                    <p class="text-sm font-semibold text-on-surface">{{ capacidadLabel || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('catalog.capacity') }}</p>
                    <p class="text-sm font-semibold text-on-surface">{{ equipment.unidad_medida || '—' }}</p>
                  </div>
                </div>

                <!-- Disponibilidad: contable -->
                <div v-if="equipment.es_contable">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    {{ t('equipment.available') }}
                  </p>
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      class="rounded-xl px-3 py-2 text-center"
                      :class="disponibleCount > 0 ? 'bg-green-50' : 'bg-slate-50'"
                    >
                      <p class="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                         :class="disponibleCount > 0 ? 'text-green-600' : 'text-slate-400'">
                        {{ t('equipment.qty_available') }}
                      </p>
                      <p class="text-lg font-extrabold"
                         :class="disponibleCount > 0 ? 'text-green-600' : 'text-slate-300'">
                        {{ disponibleCount }}
                      </p>
                    </div>
                    <div class="rounded-xl px-3 py-2 text-center"
                         :class="enCampoCount > 0 ? 'bg-amber-50' : 'bg-slate-50'">
                      <p class="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                         :class="enCampoCount > 0 ? 'text-amber-500' : 'text-slate-400'">
                        {{ t('equipment.in_field') }}
                      </p>
                      <p class="text-lg font-extrabold"
                         :class="enCampoCount > 0 ? 'text-amber-500' : 'text-slate-300'">
                        {{ enCampoCount }}
                      </p>
                    </div>
                  </div>
                  <p class="text-[10px] text-slate-400 text-center mt-1">
                    {{ t('equipment.quantity') }}: {{ equipment.cantidad_total ?? '—' }}
                  </p>
                </div>

                <!-- Disponibilidad: no contable -->
                <div v-else>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {{ t('equipment.available') }}
                  </p>
                  <p
                    class="text-sm font-bold flex items-center gap-1.5"
                    :class="isAvailable ? 'text-green-600' : 'text-red-500'"
                  >
                    <span class="material-symbols-outlined text-base">
                      {{ isAvailable ? 'check_circle' : 'cancel' }}
                    </span>
                    {{ isAvailable ? t('equipment.available') : t('equipment.not_available') }}
                  </p>
                </div>

                <!-- Ubicación actual: no contable -->
                <div v-if="!equipment.es_contable && currentLocation?.project">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('equipment.project') }}</p>
                  <p class="text-sm font-semibold text-primary">{{ currentLocation.project.nombre_proy }}</p>
                  <p class="text-xs text-slate-400">
                    {{ currentLocation.project.ciudad }},
                    {{ currentLocation.project.estado }}
                  </p>
                </div>

                <!-- Descripción -->
                <div v-if="equipmentDesc">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t('equipment.description') }}</p>
                  <p class="text-sm text-on-surface leading-relaxed">{{ equipmentDesc }}</p>
                </div>
              </div>

              <!-- Documentos adjuntos -->
              <div v-if="equipment.adjuntos?.length" class="mt-6">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {{ t('equipment.attachments') }}
                </p>
                <div
                  class="space-y-2"
                  :class="equipment.adjuntos.length > 3 ? 'max-h-[168px] overflow-y-auto pr-1' : ''"
                >
                  <a
                    v-for="doc in equipment.adjuntos"
                    :key="doc.id"
                    :href="`/api/img?path=${encodeURIComponent(doc.path)}`"
                    target="_blank"
                    class="flex items-center justify-between p-3 bg-surface-container-low rounded-xl
                           hover:bg-surface-container transition-colors group"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="material-symbols-outlined text-primary text-xl shrink-0">
                        {{ doc.extension === 'pdf' ? 'picture_as_pdf' : doc.extension?.includes('xls') ? 'table_chart' : 'description' }}
                      </span>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-on-surface truncate">{{ doc.original_name }}</p>
                        <p class="text-[10px] text-slate-400 uppercase">{{ doc.extension }} · {{ fmtSize(doc.size) }}</p>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors shrink-0 text-xl">
                      download
                    </span>
                  </a>
                </div>
              </div>

              <!-- CTA: qty (si es_contable) + botón añadir al carrito -->
              <div class="mt-auto pt-6 flex flex-col gap-3">
                <!-- Feedback -->
                <Transition name="cart-fb">
                  <div
                    v-if="cartFeedback"
                    class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    :class="cartFeedback === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'"
                  >
                    <span class="material-symbols-outlined text-base">
                      {{ cartFeedback === 'success' ? 'check_circle' : 'info' }}
                    </span>
                    {{ cartFeedbackMessage }}
                  </div>
                </Transition>

                <div class="flex items-stretch gap-3">
                  <!-- Qty input (solo si es_contable) -->
                  <div
                    v-if="equipment.es_contable"
                    class="flex items-center rounded-xl border border-slate-200 overflow-hidden shrink-0"
                  >
                    <button
                      class="w-9 flex items-center justify-center text-slate-500
                             hover:bg-slate-100 transition-colors self-stretch disabled:opacity-40"
                      :disabled="requestQty <= 1"
                      @click="requestQty = Math.max(1, requestQty - 1)"
                    >
                      <span class="material-symbols-outlined text-base">remove</span>
                    </button>
                    <input
                      v-model.number="requestQty"
                      type="number"
                      min="1"
                      :max="disponibleCount"
                      class="w-12 text-center text-sm font-bold text-on-surface bg-white
                             focus:outline-none border-x border-slate-200 py-2"
                      @change="requestQty = Math.min(Math.max(1, requestQty), disponibleCount)"
                    />
                    <button
                      class="w-9 flex items-center justify-center text-slate-500
                             hover:bg-slate-100 transition-colors self-stretch disabled:opacity-40"
                      :disabled="requestQty >= disponibleCount"
                      @click="requestQty = Math.min(requestQty + 1, disponibleCount)"
                    >
                      <span class="material-symbols-outlined text-base">add</span>
                    </button>
                  </div>

                  <button
                    class="flex-1 bg-primary text-white py-4 rounded-xl font-headline font-extrabold
                           text-base shadow-lg shadow-primary/20 hover:bg-primary-container transition-all
                           flex items-center justify-center gap-3
                           hover:scale-[1.01] active:scale-[0.99]
                           disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed
                           disabled:shadow-none"
                    :disabled="addingToCart || isCtaDisabled"
                    @click="handleAddToCart"
                  >
                    <span
                      class="material-symbols-outlined"
                      :class="{ 'animate-spin': addingToCart }"
                    >
                      {{ addingToCart ? 'progress_activity' : 'shopping_cart' }}
                    </span>
                    {{ addingToCart ? t('cart.adding') : t('equipment.add_to_cart') }}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── Tablas full-width ──────────────────────────────────── -->
        <div class="space-y-8">

          <!-- Historial de certificaciones -->
          <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div class="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <h3 class="text-base font-headline font-bold text-primary">{{ t('equipment.cert_history') }}</h3>
              <span class="text-xs text-slate-400">{{ certificationHistory.length }} registros</span>
            </div>
            <div v-if="certificationHistory.length" class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-surface-container-low">
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.cert_name') }}</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.cert_from') }}</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.cert_to') }}</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">{{ t('equipment.cert_download') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-low">
                  <tr v-for="cert in certificationHistory" :key="cert.id">
                    <td class="px-6 py-4 text-sm font-semibold text-primary">{{ cert.nombre }}</td>
                    <td class="px-6 py-4 text-sm text-on-surface">{{ fmtDate(cert.fecha_inicio) }}</td>
                    <td class="px-6 py-4 text-sm">
                      <span :class="isCertExpired(cert.fecha_fin) ? 'text-error font-semibold' : 'text-on-surface'">
                        {{ fmtDate(cert.fecha_fin) }}
                        <span v-if="isCertExpired(cert.fecha_fin)" class="text-[10px] ml-1">(vencido)</span>
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <a
                        :href="`/api/img?path=${encodeURIComponent(cert.pdf_path)}`"
                        target="_blank"
                        class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary
                               text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                      >
                        <span class="material-symbols-outlined text-sm">download</span>
                        PDF
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="px-6 py-8 text-center text-sm text-slate-400">
              <span class="material-symbols-outlined text-3xl text-slate-200 block mb-2">workspace_premium</span>
              {{ t('equipment.no_certs') }}
            </div>
          </div>

          <!-- Accesorios -->
          <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div class="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <h3 class="text-base font-headline font-bold text-primary">{{ t('equipment.accessories') }}</h3>
              <span class="text-xs text-slate-400">{{ equipment.accessories?.length ?? 0 }} items</span>
            </div>
            <div v-if="equipment.accessories?.length" class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-surface-container-low">
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase w-16">Img</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Nombre</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Descripción</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">{{ t('catalog.qty') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-low">
                  <tr v-for="acc in equipment.accessories" :key="acc.id">
                    <td class="px-6 py-4">
                      <div class="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-low flex items-center justify-center">
                        <img
                          v-if="acc.images?.[0]"
                          :src="imageUrl(acc.images[0].path)!"
                          :alt="locale === 'es' ? acc.nombre_es : acc.nombre_en"
                          class="w-full h-full object-contain cursor-zoom-in hover:opacity-80 transition-opacity"
                          @click="openLightbox(acc.images, 0)"
                        />
                        <span v-else class="material-symbols-outlined text-slate-300 text-xl">deployed_code</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-primary">
                      {{ locale === 'es' ? acc.nombre_es : acc.nombre_en }}
                    </td>
                    <td class="px-6 py-4 text-sm text-on-surface">{{ acc.descripcion || '—' }}</td>
                    <td class="px-6 py-4 text-right text-sm font-bold text-on-surface">{{ acc.cantidad }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="px-6 py-8 text-center text-sm text-slate-400">
              <span class="material-symbols-outlined text-3xl text-slate-200 block mb-2">deployed_code</span>
              {{ t('equipment.no_accessories') }}
            </div>
          </div>

          <!-- Ubicaciones activas: solo equipos contables -->
          <div v-if="equipment.es_contable && activeLocations.length" class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div class="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <h3 class="text-base font-headline font-bold text-primary">{{ t('equipment.project') }}</h3>
              <span class="text-xs text-slate-400">{{ activeLocations.length }} registros</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-surface-container-low">
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.project') }}</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.worker') }}</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.delivery_date') }}</th>
                    <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">{{ t('catalog.qty') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-low">
                  <tr v-for="loc in activeLocations" :key="loc.id">
                    <td class="px-6 py-4">
                      <p class="text-sm font-semibold" :class="loc.project?.id_itc === 'G1301' ? 'text-green-600' : 'text-amber-500'">
                        {{ loc.project?.nombre_proy ?? '—' }}
                      </p>
                      <span v-if="loc.project" class="text-[11px] text-slate-400">
                        {{ loc.project.ciudad }}, {{ loc.project.estado }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-on-surface">{{ loc.worker?.nombre_trabajador ?? '—' }}</td>
                    <td class="px-6 py-4 text-sm text-on-surface">{{ fmtDate(loc.fecha_entrega) }}</td>
                    <td class="px-6 py-4 text-right text-sm font-bold"
                        :class="loc.project?.id_itc === 'G1301' ? 'text-green-600' : 'text-amber-500'">
                      {{ loc.cantidad ?? 1 }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Historial de ubicaciones (expandible con paginación): solo no contables -->
          <div v-if="!equipment.es_contable && locationHistory.length" class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <!-- Header expandible -->
            <div
              class="px-6 py-4 bg-surface-container-low flex items-center justify-between cursor-pointer
                     hover:bg-surface-container transition-colors"
              @click="locationTableExpanded = !locationTableExpanded"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined transition-transform" :style="{ transform: locationTableExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }">
                  expand_more
                </span>
                <h3 class="text-base font-headline font-bold text-primary">{{ t('equipment.location_history') }}</h3>
              </div>
              <span class="text-xs text-slate-400">{{ locationHistory.length }} registros</span>
            </div>

            <!-- Contenido expandible -->
            <template v-if="locationTableExpanded">
              <!-- Tabla -->
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="border-b border-surface-container-low">
                      <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.project') }}</th>
                      <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.worker') }}</th>
                      <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.delivery_date') }}</th>
                      <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.return_date') }}</th>
                      <th class="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">{{ t('equipment.condition_in') }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-surface-container-low">
                    <tr v-for="loc in paginatedLocations" :key="loc.id">
                      <td class="px-6 py-4 text-sm font-semibold text-primary">
                        {{ loc.project?.nombre_proy ?? '—' }}
                        <span v-if="loc.project" class="block text-[11px] text-slate-400 font-normal">
                          {{ loc.project.ciudad }}, {{ loc.project.estado }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-on-surface">{{ loc.worker?.nombre_trabajador ?? '—' }}</td>
                      <td class="px-6 py-4 text-sm text-on-surface">{{ fmtDate(loc.fecha_entrega) }}</td>
                      <td class="px-6 py-4 text-sm text-on-surface">
                        <span v-if="loc.fecha_devolucion">{{ fmtDate(loc.fecha_devolucion) }}</span>
                        <span v-else class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                          En uso
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-on-surface">{{ loc.condicion_entrega || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Paginación -->
              <div class="px-6 py-4 border-t border-surface-container-low flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-400">{{ t('catalog.qty_per_page') }}:</span>
                  <select
                    v-model.number="locationPageSize"
                    class="px-2 py-1 text-sm rounded-lg border border-slate-200 bg-white text-on-surface
                           hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option v-for="size in locationPageSizes" :key="size" :value="size">
                      {{ size }}
                    </option>
                  </select>
                </div>

                <span class="text-xs text-slate-400">
                  Mostrando {{ (locationCurrentPage - 1) * locationPageSize + 1 }}–{{ Math.min(locationCurrentPage * locationPageSize, locationHistory.length) }}
                  de {{ locationHistory.length }} · Página {{ locationCurrentPage }} de {{ locationTotalPages }}
                </span>

                <div class="flex items-center gap-1">
                  <button
                    :disabled="locationCurrentPage === 1"
                    @click="locationCurrentPage = 1"
                    class="p-1 rounded-lg hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed
                           text-slate-600 hover:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">first_page</span>
                  </button>
                  <button
                    :disabled="locationCurrentPage === 1"
                    @click="locationCurrentPage--"
                    class="p-1 rounded-lg hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed
                           text-slate-600 hover:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">chevron_left</span>
                  </button>

                  <div class="flex items-center gap-0.5 px-2">
                    <button
                      v-for="page in locationTotalPages"
                      :key="page"
                      :class="locationCurrentPage === page
                        ? 'bg-primary text-white'
                        : 'text-slate-600 hover:bg-surface-container'"
                      class="w-8 h-8 rounded-lg text-xs font-bold transition-colors"
                      @click="locationCurrentPage = page"
                    >
                      {{ page }}
                    </button>
                  </div>

                  <button
                    :disabled="locationCurrentPage === locationTotalPages"
                    @click="locationCurrentPage++"
                    class="p-1 rounded-lg hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed
                           text-slate-600 hover:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                  <button
                    :disabled="locationCurrentPage === locationTotalPages"
                    @click="locationCurrentPage = locationTotalPages"
                    class="p-1 rounded-lg hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed
                           text-slate-600 hover:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-lg">last_page</span>
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- Videos -->
          <div v-if="equipment.videos?.length" class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div class="px-6 py-4 bg-surface-container-low flex items-center justify-between">
              <h3 class="text-base font-headline font-bold text-primary">{{ t('equipment.videos') }}</h3>
              <span class="text-xs text-slate-400">{{ equipment.videos.length }} {{ equipment.videos.length === 1 ? t('equipment.video_single') : t('equipment.video_plural') }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              <div
                v-for="video in equipment.videos"
                :key="video.id"
                class="flex flex-col gap-2"
              >
                <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900">

                  <!-- Iframe activo (tras clic) -->
                  <iframe
                    v-if="playingVideos.has(video.id)"
                    :src="`https://www.youtube.com/embed/${youtubeId(video.url)}?autoplay=1&rel=0&color=white`"
                    :title="video.titulo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    class="w-full h-full border-0"
                  />

                  <!-- Thumbnail + overlay + botón play -->
                  <template v-else-if="youtubeId(video.url)">
                    <img
                      :src="`https://img.youtube.com/vi/${youtubeId(video.url)}/maxresdefault.jpg`"
                      :alt="video.titulo"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute inset-0 bg-slate-900/40 flex items-center justify-center
                             cursor-pointer group hover:bg-slate-900/30 transition-colors"
                      @click="activateVideo(video.id)"
                    >
                      <div
                        class="w-16 h-16 rounded-full bg-primary flex items-center justify-center
                               shadow-xl shadow-primary/40 group-hover:scale-110 group-hover:shadow-primary/60
                               transition-all duration-200"
                      >
                        <span class="material-symbols-outlined text-white text-3xl ml-1">play_arrow</span>
                      </div>
                    </div>
                  </template>

                  <!-- URL no compatible -->
                  <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                    <span class="material-symbols-outlined text-4xl">videocam_off</span>
                    <span class="text-xs">URL no compatible</span>
                  </div>
                </div>
                <p class="text-sm font-semibold text-on-surface capitalize px-1">{{ video.titulo }}</p>
              </div>
            </div>
          </div>

        </div>
      </template>
    </main>
  </div>

  <!-- ── Lightbox ────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
        @click.self="closeLightbox"
        @keydown.esc="closeLightbox"
      >
        <!-- Close -->
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                 flex items-center justify-center text-white transition-colors z-10"
          @click="closeLightbox"
        >
          <span class="material-symbols-outlined">close</span>
        </button>

        <!-- Counter -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono">
          {{ lightboxIdx + 1 }} / {{ lightboxImages.length }}
        </div>

        <!-- Prev -->
        <button
          v-if="lightboxImages.length > 1"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10
                 hover:bg-white/25 flex items-center justify-center text-white transition-colors
                 disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="lightboxIdx === 0"
          @click="lightboxIdx--"
        >
          <span class="material-symbols-outlined text-3xl">chevron_left</span>
        </button>

        <!-- Image -->
        <div class="max-w-[90vw] max-h-[85vh] flex items-center justify-center px-16">
          <img
            :key="lightboxIdx"
            :src="imageUrl(lightboxImages[lightboxIdx]?.path)!"
            class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
            draggable="false"
          />
        </div>

        <!-- Next -->
        <button
          v-if="lightboxImages.length > 1"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10
                 hover:bg-white/25 flex items-center justify-center text-white transition-colors
                 disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="lightboxIdx === lightboxImages.length - 1"
          @click="lightboxIdx++"
        >
          <span class="material-symbols-outlined text-3xl">chevron_right</span>
        </button>

        <!-- Thumbnail strip (si hay más de 1) -->
        <div
          v-if="lightboxImages.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2"
        >
          <button
            v-for="(img, i) in lightboxImages"
            :key="img.id"
            class="w-12 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-all"
            :class="lightboxIdx === i ? 'border-white' : 'border-white/20 hover:border-white/50'"
            @click="lightboxIdx = i"
          >
            <img :src="imageUrl(img.path)!" class="w-full h-full object-contain bg-white/10" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

// ── Tipos ──────────────────────────────────────────────────────────
interface Category {
  id: number; id_padre: number | null; codigo: string
  nombre_es: string; nombre_en: string; nodo: number
}

interface EquipmentImage {
  id: number; path: string; disk: string; type: string
  filename?: string; mime_type?: string
}

interface Accessory {
  id: number; nombre_es: string; nombre_en: string
  descripcion: string; cantidad: number
  images: EquipmentImage[]
}

interface Video {
  id: number; titulo: string; url: string; tipo: string
  created_at: string; deleted_at: string | null
}

interface Adjunto {
  id: number; path: string; original_name: string
  mime: string; extension: string; size: string; created_at: string
}

interface CertHistory {
  id: number; nombre: string
  fecha_inicio: string; fecha_fin: string; pdf_path: string
}

interface LocationEntry {
  id: number; fecha_entrega: string; fecha_devolucion: string | null
  cantidad: number | null
  condicion_entrega: string; condicion_regreso: string | null
  project: { id: number; nombre_proy: string; ciudad: string; estado: string; pais: string; id_itc?: string } | null
  worker: { id: number; nombre_trabajador: string } | null
}

interface Equipment {
  id: number; codigo: string
  nombre_es: string; nombre_en: string
  descripcion_es: string; descripcion_en: string
  marca: string; modelo: string; numero_serie: string; anio_fabricacion: number
  capacidad_rango: Record<string, { valor: string | number; codigo?: string; unidad?: string }> | string | null
  unidad_medida: string; status: string; es_contable: boolean; cantidad_total: number | null
  inventario?: number | null; disponible?: number | null; en_campo?: number | null
  category: Category & { parent?: Category } | null
  cover_image: EquipmentImage | null
  images: EquipmentImage[]
  accessories: Accessory[]
  adjuntos: Adjunto[]
  videos: Video[]
}

const { t, locale } = useI18n({ useScope: 'global' })
const route     = useRoute()
const router    = useRouter()
const auth      = useAuthStore()
const cartStore = useCartStore()
const authModal = useAuthModal()
const { apiFetch } = useApi()
const { imageUrl } = useImageUrl()

// ── Carrito ─────────────────────────────────────────────────────────
const requestQty        = ref(1)
const addingToCart      = ref(false)
const cartFeedback      = ref<'success' | 'warn' | null>(null)
const cartFeedbackMessage = ref('')
let cartFeedbackTimer: ReturnType<typeof setTimeout> | null = null

async function handleAddToCart() {
  if (!auth.isAuthenticated) {
    authModal.open('login')
    return
  }
  if (!equipment.value) return

  addingToCart.value = true
  const qty = equipment.value.es_contable
    ? Math.min(requestQty.value, disponibleCount.value)
    : undefined
  const result = await cartStore.addItem(equipment.value.id, qty)
  addingToCart.value = false

  if (result.success) {
    cartFeedback.value        = 'success'
    cartFeedbackMessage.value = t('cart.add_success')
  } else {
    cartFeedback.value        = 'warn'
    cartFeedbackMessage.value = result.message ?? t('cart.already_in_cart')
    // Si hay stock insuficiente, ajustar qty al disponible
    if ('disponible' in result && result.disponible !== undefined) {
      requestQty.value = result.disponible
    }
  }

  if (cartFeedbackTimer) clearTimeout(cartFeedbackTimer)
  cartFeedbackTimer = setTimeout(() => { cartFeedback.value = null }, 3000)
}

const id = computed(() => route.params.id as string)

// ── Categorías (cache global, no re-fetch) ─────────────────────────
const { categories: allCategories, fetchIfNeeded: fetchCategories } = useCategories()
await fetchCategories()

// ── Fetch equipo detalle ──────────────────────────────────────────
const { data: equipment, pending, error } = useAsyncData<Equipment>(
  `equipment-${id.value}`,
  () => apiFetch<Equipment>(`/eqm/equipment/${id.value}`, 'public'),
)

// ── Fetch historial de ubicaciones ────────────────────────────────
interface LocationResponse {
  data: LocationEntry[]
}
const { data: locationsData } = useAsyncData<LocationResponse>(
  `locations-${id.value}`,
  () => apiFetch<LocationResponse>(`/eqm/locations`, 'public', {
    params: { equipment_id: id.value },
  }),
)
const locationHistory = computed(() => locationsData.value?.data ?? [])

// Ubicaciones activas = sin fecha de devolución
const activeLocations = computed(() =>
  locationHistory.value.filter(l => !l.fecha_devolucion),
)

// Para no-contable: ubicación activa o última registrada (display en specs)
const currentLocation = computed(() => {
  return activeLocations.value[0]
    ?? locationHistory.value[locationHistory.value.length - 1]
    ?? null
})

// Unidades en oficina — usa campo API si está disponible, sino calcula desde historial
const disponibleCount = computed(() => {
  if (equipment.value?.disponible !== undefined && equipment.value?.disponible !== null) {
    return equipment.value.disponible
  }
  // fallback: calcular desde locationHistory (puede diferir si el endpoint pagina)
  if (!equipment.value?.es_contable) {
    return activeLocations.value.some(l => l.project?.id_itc === 'G1301') ? 1 : 0
  }
  return activeLocations.value
    .filter(l => l.project?.id_itc === 'G1301')
    .reduce((s, l) => s + (l.cantidad ?? 1), 0)
})

// Unidades en campo — usa campo API si está disponible, sino calcula desde historial
const enCampoCount = computed(() => {
  if (equipment.value?.en_campo !== undefined && equipment.value?.en_campo !== null) {
    return equipment.value.en_campo
  }
  // fallback
  if (!equipment.value?.es_contable) {
    return activeLocations.value.some(l => l.project?.id_itc !== 'G1301') ? 1 : 0
  }
  return activeLocations.value
    .filter(l => l.project?.id_itc !== 'G1301')
    .reduce((s, l) => s + (l.cantidad ?? 1), 0)
})

const isAvailable = computed(() => disponibleCount.value > 0)

// CTA deshabilitado si no hay unidades disponibles en oficina
const isCtaDisabled = computed(() => disponibleCount.value === 0)

// ── Fetch historial de certificaciones ────────────────────────────
interface CertResponse {
  data: CertHistory[]
}
const { data: certsData } = useAsyncData<CertResponse>(
  `certifications-${id.value}`,
  () => apiFetch<CertResponse>(`/eqm/certifications`, 'public', {
    params: { equipment_id: id.value },
  }),
)
const certificationHistory = computed(() => certsData.value?.data ?? [])

// ── Computadas básicas ─────────────────────────────────────────────
const equipmentName = computed(() =>
  !equipment.value ? '' :
  locale.value === 'es' ? equipment.value.nombre_es : equipment.value.nombre_en,
)

const equipmentDesc = computed(() => {
  const e = equipment.value
  if (!e) return ''
  return locale.value === 'es' ? e.descripcion_es : e.descripcion_en
})

const capacidadLabel = computed(() => {
  const cr = equipment.value?.capacidad_rango
  if (!cr) return null
  let parsed: Record<string, any>
  try { parsed = typeof cr === 'string' ? JSON.parse(cr) : cr }
  catch { return null }
  const unit = equipment.value?.unidad_medida ?? ''
  const vals = Object.values(parsed)
    .map((r: any) => r.valor ?? r.value)
    .filter(Boolean)
  if (!vals.length) return null
  return vals.join(' ~ ') + (unit ? ` ${unit}` : '')
})

// ── Estado badge ───────────────────────────────────────────────────
const STATUS_MAP: Record<string, string> = {
  'Nuevo':           'bg-green-100 text-green-700 ring-green-200',
  'Bueno':           'bg-green-100 text-green-700 ring-green-200',
  'Activo':          'bg-green-100 text-green-700 ring-green-200',
  'Usado':           'bg-slate-100 text-slate-600 ring-slate-200',
  'Regular':         'bg-slate-100 text-slate-600 ring-slate-200',
  'En Reparación':   'bg-orange-100 text-orange-700 ring-orange-200',
  'Reparación':      'bg-orange-100 text-orange-700 ring-orange-200',
  'Dañado':          'bg-red-100 text-red-700 ring-red-200',
  'Descompuesto':    'bg-red-100 text-red-700 ring-red-200',
  'Reacondicionado': 'bg-purple-100 text-purple-700 ring-purple-200',
  'Reservado':       'bg-amber-100 text-amber-700 ring-amber-200',
  'Prestado':        'bg-blue-100 text-blue-700 ring-blue-200',
}
const statusClass = computed(() =>
  STATUS_MAP[equipment.value?.status ?? ''] ?? 'bg-slate-100 text-slate-600 ring-slate-200',
)

// ── Galería ────────────────────────────────────────────────────────
const GALLERY_TABS = [
  { key: 'main',        labelKey: 'equipment.gallery_main',  types: ['equipment_cover', 'equipment'] },
  { key: 'maintenance', labelKey: 'equipment.gallery_maint', types: ['maintenance'] },
  { key: 'status',      labelKey: 'equipment.gallery_status',types: ['current_status'] },
  { key: 'accessories', labelKey: 'equipment.gallery_acc',   types: ['accessory'] },
]

const allImages = computed(() => equipment.value?.images ?? [])
const allAccImages = computed(() =>
  (equipment.value?.accessories ?? []).flatMap(a => a.images ?? []),
)

const availableTabs = computed(() =>
  GALLERY_TABS
    .map(tab => ({
      ...tab,
      label: t(tab.labelKey),
      images: tab.key === 'accessories'
        ? allAccImages.value
        : allImages.value.filter(img => tab.types.includes(img.type)),
    }))
    .filter(tab => tab.images.length > 0),
)

const activeTab = ref('main')
const selectedImgIdx = ref(0)

watch(availableTabs, (tabs) => {
  if (tabs.length && !tabs.find(t => t.key === activeTab.value)) {
    activeTab.value = tabs[0].key
  }
}, { immediate: true })

const currentTabImages = computed(() =>
  availableTabs.value.find(t => t.key === activeTab.value)?.images ?? [],
)

function selectTab(key: string) {
  activeTab.value = key
  selectedImgIdx.value = 0
}

// ── Navegación sidebar ─────────────────────────────────────────────
function onCategorySelect(id: number | null) {
  const q: Record<string, string | number> = { page: 1 }
  if (id !== null) q.category = id
  router.push({ path: '/catalog', query: q })
}

// ── Utilidades fecha ───────────────────────────────────────────────
function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(locale.value === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric', month: 'short', day: '2-digit',
  })
}

function isCertExpired(fechaFin: string): boolean {
  return new Date(fechaFin) < new Date()
}

// ── Paginación de historial de ubicaciones ────────────────────────
const locationPageSize = ref(5)
const locationCurrentPage = ref(1)
const locationPageSizes = [5, 10, 25, 50]

const paginatedLocations = computed(() => {
  const start = (locationCurrentPage.value - 1) * locationPageSize.value
  const end = start + locationPageSize.value
  return locationHistory.value.slice(start, end)
})

const locationTotalPages = computed(() =>
  Math.ceil(locationHistory.value.length / locationPageSize.value),
)

const locationTableExpanded = ref(true)

// Reset página cuando cambia el tamaño
watch(locationPageSize, () => {
  locationCurrentPage.value = 1
})

// ── Lightbox ───────────────────────────────────────────────────────
const lightboxOpen   = ref(false)
const lightboxImages = ref<EquipmentImage[]>([])
const lightboxIdx    = ref(0)

function openLightbox(images: EquipmentImage[], idx: number) {
  if (!images.length) return
  lightboxImages.value = images
  lightboxIdx.value    = idx
  lightboxOpen.value   = true
}
function closeLightbox() { lightboxOpen.value = false }

function onKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape')      closeLightbox()
  if (e.key === 'ArrowRight')  lightboxIdx.value = Math.min(lightboxIdx.value + 1, lightboxImages.value.length - 1)
  if (e.key === 'ArrowLeft')   lightboxIdx.value = Math.max(lightboxIdx.value - 1, 0)
}

onMounted(()   => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

// ── Videos ────────────────────────────────────────────────────────
const playingVideos = ref<Set<number>>(new Set())

function activateVideo(id: number) {
  playingVideos.value = new Set([...playingVideos.value, id])
}

function youtubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?\s/]+)/)
  return m ? m[1] : null
}

function fmtSize(bytes: string | number): string {
  const b = Number(bytes)
  if (isNaN(b)) return ''
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

// useHead al final — equipment ya declarado, sin TDZ
useHead({
  title: () => {
    const e = equipment.value
    if (!e) return 'Intime Control'
    return `${locale.value === 'es' ? e.nombre_es : e.nombre_en} — Intime Control`
  },
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.cart-fb-enter-active, .cart-fb-leave-active { transition: opacity .25s, transform .25s; }
.cart-fb-enter-from, .cart-fb-leave-to { opacity: 0; transform: translateY(-6px); }

.lb-enter-active, .lb-leave-active { transition: opacity .2s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }
</style>
