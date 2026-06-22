/* ==============================================
   MAIN.JS
   Script principal do portfólio.
   Inicializa os módulos de animação e efeitos
   necessários para cada página.
   ============================================== */

(function () {
  'use strict';

  /**
   * Detecta qual página está ativa pelo <title> ou nav-link.ativo
   */
  function detectarPagina() {
    var linkAtivo = document.querySelector('.nav-link.ativo');
    if (!linkAtivo) return 'desconhecida';
    var href = linkAtivo.getAttribute('href') || '';
    return href.replace('.html', '').replace('./', '');
  }

  /**
   * Inicializa tudo quando o DOM está pronto
   */
  function inicializar() {
    var pagina = detectarPagina();

    // ---- Módulos globais (todas as páginas) ----

    // Transições entre páginas (deve ser primeiro)
    if (window.PageTransitions) {
      window.PageTransitions.iniciar();
    }

    // Efeitos de navegação (header glass, indicador, progress bar)
    if (window.NavEffects) {
      window.NavEffects.iniciar();
    }

    // Scroll reveal (fade-in + slide-up)
    if (window.ScrollReveal) {
      window.ScrollReveal.iniciar();
    }

    // Card tilt 3D + brilho + ripple nos botões
    if (window.CardTilt) {
      window.CardTilt.iniciar();
    }

    // ---- Módulos específicos por página ----

    // Hero da home: efeito de digitação e 3D
    if (pagina === 'index') {
      if (window.HeroTyping) {
        window.HeroTyping.iniciar();
      }
      if (window.Hero3D) {
        window.Hero3D.iniciar();
      }
    }

    // Habilidades: barras animadas
    if (pagina === 'habilidades') {
      if (window.SkillBars) {
        window.SkillBars.iniciar();
      }
    }

    // Formação: timeline animada
    if (pagina === 'formacao') {
      if (window.TimelineAnimate) {
        window.TimelineAnimate.iniciar();
      }
    }

    // Contato: globo 3D
    if (pagina === 'contato') {
      if (window.Globe3D) {
        window.Globe3D.iniciar();
      }
    }
  }

  // Roda quando o DOM termina de carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }
})();
