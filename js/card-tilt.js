/* ==============================================
   CARD-TILT.JS
   Efeito tilt 3D nos cards ao mover o mouse
   + brilho nos botões que segue o cursor
   + ripple effect ao clicar nos botões.
   ============================================== */

(function () {
  'use strict';

  // Rotação máxima em graus
  var MAX_ROTACAO = 8;

  // Seletores dos cards que recebem tilt
  var SELETORES_TILT = [
    '.card-projeto',
    '.destaque-card',
    '.interesse-card',
    '.stat-item'
  ];

  /**
   * Aplica efeito tilt 3D nos cards
   */
  function iniciarTilt() {
    // Não aplica se prefere menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cards = document.querySelectorAll(SELETORES_TILT.join(', '));
    cards.forEach(function (card) {
      // Adiciona o elemento de glow interno
      var glow = document.createElement('div');
      glow.classList.add('card-tilt-glow');
      card.style.position = 'relative';
      card.appendChild(glow);

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centroX = rect.width / 2;
        var centroY = rect.height / 2;

        // Calcula rotação proporcional à distância do centro
        var rotateX = ((y - centroY) / centroY) * -MAX_ROTACAO;
        var rotateY = ((x - centroX) / centroX) * MAX_ROTACAO;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
        card.style.transition = 'transform 0.1s ease';

        // Atualiza posição do glow
        var percX = (x / rect.width) * 100;
        var percY = (y / rect.height) * 100;
        glow.style.setProperty('--mouse-x', percX + '%');
        glow.style.setProperty('--mouse-y', percY + '%');
        glow.style.opacity = '1';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        glow.style.opacity = '0';
      });

      // Suporte a gestos de toque no celular/tablet
      card.addEventListener('touchmove', function (e) {
        if (e.touches.length === 1) {
          var touch = e.touches[0];
          var rect = card.getBoundingClientRect();
          var x = touch.clientX - rect.left;
          var y = touch.clientY - rect.top;
          var centroX = rect.width / 2;
          var centroY = rect.height / 2;

          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            var rotateX = ((y - centroY) / centroY) * -MAX_ROTACAO;
            var rotateY = ((x - centroX) / centroX) * MAX_ROTACAO;

            card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
            card.style.transition = 'transform 0.1s ease';

            var percX = (x / rect.width) * 100;
            var percY = (y / rect.height) * 100;
            glow.style.setProperty('--mouse-x', percX + '%');
            glow.style.setProperty('--mouse-y', percY + '%');
            glow.style.opacity = '1';
          } else {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            glow.style.opacity = '0';
          }
        }
      }, { passive: true });

      card.addEventListener('touchend', function () {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        glow.style.opacity = '0';
      });
    });
  }

  /**
   * Brilho que segue o cursor nos botões
   */
  function iniciarBrilhoBotoes() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var botoes = document.querySelectorAll('.btn-primario, .btn-secundario');
    botoes.forEach(function (btn) {
      // Cria o elemento de brilho
      var brilho = document.createElement('span');
      brilho.classList.add('btn-brilho');
      btn.appendChild(brilho);

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        brilho.style.left = (e.clientX - rect.left) + 'px';
        brilho.style.top = (e.clientY - rect.top) + 'px';
      });

      btn.addEventListener('touchmove', function (e) {
        if (e.touches.length === 1) {
          var touch = e.touches[0];
          var rect = btn.getBoundingClientRect();
          var x = touch.clientX - rect.left;
          var y = touch.clientY - rect.top;
          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            brilho.style.left = x + 'px';
            brilho.style.top = y + 'px';
            brilho.style.opacity = '1';
          } else {
            brilho.style.opacity = '0';
          }
        }
      }, { passive: true });

      btn.addEventListener('touchend', function () {
        brilho.style.opacity = '0';
      });
    });
  }

  /**
   * Ripple effect ao clicar nos botões
   */
  function iniciarRipple() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn');
      if (!btn) return;

      var ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');

      var rect = btn.getBoundingClientRect();
      var tamanho = Math.max(rect.width, rect.height);
      ripple.style.width = tamanho + 'px';
      ripple.style.height = tamanho + 'px';
      ripple.style.left = (e.clientX - rect.left - tamanho / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - tamanho / 2) + 'px';

      btn.appendChild(ripple);

      // Remove o ripple depois da animação
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  }

  /**
   * Inicializa todos os efeitos de cards e botões
   */
  function iniciar() {
    iniciarTilt();
    iniciarBrilhoBotoes();
    iniciarRipple();
  }

  window.CardTilt = { iniciar: iniciar };
})();
