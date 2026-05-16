<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  },
  categoryName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['added-to-cart'])
</script>

<template>
  <article class="card">
    <!-- Badge de stock -->
    <span v-if="product.stock > 0 && product.stock <= 5" class="card__badge card__badge--low">
      ¡Últimas unidades!
    </span>
    <span v-else-if="product.stock === 0" class="card__badge card__badge--out">
      Agotado
    </span>

    <!-- Imagen -->
    <RouterLink :to="`/product/${product.id}`" class="card__img-wrap">
      <img
        :src="product.imageUrl || 'https://placehold.co/400x300?text=Sin+imagen'"
        :alt="product.name"
        class="card__img"
      />
    </RouterLink>

    <!-- Cuerpo -->
    <div class="card__body">
      <p v-if="categoryName" class="card__category">{{ categoryName }}</p>
      <RouterLink :to="`/product/${product.id}`" class="card__name">
        {{ product.name }}
      </RouterLink>
    </div>

    <!-- Footer: precio + botón -->
    <div class="card__footer">
      <p class="card__price-row">
        <span class="card__price-label">Oferta:</span>
        <span class="card__price">${{ product.price.toFixed(2) }}</span>
      </p>

      <button
        class="card__btn"
        :disabled="product.stock === 0"
        @click="emit('added-to-cart', product)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        {{ product.stock > 0 ? 'Agregar' : 'Sin stock' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}

/* Badge */
.card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 3px 10px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card__badge--low {
  background: #ff6f00;
  color: #fff;
}

.card__badge--out {
  background: #757575;
  color: #fff;
}

/* Imagen */
.card__img-wrap {
  display: block;
  overflow: hidden;
  background: #fafafa;
}

.card__img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card__img {
  transform: scale(1.04);
}

/* Cuerpo */
.card__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 14px 10px;
  flex: 1;
}

.card__category {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
}

.card__name {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.4;
  transition: color 0.15s;
}

.card__name:hover {
  color: var(--color-primary);
}

/* Footer */
.card__footer {
  padding: 12px 14px 14px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card__price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.card__price-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.card__price {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text);
}

/* Botón pill */
.card__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 10px 14px;
  font-size: 0.875rem;
  font-weight: 700;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  letter-spacing: 0.02em;
}

.card__btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: scale(1.02);
}

.card__btn:disabled {
  background: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
}
</style>
