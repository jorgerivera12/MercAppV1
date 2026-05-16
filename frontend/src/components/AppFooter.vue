<template>
  <footer class="footer">
    <!-- Trust bar -->
    <div class="footer__trust">
      <div class="footer__trust-inner">
        <div class="footer__trust-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            <strong>Pago seguro</strong>
            <span>Transacciones protegidas</span>
          </div>
        </div>

        <div class="footer__trust-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <div>
            <strong>Envíos nacionales</strong>
            <span>A todo el país</span>
          </div>
        </div>

        <div class="footer__trust-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          <div>
            <strong>Devoluciones fáciles</strong>
            <span>30 días sin complicaciones</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer links + copyright -->
    <div class="footer__bottom">
      <div class="footer__bottom-inner">
        <nav class="footer__links">
          <RouterLink to="/about">Acerca de</RouterLink>
          <a href="#">Contacto</a>
          <a href="#">Ayuda</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Política de privacidad</a>
        </nav>
        <p class="footer__copy">© {{ year }} MercApp. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  margin-top: auto;
}

/* Trust bar */
.footer__trust {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 32px 0;
}

.footer__trust-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.footer__trust-item {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--color-text-muted);
}

.footer__trust-item svg {
  flex-shrink: 0;
  color: var(--color-primary);
}

.footer__trust-item strong {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
}

.footer__trust-item span {
  font-size: 0.775rem;
  color: var(--color-text-muted);
}

/* Bottom */
.footer__bottom {
  background: var(--color-text);
  padding: 20px 0;
}

[data-theme="dark"] .footer__bottom {
  background: #0a0a0a;
}

.footer__bottom-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer__links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.footer__links a {
  font-size: 0.8rem;
  color: #9e9e9e;
  transition: color 0.15s;
}

.footer__links a:hover {
  color: #fff;
}

.footer__copy {
  font-size: 0.775rem;
  color: #757575;
}
</style>
