/* ==============================================
   NAV-EFFECTS.JS
   Efeitos do header: glass compacto ao scroll,
   indicador animado no menu, e barra de
   progresso de scroll no topo da página.
   ============================================== */

(function () {
  'use strict';

  /**
   * Header glass compacto ao rolar a página
   */
  function iniciarHeaderCompacto() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ultimoScroll = 0;
    var ticking = false;

    function atualizarHeader() {
      var scrollY = window.scrollY || window.pageYOffset;

      if (scrollY > 50) {
        header.classList.add('header-compacto');
      } else {
        header.classList.remove('header-compacto');
      }

      ultimoScroll = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(atualizarHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Indicador animado (underline) que desliza entre links do menu
   */
  function iniciarIndicadorMenu() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 600px)').matches) return;

    var navPrincipal = document.querySelector('.nav-principal');
    var navLista = document.querySelector('.nav-lista');
    if (!navPrincipal || !navLista) return;

    // Cria o indicador
    var indicador = document.createElement('div');
    indicador.classList.add('nav-indicador');
    navPrincipal.appendChild(indicador);

    var linkAtivo = navLista.querySelector('.nav-link.ativo');

    // Posiciona o indicador no link ativo
    function posicionarIndicador(link) {
      if (!link) {
        indicador.style.width = '0px';
        return;
      }

      var navRect = navPrincipal.getBoundingClientRect();
      var linkRect = link.getBoundingClientRect();

      indicador.style.left = (linkRect.left - navRect.left) + 'px';
      indicador.style.width = linkRect.width + 'px';
    }

    // Posiciona no ativo inicialmente
    if (linkAtivo) {
      // Pequeno delay pra garantir que o layout terminou
      setTimeout(function () {
        posicionarIndicador(linkAtivo);
      }, 100);
    }

    // Move o indicador no hover
    var links = navLista.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        posicionarIndicador(link);
      });
    });

    // Volta pro ativo ao sair do menu
    navLista.addEventListener('mouseleave', function () {
      posicionarIndicador(linkAtivo);
    });

    // Recalcula ao redimensionar
    window.addEventListener('resize', function () {
      posicionarIndicador(linkAtivo);
    });
  }

  /**
   * Barra de progresso de scroll no topo da página
   */
  function iniciarBarraProgresso() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Cria a barra
    var barra = document.createElement('div');
    barra.classList.add('barra-progresso-scroll');
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);

    var ticking = false;

    function atualizarProgresso() {
      var scrollY = window.scrollY || window.pageYOffset;
      var alturaDoc = document.documentElement.scrollHeight - window.innerHeight;

      if (alturaDoc > 0) {
        var progresso = (scrollY / alturaDoc) * 100;
        barra.style.width = progresso + '%';
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(atualizarProgresso);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Inicializa todos os efeitos de navegação
   */
  function iniciar() {
    iniciarHeaderCompacto();
    iniciarIndicadorMenu();
    iniciarBarraProgresso();
  }

  window.NavEffects = { iniciar: iniciar };
})();
