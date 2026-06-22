/* ==============================================
   HERO-3D.JS
   Elemento 3D decorativo no hero da index.html.
   Esfera wireframe icosaedro com partículas
   orbitais e reatividade ao mouse.
   Renderizada com Three.js via CDN.
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

    // Não renderiza se preferem menos movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

    // Cores
    var corCiano = new THREE.Color(0x00d4ff);
    var corAzul = new THREE.Color(0x0066ff);
    var corVerde = new THREE.Color(0x00e676);

    // Grupo principal para rotação com o mouse
    var grupoPrincipal = new THREE.Group();
    cena.add(grupoPrincipal);

    // Icosaedro wireframe principal
    var geometriaIcosaedro = new THREE.IcosahedronGeometry(1.8, 1);
    var materialWireframe = new THREE.MeshBasicMaterial({
      color: corCiano,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    var wireframe = new THREE.Mesh(geometriaIcosaedro, materialWireframe);
    grupoPrincipal.add(wireframe);

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
    grupoPrincipal.add(particulas);

    // Segundo icosaedro menor, rotação contrária
    var geometriaMenor = new THREE.IcosahedronGeometry(1.0, 0);
    var materialMenor = new THREE.MeshBasicMaterial({
      color: corAzul,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    var wireframeMenor = new THREE.Mesh(geometriaMenor, materialMenor);
    grupoPrincipal.add(wireframeMenor);

    // Anel orbital
    var geoAnel = new THREE.TorusGeometry(2.3, 0.008, 8, 100);
    var matAnel = new THREE.MeshBasicMaterial({
      color: corCiano,
      transparent: true,
      opacity: 0.15
    });
    var anel = new THREE.Mesh(geoAnel, matAnel);
    anel.rotation.x = Math.PI / 2.2;
    grupoPrincipal.add(anel);

    // Segundo anel
    var geoAnel2 = new THREE.TorusGeometry(2.5, 0.005, 8, 100);
    var matAnel2 = new THREE.MeshBasicMaterial({
      color: corAzul,
      transparent: true,
      opacity: 0.08
    });
    var anel2 = new THREE.Mesh(geoAnel2, matAnel2);
    anel2.rotation.x = Math.PI / 1.5;
    anel2.rotation.y = Math.PI / 4;
    grupoPrincipal.add(anel2);

    // Partículas orbitais
    var numOrbitais = 40;
    var geoOrbitais = new THREE.BufferGeometry();
    var posOrbitais = new Float32Array(numOrbitais * 3);
    var velOrbitais = [];

    for (var j = 0; j < numOrbitais; j++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.random() * Math.PI;
      var r = 2.0 + Math.random() * 0.8;

      posOrbitais[j * 3] = r * Math.sin(phi) * Math.cos(theta);
      posOrbitais[j * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posOrbitais[j * 3 + 2] = r * Math.cos(phi);

      velOrbitais.push({
        velocidade: 0.003 + Math.random() * 0.005,
        raio: r,
        thetaOffset: theta,
        phiOffset: phi,
        fase: Math.random() * Math.PI * 2
      });
    }

    geoOrbitais.setAttribute('position', new THREE.Float32BufferAttribute(posOrbitais, 3));
    var matOrbitais = new THREE.PointsMaterial({
      color: corVerde,
      size: 0.035,
      transparent: true,
      opacity: 0.6
    });
    var particulasOrbitais = new THREE.Points(geoOrbitais, matOrbitais);
    grupoPrincipal.add(particulasOrbitais);

    // Mouse tracking
    var mouseX = 0;
    var mouseY = 0;
    var targetRotX = 0;
    var targetRotY = 0;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    hero.addEventListener('mouseleave', function () {
      mouseX = 0;
      mouseY = 0;
    });

    // Animação
    var rodando = true;
    var tempo = 0;
    var glitchTimer = 0;
    var glitchAtivo = false;

    function animar() {
      if (!rodando) return;
      requestAnimationFrame(animar);
      tempo += 0.01;

      // Rotação base
      wireframe.rotation.x += 0.002;
      wireframe.rotation.y += 0.003;
      particulas.rotation.x += 0.002;
      particulas.rotation.y += 0.003;
      wireframeMenor.rotation.x -= 0.003;
      wireframeMenor.rotation.y -= 0.002;

      // Anéis orbitais
      anel.rotation.z += 0.001;
      anel2.rotation.z -= 0.0008;

      // Mouse influence no grupo principal
      targetRotX = mouseY * 0.3;
      targetRotY = mouseX * 0.3;
      grupoPrincipal.rotation.x += (targetRotX - grupoPrincipal.rotation.x) * 0.02;
      grupoPrincipal.rotation.y += (targetRotY - grupoPrincipal.rotation.y) * 0.02;

      // Atualizar partículas orbitais
      var posAttr = geoOrbitais.getAttribute('position');
      for (var k = 0; k < numOrbitais; k++) {
        var vel = velOrbitais[k];
        var t = tempo * vel.velocidade * 10 + vel.fase;
        var r = vel.raio + Math.sin(t * 0.5) * 0.1;

        posAttr.setXYZ(
          k,
          r * Math.sin(vel.phiOffset + t * 0.3) * Math.cos(vel.thetaOffset + t),
          r * Math.sin(vel.phiOffset + t * 0.3) * Math.sin(vel.thetaOffset + t),
          r * Math.cos(vel.phiOffset + t * 0.3)
        );
      }
      posAttr.needsUpdate = true;

      // Efeito de respiração na opacidade
      materialWireframe.opacity = 0.18 + Math.sin(tempo * 0.5) * 0.05;

      // Glitch sutil periódico
      glitchTimer += 16;
      if (glitchTimer > 5000 && !glitchAtivo) {
        glitchAtivo = true;
        glitchTimer = 0;
        materialWireframe.opacity = 0.4;
        wireframe.position.x = (Math.random() - 0.5) * 0.1;
        setTimeout(function () {
          materialWireframe.opacity = 0.2;
          wireframe.position.x = 0;
          glitchAtivo = false;
        }, 100);
      }

      renderer.render(cena, camera);
    }

    animar();

    // Redimensionar
    window.addEventListener('resize', function () {
      largura = container.offsetWidth;
      altura = container.offsetHeight;
      camera.aspect = largura / altura;
      camera.updateProjectionMatrix();
      renderer.setSize(largura, altura);
    });

    // Pausa quando não visível
    var observerHero = new IntersectionObserver(function (entries) {
      rodando = entries[0].isIntersecting;
      if (rodando) animar();
    }, { threshold: 0.1 });

    observerHero.observe(hero);
  }

  window.Hero3D = { iniciar: iniciar };
})();
