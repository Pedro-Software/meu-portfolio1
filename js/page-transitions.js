/* ==============================================
   PAGE-TRANSITIONS.JS
   Transição suave (fade out/in) ao navegar
   entre páginas internas do portfólio.
   Intercepta cliques em links .html internos.
   ============================================== */

(function () {
  'use strict';

  /**
   * Inicializa as transições entre páginas
   */
  function iniciar() {
    // Não anima se preferem menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Fade-in ao carregar a página
    document.body.style.opacity = '0';
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });

    // Intercepta cliques em links internos
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      // Só intercepta links internos (.html) que não abrem em nova aba
      var ehInterno = href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//');
      var novaAba = link.getAttribute('target') === '_blank';
      var teclaModificadora = e.ctrlKey || e.metaKey || e.shiftKey;

      if (!ehInterno || novaAba || teclaModificadora) return;

      e.preventDefault();

      // Fade out
      document.body.classList.add('pagina-saindo');

      // Navega depois da transição
      setTimeout(function () {
        window.location.href = href;
      }, 250);
    });
  }

  window.PageTransitions = { iniciar: iniciar };
})();
