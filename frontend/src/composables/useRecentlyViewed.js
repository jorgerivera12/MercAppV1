import { ref, watch } from 'vue'

const STORAGE_KEY = 'mercapp_recent'
const MAX = 5

// Singleton en scope de módulo: el historial persiste aunque el componente que lo usa se desmonte
const recent = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

watch(recent, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useRecentlyViewed() {
  function track(product) {
    const list = recent.value.filter(p => p.id !== product.id)
    list.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    })
    // slice garantiza que la lista no supere MAX elementos conservando los más recientes
    recent.value = list.slice(0, MAX)
  }

  return { recentlyViewed: recent, track }
}
