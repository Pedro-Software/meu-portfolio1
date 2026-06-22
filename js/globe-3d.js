/* ==============================================
   GLOBE-3D.JS
   Globo 3D wireframe com pontos de conexão e
   arcos animados. Usado na página de contato
   para simbolizar conectividade global.
   ============================================== */

(function () {
  'use strict';

  function iniciar() {
    if (typeof THREE === 'undefined') {
      console.warn('[globe-3d] Three.js não encontrado.');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var alvo = document.querySelector('.contato-globe-container');
    if (!alvo) return;

    var largura = alvo.offsetWidth;
    var altura = alvo.offsetHeight || 400;

    var cena = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, largura / altura, 0.1, 1000);
    camera.position.z = 3.5;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(largura, altura);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    alvo.appendChild(renderer.domElement);

    var corCiano = new THREE.Color(0x00d4ff);
    var corAzul = new THREE.Color(0x0066ff);

    // Globo wireframe principal
    var geoGlobo = new THREE.SphereGeometry(1.5, 24, 24);
    var matGlobo = new THREE.MeshBasicMaterial({
      color: corCiano,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    var globo = new THREE.Mesh(geoGlobo, matGlobo);
    cena.add(globo);

    // Segundo globo (linhas de latitude)
    var geoLat = new THREE.SphereGeometry(1.52, 32, 8);
    var matLat = new THREE.MeshBasicMaterial({
      color: corAzul,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    var globoLat = new THREE.Mesh(geoLat, matLat);
    cena.add(globoLat);

    // Pontos luminosos no globo (cidades)
    var pontosData = [
      { lat: -7.12, lon: -34.86 },   // João Pessoa
      { lat: -8.05, lon: -34.87 },   // Recife
      { lat: -23.55, lon: -46.63 },  // São Paulo
      { lat: 40.71, lon: -74.01 },   // New York
      { lat: 51.51, lon: -0.13 },    // London
      { lat: 35.68, lon: 139.69 },   // Tokyo
      { lat: 48.86, lon: 2.35 },     // Paris
      { lat: -33.87, lon: 151.21 },  // Sydney
      { lat: 37.77, lon: -122.42 },  // San Francisco
    ];

    function latLonParaVec3(lat, lon, raio) {
      var phi = (90 - lat) * (Math.PI / 180);
      var theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(raio * Math.sin(phi) * Math.cos(theta)),
        raio * Math.cos(phi),
        raio * Math.sin(phi) * Math.sin(theta)
      );
    }

    var grupoPontos = new THREE.Group();

    pontosData.forEach(function (p) {
      var pos = latLonParaVec3(p.lat, p.lon, 1.52);

      // Ponto brilhante
      var geoPonto = new THREE.SphereGeometry(0.025, 8, 8);
      var matPonto = new THREE.MeshBasicMaterial({
        color: corCiano,
        transparent: true,
        opacity: 0.9
      });
      var ponto = new THREE.Mesh(geoPonto, matPonto);
      ponto.position.copy(pos);
      grupoPontos.add(ponto);

      // Anel de glow
      var geoAnel = new THREE.RingGeometry(0.03, 0.06, 16);
      var matAnel = new THREE.MeshBasicMaterial({
        color: corCiano,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      var anel = new THREE.Mesh(geoAnel, matAnel);
      anel.position.copy(pos);
      anel.lookAt(new THREE.Vector3(0, 0, 0));
      grupoPontos.add(anel);
    });

    cena.add(grupoPontos);

    // Arcos de conexão animados
    function criarArco(p1, p2) {
      var pontoInicio = latLonParaVec3(p1.lat, p1.lon, 1.52);
      var pontoFim = latLonParaVec3(p2.lat, p2.lon, 1.52);

      var meio = new THREE.Vector3()
        .addVectors(pontoInicio, pontoFim)
        .multiplyScalar(0.5);
      var distancia = pontoInicio.distanceTo(pontoFim);
      meio.normalize().multiplyScalar(1.52 + distancia * 0.3);

      var curva = new THREE.QuadraticBezierCurve3(pontoInicio, meio, pontoFim);
      var pontosArco = curva.getPoints(40);
      var geoArco = new THREE.BufferGeometry().setFromPoints(pontosArco);
      var matArco = new THREE.LineBasicMaterial({
        color: corCiano,
        transparent: true,
        opacity: 0.2
      });
      return new THREE.Line(geoArco, matArco);
    }

    // Conectar João Pessoa com algumas cidades
    var arcos = [
      criarArco(pontosData[0], pontosData[3]),
      criarArco(pontosData[0], pontosData[4]),
      criarArco(pontosData[0], pontosData[2]),
      criarArco(pontosData[3], pontosData[5]),
      criarArco(pontosData[4], pontosData[6]),
    ];

    arcos.forEach(function (arco) {
      cena.add(arco);
    });

    // Anel orbital
    var geoOrbita = new THREE.TorusGeometry(2.0, 0.005, 8, 100);
    var matOrbita = new THREE.MeshBasicMaterial({
      color: corCiano,
      transparent: true,
      opacity: 0.15
    });
    var orbita = new THREE.Mesh(geoOrbita, matOrbita);
    orbita.rotation.x = Math.PI / 3;
    cena.add(orbita);

    // Mouse tracking
    var mouseX = 0;
    var mouseY = 0;

    alvo.addEventListener('mousemove', function (e) {
      var rect = alvo.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    // Animação
    var rodando = true;
    var tempo = 0;

    function animar() {
      if (!rodando) return;
      requestAnimationFrame(animar);
      tempo += 0.01;

      globo.rotation.y += 0.002;
      globoLat.rotation.y += 0.002;
      grupoPontos.rotation.y += 0.002;

      arcos.forEach(function (arco) {
        arco.rotation.y += 0.002;
      });

      orbita.rotation.z += 0.001;

      // Mouse influence suave
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(cena.position);

      // Pulsar opacidade dos arcos
      arcos.forEach(function (arco, idx) {
        arco.material.opacity = 0.15 + Math.sin(tempo * 2 + idx) * 0.1;
      });

      renderer.render(cena, camera);
    }

    animar();

    // Resize
    window.addEventListener('resize', function () {
      largura = alvo.offsetWidth;
      altura = alvo.offsetHeight || 400;
      camera.aspect = largura / altura;
      camera.updateProjectionMatrix();
      renderer.setSize(largura, altura);
    });

    // Visibilidade
    var observer = new IntersectionObserver(function (entries) {
      rodando = entries[0].isIntersecting;
      if (rodando) animar();
    }, { threshold: 0.1 });
    observer.observe(alvo);
  }

  window.Globe3D = { iniciar: iniciar };
})();
