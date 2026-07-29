/**
 * Guard para la font de iconos (Material Symbols).
 *
 * Los iconos son ligaduras: el nombre ("shopping_cart") está literal en el
 * DOM y la font lo convierte en glifo. Si la font no llega, el navegador cae
 * a su font default y el usuario ve la palabra. `font-display: block` cubre
 * los primeros 3s con un hueco invisible, pero pasado ese punto el texto
 * crudo aparece igual.
 *
 * Esto detecta el fallo y marca <html class="ms-font-failed">, que en
 * assets/css/main.css colapsa cada icono a un placeholder cuadrado neutro.
 */
const FONT = "400 24px 'Material Symbols Outlined'"
const TIMEOUT_MS = 5000

export default defineNuxtPlugin(() => {
  // Navegador sin CSS Font Loading API: no podemos saberlo, no intervenimos.
  if (!document.fonts?.load) return

  const root = document.documentElement
  let settled = false

  const finish = (ok: boolean) => {
    if (settled) return
    settled = true
    root.classList.add(ok ? 'ms-font-ready' : 'ms-font-failed')
  }

  // `block` bloquea el render 3s; damos margen antes de declarar el fallo.
  const timer = setTimeout(() => finish(false), TIMEOUT_MS)

  document.fonts
    .load(FONT, 'search')
    .then((faces) => {
      clearTimeout(timer)
      finish(faces.length > 0 && document.fonts.check(FONT))
    })
    .catch(() => {
      clearTimeout(timer)
      finish(false)
    })
})
