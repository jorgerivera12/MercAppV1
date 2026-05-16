import { ref } from 'vue'
import { api } from '@/api/index.js'

const categories = ref([])
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
