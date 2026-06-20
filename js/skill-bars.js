/* ==============================================
   SKILL-BARS.JS
   Anima as barras de habilidade de 0% até
   o valor real quando entram na viewport.
   Usado apenas na página habilidades.html.
   ============================================== */

(function () {
  'use strict';

  /**
   * Inicializa a animação das barras de habilidade
   */
  function iniciar() {
    var barras = document.querySelectorAll('.skill-barra-preenchimento');
    if (!barras.length) return;

    // Salva o width original e seta a 0 para animar depois
    barras.forEach(function (barra) {
      var larguraOriginal = barra.style.width || '0%';
      barra.setAttribute('data-largura', larguraOriginal);

      // Se preferem menos movimento, não muda nada (mantém estático)
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        barra.style.width = '0%';
      }
    });

    // Não anima se preferem menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Observer para animar quando a seção entra na viewport
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Encontra todas as barras dentro deste container
          var barrasVisíveis = entry.target.querySelectorAll('.skill-barra-preenchimento');
          barrasVisíveis.forEach(function (barra, index) {
            // Stagger sutil entre barras
            setTimeout(function () {
              barra.style.width = barra.getAttribute('data-largura');
            }, index * 150);
          });

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    // Observa cada categoria de habilidade
    var categorias = document.querySelectorAll('.habilidade-categoria');
    if (categorias.length) {
      categorias.forEach(function (cat) {
        observer.observe(cat);
      });
    } else {
      // Fallback: observa o container principal
      var container = barras[0].closest('.container');
      if (container) observer.observe(container);
    }
  }

  window.SkillBars = { iniciar: iniciar };
})();
