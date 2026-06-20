/* ==============================================
   HERO-TYPING.JS
   Efeito de digitação (typewriter) no texto
   de descrição do hero na página inicial.
   ============================================== */

(function () {
  'use strict';

  /**
   * Inicia o efeito de digitação na descrição do hero
   */
  function iniciar() {
    var descricao = document.querySelector('.hero-descricao');
    if (!descricao) return;

    // Não anima se o usuário prefere menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var textoOriginal = descricao.textContent.trim();
    descricao.textContent = '';
    descricao.style.minHeight = '5em'; // Evita layout shift

    // Cria o cursor
    var cursor = document.createElement('span');
    cursor.classList.add('cursor-digitacao');
    cursor.setAttribute('aria-hidden', 'true');
    descricao.appendChild(cursor);

    var indice = 0;
    var velocidade = 22; // ms por caractere

    function digitarProximoCaractere() {
      if (indice < textoOriginal.length) {
        // Insere o caractere antes do cursor
        var textoAtual = document.createTextNode(textoOriginal.charAt(indice));
        descricao.insertBefore(textoAtual, cursor);
        indice++;
        setTimeout(digitarProximoCaractere, velocidade);
      } else {
        // Terminou de digitar — remove cursor depois de 2s
        descricao.style.minHeight = '';
        setTimeout(function () {
          cursor.style.animation = 'none';
          cursor.style.opacity = '0';
          cursor.style.transition = 'opacity 0.5s ease';
        }, 2000);
      }
    }

    // Começa a digitar com um pequeno delay
    setTimeout(digitarProximoCaractere, 600);
  }

  window.HeroTyping = { iniciar: iniciar };
})();
