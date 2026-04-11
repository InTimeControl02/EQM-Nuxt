/**
 * composables/useScrollReveal.ts
 *
 * Observa elementos con clase `.reveal` usando el VIEWPORT como root.
 * Cuando un elemento entra al viewport se le agrega `.revealed`,
 * disparando la transición CSS.
 */
export function useScrollReveal() {
  if (import.meta.server) return

  onMounted(() => {
    // Pequeño delay para asegurar que todos los componentes async están montados
    setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)')
      if (!elements.length) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              observer.unobserve(entry.target)
            }
          })
        },
        {
          root: null,
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        },
      )

      elements.forEach((el) => observer.observe(el))
    }, 100)
  })
}
