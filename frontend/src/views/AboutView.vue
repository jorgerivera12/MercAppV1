<template>
  <main class="about">

    <section class="about__hero">
      <div class="about__hero-inner">
        <h1 class="about__title">Acerca de MercApp</h1>
        <p class="about__lead">
          MercApp es una plataforma de comercio electrónico diseñada para facilitar la búsqueda,
          exploración y compra de productos de diferentes categorías en un solo lugar.
          Nuestro objetivo es brindar una experiencia rápida, segura e intuitiva, permitiendo
          a los usuarios descubrir productos, agregarlos al carrito y realizar sus compras
          de manera sencilla.
        </p>
        <p class="about__lead">
          Ofrecemos una amplia variedad de categorías — tecnología, ropa, hogar, deportes y libros —
          con una interfaz moderna y accesible orientada a mejorar la experiencia de cada cliente.
        </p>
      </div>
    </section>

    <section class="about__pillars">
      <div class="about__pillars-inner">

        <div class="about__pillar">
          <h2 class="about__pillar-title">Misión</h2>
          <p class="about__pillar-text">
            Ofrecer una plataforma accesible y eficiente que conecte a los usuarios
            con productos de calidad, simplificando cada etapa del proceso de compra.
          </p>
        </div>

        <div class="about__pillar about__pillar--accent">
          <h2 class="about__pillar-title">Visión</h2>
          <p class="about__pillar-text">
            Convertirnos en una solución confiable y práctica para las compras en línea,
            reconocida por su eficiencia, seguridad y enfoque centrado en el usuario.
          </p>
        </div>

      </div>
    </section>

    <section class="about__features">
      <div class="about__features-inner">
        <h2 class="about__section-title">Por qué elegir MercApp</h2>
        <ul class="about__feature-list">
          <li class="about__feature-item">
            <span class="about__feature-dot"></span>
            <div>
              <strong>Navegación simple y rápida</strong>
              <p>Interfaz optimizada para que el usuario encuentre lo que necesita en el menor tiempo posible.</p>
            </div>
          </li>
          <li class="about__feature-item">
            <span class="about__feature-dot"></span>
            <div>
              <strong>Catálogo organizado por categorías</strong>
              <p>Productos clasificados en secciones claras para facilitar la exploración y el descubrimiento.</p>
            </div>
          </li>
          <li class="about__feature-item">
            <span class="about__feature-dot"></span>
            <div>
              <strong>Carrito de compras intuitivo</strong>
              <p>Gestión de compras ágil con control total sobre cantidades, subtotales y resumen del pedido.</p>
            </div>
          </li>
          <li class="about__feature-item">
            <span class="about__feature-dot"></span>
            <div>
              <strong>Plataforma segura y confiable</strong>
              <p>Arquitectura diseñada con estándares modernos para garantizar la integridad de cada transacción.</p>
            </div>
          </li>
          <li class="about__feature-item">
            <span class="about__feature-dot"></span>
            <div>
              <strong>Experiencia optimizada para el usuario</strong>
              <p>Diseño responsivo y accesible adaptado a cualquier dispositivo y contexto de uso.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

  </main>
</template>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

/* Hero */
.about__hero {
  margin-bottom: 56px;
  padding-bottom: 48px;
  border-bottom: 1px solid var(--color-border);
}

.about__hero-inner {
  max-width: 720px;
}

.about__title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  line-height: 1.2;
}

.about__title::after {
  content: '';
  display: block;
  width: 48px;
  height: 4px;
  background: var(--color-primary);
  margin-top: 14px;
  border-radius: 2px;
}

.about__lead {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: 16px;
}

.about__lead:last-child {
  margin-bottom: 0;
}

/* Pillars (Misión / Visión) */
.about__pillars {
  margin-bottom: 56px;
}

.about__pillars-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 600px) {
  .about__pillars-inner {
    grid-template-columns: 1fr;
  }
}

.about__pillar {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px 28px 32px;
  box-shadow: var(--shadow-card);
}

.about__pillar--accent {
  border-top: 3px solid var(--color-primary);
}

.about__pillar-title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.about__pillar-text {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}

/* Features */
.about__features {
  /* inherits page flow */
}

.about__features-inner {
  /* nothing special needed */
}

.about__section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 28px;
  letter-spacing: -0.01em;
}

.about__feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.about__feature-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
}

.about__feature-item:first-child {
  border-top: 1px solid var(--color-border);
}

.about__feature-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  margin-top: 6px;
}

.about__feature-item strong {
  display: block;
  font-size: 0.925rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.about__feature-item p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}
</style>
