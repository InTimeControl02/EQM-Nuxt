// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],

  // Variables de entorno expuestas al cliente (prefijo NUXT_PUBLIC_)
  runtimeConfig: {
    // Solo disponibles en el servidor
    apiPrivateToken: process.env.API_PRIVATE_TOKEN,
    // Disponibles también en el cliente
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000/api/v1',
      apiPublicToken: process.env.NUXT_PUBLIC_API_PUBLIC_TOKEN ?? '',
    },
  },

  // Google Fonts
  googleFonts: {
    families: {
      Manrope: [400, 600, 700, 800],
      Inter: [400, 500, 600],
    },
    display: 'swap',
    preload: true,
  },

  // i18n
  i18n: {
    locales: [
      { code: 'es', language: 'es-MX', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'es',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'itc_locale',
      fallbackLocale: 'es',
    },
  },

  // CSS global
  css: ['~/assets/css/main.css'],

  // App head
  app: {
    head: {
      title: 'Intime Control',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Catálogo de equipos de instrumentación industrial.' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        },
      ],
    },
  },

  compatibilityDate: '2024-09-16',
})
