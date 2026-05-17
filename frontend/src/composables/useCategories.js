import { ref } from 'vue'
import { api } from '@/api/index.js'

// Estado en scope de módulo: la lista de categorías se comparte entre todos los consumidores
const categories = ref([])
// fetchPromise evita peticiones simultáneas si varios componentes llaman a load() al mismo tiempo
let fetchPromise = null

export function useCategories() {
  function load() {
    if (categories.value.length) return
    if (!fetchPromise) {
      fetchPromise = api.categories.list().then(cats => {
        categories.value = cats
      }).catch(() => {
        fetchPromise = null
      })
    }
  }
  return { categories, load }
}
