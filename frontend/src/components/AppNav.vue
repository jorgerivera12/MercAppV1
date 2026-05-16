<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart.js'
import { useCategories } from '@/composables/useCategories.js'

const { itemCount } = useCart()
const { categories, load: loadCategories } = useCategories()
const router = useRouter()
const route = useRoute()

const searchQ = ref('')
watch(() => route.query.q, (val) => { searchQ.value = val ?? '' }, { immediate: true })

function submitSearch() {
  const query = { ...route.query }
  if (searchQ.value.trim()) {
    query.q = searchQ.value.trim()
  } else {
    delete query.q
  }
  router.push({ path: '/', query })
}

// Typewriter en topbar
const typeMessages = [
  '¡Envíos a todo el país! Compra en línea con total seguridad.',
  'Pago seguro y garantizado en todas tus compras.',
  'Devoluciones fáciles dentro de los 30 días.',
  'Más de 1,000 productos disponibles para ti.',
]
const displayText = ref('')
let msgIndex = 0
let charIndex = 0
let isDeleting = false
let typeTimer = null

function runTypewriter() {
  const current = typeMessages[msgIndex]

  if (!isDeleting) {
    displayText.value = current.substring(0, charIndex + 1)
    charIndex++
    if (charIndex === current.length) {
      typeTimer = setTimeout(() => { isDeleting = true; runTypewriter() }, 2800)
      return
    }
  } else {
    displayText.value = current.substring(0, charIndex - 1)
    charIndex--
    if (charIndex === 0) {
      isDeleting = false
      msgIndex = (msgIndex + 1) % typeMessages.length
    }
  }

  typeTimer = setTimeout(runTypewriter, isDeleting ? 28 : 58)
}

// Dark mode
const dark = ref(false)

onMounted(() => {
  if (localStorage.getItem('mercapp_theme') === 'dark') {
    dark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  runTypewriter()
  loadCategories()
})

onUnmounted(() => clearTimeout(typeTimer))

function toggleDark() {
  dark.value = !dark.value
  if (dark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('mercapp_theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('mercapp_theme', 'light')
  }
}
</script>

<template>
  <!-- Barra superior con efecto typewriter -->
  <div class="topbar">
    <span class="topbar__text">{{ displayText }}<span class="topbar__cursor">|</span></span>
  </div>

  <!-- Navegación principal -->
  <nav class="app-nav">
    <div class="app-nav__inner">
      <RouterLink to="/" class="app-nav__brand">
        <span class="app-nav__brand-icon">M</span>
        <span class="app-nav__brand-name">MercApp</span>
      </RouterLink>

      <form class="app-nav__search" @submit.prevent="submitSearch">
        <input
          v-model="searchQ"
          type="search"
          placeholder="Buscar productos..."
          class="app-nav__search-input"
        />
        <button type="submit" class="app-nav__search-btn" aria-label="Buscar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </form>

      <div class="app-nav__actions">
        <RouterLink to="/about" class="app-nav__link">Acerca de</RouterLink>

        <button class="app-nav__theme-btn" @click="toggleDark" :title="dark ? 'Modo claro' : 'Modo oscuro'">
          <!-- Sol (modo oscuro activo) -->
          <svg v-if="dark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Luna (modo claro activo) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <RouterLink to="/cart" class="app-nav__cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="app-nav__cart-label">Carrito</span>
          <span v-if="itemCount" class="app-nav__badge">{{ itemCount }}</span>
        </RouterLink>
      </div>
    </div>
  </nav>

  <!-- Barra de categorías -->
  <div class="cat-bar">
    <div class="cat-bar__inner">
      <RouterLink
        v-for="cat in categories"
        :key="cat.id"
        :to="{ path: '/', query: { categoryId: cat.id } }"
        class="cat-bar__link"
      >{{ cat.name }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Barra superior */
.topbar {
  background: var(--color-primary);
  color: #fff;
  text-align: center;
  padding: 7px 16px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  min-height: 30px;
}

.topbar__cursor {
  display: inline-block;
  margin-left: 1px;
  font-weight: 300;
  animation: blink 0.75s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Navbar principal */
.app-nav {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.app-nav__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* Brand / Logo */
.app-nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.app-nav__brand-icon {
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
}

.app-nav__brand-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

/* Buscador */
.app-nav__search {
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 520px;
  border: 2px solid var(--color-border);
  border-radius: 999px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.app-nav__search:focus-within {
  border-color: var(--color-primary);
}

.app-nav__search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 16px;
  font-size: 0.9rem;
  background: transparent;
  color: var(--color-text);
}

.app-nav__search-input::placeholder {
  color: var(--color-text-muted);
}

.app-nav__search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.app-nav__search-btn:hover {
  background: var(--color-primary-dark);
}

/* Acciones (derecha) */
.app-nav__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Toggle de modo oscuro */
.app-nav__theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.app-nav__theme-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.app-nav__link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  padding: 6px 10px;
  border-radius: var(--radius);
  transition: color 0.15s;
}

.app-nav__link:hover,
.app-nav__link.router-link-active {
  color: var(--color-primary);
}

/* Carrito */
.app-nav__cart {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 700;
  transition: background 0.15s;
  flex-shrink: 0;
}

.app-nav__cart:hover {
  background: var(--color-primary-dark);
}

.app-nav__cart-label {
  display: none;
}

@media (min-width: 560px) {
  .app-nav__cart-label {
    display: inline;
  }
}

.app-nav__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #fff;
  color: var(--color-primary);
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--color-primary);
}

/* Responsive mobile */
@media (max-width: 639px) {
  .app-nav__brand { flex: 1; }

  .app-nav__link { display: none; }

  .app-nav__search {
    flex-basis: 100%;
    max-width: 100%;
    order: 3;
    margin-bottom: 4px;
  }
}

/* Barra de categorías */
.cat-bar {
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-primary);
  position: sticky;
  top: 68px;
  z-index: 99;
}

@media (max-width: 639px) {
  .cat-bar {
    position: relative;
    top: auto;
  }
}

.cat-bar__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.cat-bar__inner::-webkit-scrollbar {
  display: none;
}

.cat-bar__link {
  padding: 10px 18px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted);
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
}

.cat-bar__link:hover,
.cat-bar__link.router-link-active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  font-weight: 700;
}
</style>
