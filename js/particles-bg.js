/* ==============================================
   PARTICLES-BG.JS
   Partículas flutuantes interativas em canvas 2D
   com conexões tipo constelação. Fundo animado
   para todas as páginas do portfólio.
   ============================================== */

(function () {
  'use strict';

  function iniciar() {
    // Não renderiza se preferem menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Não adiciona se já existe um canvas de partículas
    if (document.querySelector('.particles-canvas-container')) return;

    var body = document.body;
    var container = document.createElement('div');
    container.classList.add('particles-canvas-container');
    container.setAttribute('aria-hidden', 'true');
    body.insertBefore(container, body.firstChild);

    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var mouseX = -1000;
    var mouseY = -1000;
    var particulas = [];
    var numParticulas = 60;
    var distanciaConexao = 150;
    var distanciaMouse = 180;
    var rodando = true;

    function redimensionar() {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    }

    redimensionar();

    // Classe Partícula
    function Particula() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.raio = Math.random() * 2 + 0.5;
      this.opacidade = Math.random() * 0.5 + 0.1;
      this.cor = Math.random() > 0.7 ? '0, 102, 255' : '0, 212, 255';
    }

    Particula.prototype.atualizar = function () {
      this.x += this.vx;
      this.y += this.vy;

      // Efeito de repulsão suave do mouse
      var dx = this.x - mouseX;
      var dy = this.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < distanciaMouse && dist > 0) {
        var forca = (distanciaMouse - dist) / distanciaMouse;
        this.x += (dx / dist) * forca * 1.5;
        this.y += (dy / dist) * forca * 1.5;
      }

      // Wrap around
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    };

    Particula.prototype.desenhar = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.cor + ', ' + this.opacidade + ')';
      ctx.fill();
    };

    // Inicializar partículas
    for (var i = 0; i < numParticulas; i++) {
      particulas.push(new Particula());
    }

    function desenharConexoes() {
      for (var i = 0; i < particulas.length; i++) {
        for (var j = i + 1; j < particulas.length; j++) {
          var dx = particulas[i].x - particulas[j].x;
          var dy = particulas[i].y - particulas[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < distanciaConexao) {
            var opacidade = (1 - dist / distanciaConexao) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particulas[i].x, particulas[i].y);
            ctx.lineTo(particulas[j].x, particulas[j].y);
            ctx.strokeStyle = 'rgba(0, 212, 255, ' + opacidade + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Conexão com o mouse
        var dxm = particulas[i].x - mouseX;
        var dym = particulas[i].y - mouseY;
        var distM = Math.sqrt(dxm * dxm + dym * dym);

        if (distM < distanciaMouse) {
          var opacidadeM = (1 - distM / distanciaMouse) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particulas[i].x, particulas[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = 'rgba(0, 212, 255, ' + opacidadeM + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    function animar() {
      if (!rodando) return;
      requestAnimationFrame(animar);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particulas.length; i++) {
        particulas[i].atualizar();
        particulas[i].desenhar();
      }

      desenharConexoes();
    }

    animar();

    // Mouse tracking com scroll offset
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    });

    document.addEventListener('mouseleave', function () {
      mouseX = -1000;
      mouseY = -1000;
    });

    // Redimensionar com debounce
    var timerResize;
    window.addEventListener('resize', function () {
      clearTimeout(timerResize);
      timerResize = setTimeout(function () {
        redimensionar();
        // Redistribuir partículas
        for (var i = 0; i < particulas.length; i++) {
          if (particulas[i].x > canvas.width) particulas[i].x = Math.random() * canvas.width;
          if (particulas[i].y > canvas.height) particulas[i].y = Math.random() * canvas.height;
        }
      }, 200);
    });

    // Pausa quando tab não visível
    document.addEventListener('visibilitychange', function () {
      rodando = !document.hidden;
      if (rodando) animar();
    });
  }

  // Inicia quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  window.ParticlesBg = { iniciar: iniciar };
})();
