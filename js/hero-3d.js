/* ==============================================
   HERO-3D.JS
   Elemento 3D decorativo no hero da index.html.
   Esfera wireframe icosaedro com partículas,
   renderizada com Three.js via CDN.
   ============================================== */

(function () {
  'use strict';

  /**
   * Inicializa a cena 3D no hero
   */
  function iniciar() {
    // Só roda se Three.js estiver carregado
    if (typeof THREE === 'undefined') {
      console.warn('[hero-3d] Three.js não encontrado, pulando elemento 3D.');
      return;
    }

    // Não renderiza se preferem menos movimento ou em mobile
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 600) return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Cria container do canvas
    var container = document.createElement('div');
    container.classList.add('hero-canvas-container');
    container.setAttribute('aria-hidden', 'true');
    hero.insertBefore(container, hero.firstChild);

    // Setup Three.js
    var largura = container.offsetWidth;
    var altura = container.offsetHeight;

    var cena = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, largura / altura, 0.1, 1000);
    camera.position.z = 4;

    var renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(largura, altura);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Cor ciano neon do site
    var corCiano = new THREE.Color(0x00d4ff);
    var corAzul = new THREE.Color(0x0066ff);

    // Icosaedro wireframe (baixo poly-count)
    var geometriaIcosaedro = new THREE.IcosahedronGeometry(1.8, 1);
    var materialWireframe = new THREE.MeshBasicMaterial({
      color: corCiano,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    var wireframe = new THREE.Mesh(geometriaIcosaedro, materialWireframe);
    cena.add(wireframe);

    // Partículas nos vértices
    var posicoes = geometriaIcosaedro.getAttribute('position');
    var geometriaParticulas = new THREE.BufferGeometry();
    var verticesUnicos = [];
    var visto = new Set();

    for (var i = 0; i < posicoes.count; i++) {
      var chave = Math.round(posicoes.getX(i) * 100) + ',' +
                  Math.round(posicoes.getY(i) * 100) + ',' +
                  Math.round(posicoes.getZ(i) * 100);
      if (!visto.has(chave)) {
        visto.add(chave);
        verticesUnicos.push(posicoes.getX(i), posicoes.getY(i), posicoes.getZ(i));
      }
    }

    geometriaParticulas.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(verticesUnicos, 3)
    );

    var materialParticulas = new THREE.PointsMaterial({
      color: corCiano,
      size: 0.06,
      transparent: true,
      opacity: 0.8
    });
    var particulas = new THREE.Points(geometriaParticulas, materialParticulas);
    cena.add(particulas);

    // Segundo icosaedro menor, rotação contrária
    var geometriaMenor = new THREE.IcosahedronGeometry(1.0, 0);
    var materialMenor = new THREE.MeshBasicMaterial({
      color: corAzul,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    var wireframeMenor = new THREE.Mesh(geometriaMenor, materialMenor);
    cena.add(wireframeMenor);

    // Animação
    var rodando = true;

    function animar() {
      if (!rodando) return;
      requestAnimationFrame(animar);

      wireframe.rotation.x += 0.002;
      wireframe.rotation.y += 0.003;
      particulas.rotation.x += 0.002;
      particulas.rotation.y += 0.003;

      wireframeMenor.rotation.x -= 0.003;
      wireframeMenor.rotation.y -= 0.002;

      renderer.render(cena, camera);
    }

    animar();

    // Redimensionar
    window.addEventListener('resize', function () {
      if (window.innerWidth < 600) {
        rodando = false;
        container.style.display = 'none';
        return;
      }

      container.style.display = '';
      rodando = true;
      largura = container.offsetWidth;
      altura = container.offsetHeight;
      camera.aspect = largura / altura;
      camera.updateProjectionMatrix();
      renderer.setSize(largura, altura);
    });

    // Pausa quando não visível (performance)
    var observerHero = new IntersectionObserver(function (entries) {
      rodando = entries[0].isIntersecting;
      if (rodando) animar();
    }, { threshold: 0.1 });

    observerHero.observe(hero);
  }

  window.Hero3D = { iniciar: iniciar };
})();
