import { ref, watch } from 'vue'

const STORAGE_KEY = 'mercapp_recent'
const MAX = 5

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
    recent.value = list.slice(0, MAX)
  }

  return { recentlyViewed: recent, track }
}
