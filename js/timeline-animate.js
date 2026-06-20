/* ==============================================
   TIMELINE-ANIMATE.JS
   Anima a linha vertical da timeline se
   "desenhando" conforme o scroll, e os pontos
   da timeline com scale/glow ao aparecer.
   Usado na página formacao.html.
   ============================================== */

(function () {
  'use strict';

  /**
   * Inicializa a animação da timeline
   */
  function iniciar() {
    // Não anima se preferem menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    // Observer para cada item da timeline
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ponto-visivel');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });

    // Inicializa pontos como invisíveis e observa
    timelineItems.forEach(function (item) {
      // Esconde o ponto (::before) - vamos animar via CSS
      item.style.setProperty('--ponto-escala', '0');
      observer.observe(item);
    });
  }

  window.TimelineAnimate = { iniciar: iniciar };
})();
