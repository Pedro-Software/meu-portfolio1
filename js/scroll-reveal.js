/* ==============================================
   SCROLL-REVEAL.JS
   Revela elementos com fade-in + slide-up
   conforme entram na viewport usando
   IntersectionObserver. Stagger em grids.
   ============================================== */

(function () {
  'use strict';

  // Seletores dos elementos que devem ter scroll reveal
  const SELETORES_REVELAR = [
    '.card',
    '.destaque-card',
    '.interesse-card',
    '.timeline-item',
    '.stat-item',
    '.projeto-secao',
    '.formacao-card-grande',
    '.pagina-banner',
    '.secao-banner',
    '.sobre-conteudo',
    '.bloco-texto',
    '.mouratech-hero',
    '.projeto-hero',
    '.habilidade-categoria',
    '.contato-layout',
    '.linha-decorativa',
    '.secao-titulo',
    '.secao-subtitulo'
  ];

  // Delay base entre items do stagger (ms)
  const STAGGER_DELAY = 100;

  /**
   * Inicializa o scroll reveal em todos os elementos elegíveis
   */
  function iniciar() {
    // Não anima se o usuário prefere menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const elementos = document.querySelectorAll(SELETORES_REVELAR.join(', '));
    if (!elementos.length) return;

    // Aplica a classe .revelar (estado oculto) em todos
    elementos.forEach(function (el) {
      el.classList.add('revelar');
    });

    // Calcula stagger: items dentro do mesmo parent grid recebem delay progressivo
    const gruposProcessados = new Set();
    elementos.forEach(function (el) {
      const parent = el.parentElement;
      if (!parent) return;

      // Verifica se o parent é um container de grid/flex com múltiplos filhos elegíveis
      const irmaoElegiveis = Array.from(parent.children).filter(function (filho) {
        return filho.classList.contains('revelar');
      });

      if (irmaoElegiveis.length > 1 && !gruposProcessados.has(parent)) {
        gruposProcessados.add(parent);
        irmaoElegiveis.forEach(function (filho, index) {
          filho.style.transitionDelay = (index * STAGGER_DELAY) + 'ms';
        });
      }
    });

    // Observer que revela quando 15% do elemento está visível
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revelado');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elementos.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Exporta para o main.js
  window.ScrollReveal = { iniciar: iniciar };
})();
