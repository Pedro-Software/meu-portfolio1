/* ==============================================
   SHIELD-3D.JS
   Escudo hexagonal animado em canvas 2D com
   pulsos de energia. Usado na seção de destaque
   de cibersegurança na home.
   ============================================== */

(function () {
  'use strict';

  function iniciar() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var container = document.querySelector('.shield-canvas-container');
    if (!container) return;

    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var largura, altura;
    var hexagonos = [];
    var pulsos = [];
    var tempo = 0;

    function redimensionar() {
      largura = container.offsetWidth;
      altura = container.offsetHeight;
      canvas.width = largura;
      canvas.height = altura;
      criarHexagonos();
    }

    function criarHexagonos() {
      hexagonos = [];
      var tamanho = 22;
      var espaco = tamanho * 1.85;
      var centroX = largura / 2;
      var centroY = altura / 2;
      var cols = Math.ceil(largura / espaco) + 2;
      var rows = Math.ceil(altura / (espaco * 0.866)) + 2;

      for (var row = -rows / 2; row < rows / 2; row++) {
        for (var col = -cols / 2; col < cols / 2; col++) {
          var x = centroX + col * espaco + (row % 2 === 0 ? 0 : espaco / 2);
          var y = centroY + row * espaco * 0.866;

          // Distância do centro para efeito de escudo
          var dx = x - centroX;
          var dy = y - centroY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var maxDist = Math.min(largura, altura) * 0.45;

          if (dist < maxDist) {
            hexagonos.push({
              x: x,
              y: y,
              tamanho: tamanho,
              dist: dist,
              maxDist: maxDist,
              opacidade: 0,
              opacidadeAlvo: (1 - dist / maxDist) * 0.3 + 0.05,
              delay: dist * 3,
              ativo: false
            });
          }
        }
      }
    }

    function desenharHexagono(x, y, tamanho, opacidade, pulsoForca) {
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var angulo = (Math.PI / 3) * i - Math.PI / 6;
        var px = x + tamanho * Math.cos(angulo);
        var py = y + tamanho * Math.sin(angulo);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Preenchimento sutil
      var fillOpacidade = opacidade * 0.3;
      if (pulsoForca > 0) fillOpacidade += pulsoForca * 0.15;
      ctx.fillStyle = 'rgba(0, 212, 255, ' + fillOpacidade + ')';
      ctx.fill();

      // Borda
      var strokeOpacidade = opacidade * 0.6;
      if (pulsoForca > 0) strokeOpacidade += pulsoForca * 0.4;
      ctx.strokeStyle = 'rgba(0, 212, 255, ' + strokeOpacidade + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function criarPulso() {
      pulsos.push({
        raio: 0,
        velocidade: 1.5 + Math.random() * 1,
        opacidade: 1
      });
    }

    function animar() {
      requestAnimationFrame(animar);
      tempo += 16;

      ctx.clearRect(0, 0, largura, altura);

      // Atualizar e desenhar hexágonos
      var centroX = largura / 2;
      var centroY = altura / 2;

      hexagonos.forEach(function (hex) {
        // Animação de aparecimento
        if (tempo > hex.delay && !hex.ativo) {
          hex.ativo = true;
        }

        if (hex.ativo) {
          hex.opacidade += (hex.opacidadeAlvo - hex.opacidade) * 0.05;
        }

        // Verificar se algum pulso afeta este hexágono
        var pulsoForca = 0;
        pulsos.forEach(function (p) {
          var distPulso = Math.abs(hex.dist - p.raio);
          if (distPulso < 40) {
            pulsoForca = Math.max(pulsoForca, (1 - distPulso / 40) * p.opacidade);
          }
        });

        // Respiro sutil
        var breathe = Math.sin(tempo * 0.001 + hex.dist * 0.01) * 0.05;

        desenharHexagono(hex.x, hex.y, hex.tamanho, hex.opacidade + breathe, pulsoForca);
      });

      // Atualizar pulsos
      for (var i = pulsos.length - 1; i >= 0; i--) {
        pulsos[i].raio += pulsos[i].velocidade;
        pulsos[i].opacidade -= 0.005;

        if (pulsos[i].opacidade <= 0) {
          pulsos.splice(i, 1);
        }
      }

      // Criar pulso periodicamente
      if (tempo % 2500 < 16) {
        criarPulso();
      }
    }

    redimensionar();
    animar();

    // Pulso inicial
    setTimeout(function () { criarPulso(); }, 500);

    window.addEventListener('resize', function () {
      redimensionar();
    });

    // Mouse interação — pulso no clique
    container.addEventListener('click', function () {
      criarPulso();
    });
  }

  // Inicia quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  window.Shield3D = { iniciar: iniciar };
})();
