import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './error.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Colores del sistema de diseño ────────────────────────────
      colors: {
        // Primarios
        'primary':                   '#002459',
        'on-primary':                '#ffffff',
        'primary-container':         '#183a76',
        'on-primary-container':      '#89a6e9',
        'primary-fixed':             '#d9e2ff',
        'primary-fixed-dim':         '#afc6ff',
        'on-primary-fixed':          '#001a43',
        'on-primary-fixed-variant':  '#254582',
        'inverse-primary':           '#afc6ff',

        // Secundarios
        'secondary':                 '#466270',
        'on-secondary':              '#ffffff',
        'secondary-container':       '#c6e4f4',
        'on-secondary-container':    '#4a6774',
        'secondary-fixed':           '#c9e7f7',
        'secondary-fixed-dim':       '#adcbda',
        'on-secondary-fixed':        '#001f2a',
        'on-secondary-fixed-variant':'#2e4b57',

        // Terciarios
        'tertiary':                  '#560005',
        'on-tertiary':               '#ffffff',
        'tertiary-container':        '#7f000c',
        'on-tertiary-container':     '#ff8278',
        'tertiary-fixed':            '#ffdad6',
        'tertiary-fixed-dim':        '#ffb3ac',
        'on-tertiary-fixed':         '#410003',
        'on-tertiary-fixed-variant': '#930010',

        // Superficie / Fondo
        'background':                '#f3faff',
        'on-background':             '#071e27',
        'surface':                   '#f3faff',
        'surface-dim':               '#c7dde9',
        'surface-bright':            '#f3faff',
        'surface-variant':           '#cfe6f2',
        'on-surface':                '#071e27',
        'on-surface-variant':        '#43474c',
        'inverse-surface':           '#1e333c',
        'inverse-on-surface':        '#dff4ff',
        'surface-tint':              '#3f5d9b',

        // Contenedores de superficie
        'surface-container-lowest':  '#ffffff',
        'surface-container-low':     '#e6f6ff',
        'surface-container':         '#dbf1fe',
        'surface-container-high':    '#d5ecf8',
        'surface-container-highest': '#cfe6f2',

        // Outline
        'outline':                   '#74777d',
        'outline-variant':           '#c4c6cd',

        // Error
        'error':                     '#ba1a1a',
        'on-error':                  '#ffffff',
        'error-container':           '#ffdad6',
        'on-error-container':        '#93000a',
      },

      // ── Tipografías ───────────────────────────────────────────────
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        label:    ['Inter', 'sans-serif'],
      },

      // ── Border radius ─────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        '2xl':   '1rem',
        '3xl':   '1.5rem',
        full:    '0.75rem',
      },

      // ── Animaciones ───────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':      'fade-up 0.5s ease-out forwards',
        'fade-up-slow': 'fade-up 0.7s ease-out forwards',
        'fade-in':      'fade-in 0.4s ease-out forwards',
        'fade-in-up':   'fade-in-up 0.5s ease-out forwards',
      },

      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
} satisfies Config
