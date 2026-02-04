window.onload = () => {

  const container = document.getElementById("earth-container");
  if (!container) return;

  /* ================= Scene ================= */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 6.5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* ================= Lights ================= */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const sunLight = new THREE.PointLight(0xffffff, 1.3);
  sunLight.position.set(7, 6, 6);
  scene.add(sunLight);

  /* ================= Group ================= */
  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  /* ================= Earth ================= */
  const EARTH_RADIUS = 2.0;

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 96, 96),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(
        "https://unpkg.com/three-globe@2.24.4/example/img/earth-blue-marble.jpg"
      ),
      shininess: 8
    })
  );
  earthGroup.add(earth);

  /* ================= Grid ================= */
  const gridMat = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6
  });

  function latitudeLine(lat) {
    const pts = [];
    const r = EARTH_RADIUS + 0.05;
    const phi = (90 - lat) * Math.PI / 180;
    for (let lon = 0; lon <= 360; lon += 3) {
      const t = lon * Math.PI / 180;
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(t),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(t)
        )
      );
    }
    earthGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      gridMat
    ));
  }

  function longitudeLine(lon) {
    const pts = [];
    const r = EARTH_RADIUS + 0.05;
    const theta = lon * Math.PI / 180;
    for (let lat = -90; lat <= 90; lat += 3) {
      const phi = (90 - lat) * Math.PI / 180;
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
    for (let lat = 90; lat >= -90; lat -= 3) {
      const phi = (90 - lat) * Math.PI / 180;
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta + Math.PI),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta + Math.PI)
        )
      );
    }
    earthGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      gridMat
    ));
  }

  for (let lat = -75; lat <= 75; lat += 15) latitudeLine(lat);
  for (let lon = 0; lon < 180; lon += 15) longitudeLine(lon);

  /* ================= Labels (كبرة ×2 – بيضا) ================= */
  function createLabel(text, lon, lat, vertical = false) {

    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    if (vertical) ctx.rotate(-Math.PI / 2);

    ctx.font = "bold 96px Cairo";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        depthTest: false
      })
    );

    const r = EARTH_RADIUS + 0.1;
    const phi = (90 - lat) * Math.PI / 180;
    const theta = lon * Math.PI / 180;

    sprite.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );

    sprite.scale.set(0.95, 0.45, 1);
    earthGroup.add(sprite);
  }

  for (let lat = -60; lat <= 60; lat += 30) {
    createLabel(lat + "°", 0, lat);
    createLabel(lat + "°", 90, lat);
  }

  for (let lon = 0; lon < 360; lon += 30) {
    createLabel(lon + "°", lon, 0, true);
  }

  /* ================= Ultra-Realistic Satellites ================= */
  function createDetailedSatellite(radius, speed, tilt) {
    const orbitGroup = new THREE.Group();
    earthGroup.add(orbitGroup);

    const satelliteGroup = new THREE.Group();
    orbitGroup.add(satelliteGroup);

    const scale = 0.008; // Scale down the satellite (smaller)

    // Main body - central core
    const bodyGeometry = new THREE.BoxGeometry(12 * scale, 18 * scale, 12 * scale);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x443311,
      emissiveIntensity: 0.15
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    satelliteGroup.add(body);

    // Body details - thermal blankets
    const detailGeometry = new THREE.BoxGeometry(11 * scale, 5 * scale, 0.5 * scale);
    const detailMaterial = new THREE.MeshStandardMaterial({
      color: 0xccaa44,
      metalness: 0.3,
      roughness: 0.7
    });

    for (let i = 0; i < 3; i++) {
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.set(0, (-6 + i * 6) * scale, 6.3 * scale);
      satelliteGroup.add(detail);

      const detailBack = new THREE.Mesh(detailGeometry, detailMaterial);
      detailBack.position.set(0, (-6 + i * 6) * scale, -6.3 * scale);
      satelliteGroup.add(detailBack);
    }

    // Solar panels
    const solarPanelGeometry = new THREE.BoxGeometry(40 * scale, 24 * scale, 0.6 * scale);
    const solarCanvas = document.createElement('canvas');
    solarCanvas.width = 512;
    solarCanvas.height = 384;
    const solarCtx = solarCanvas.getContext('2d');

    const gradient = solarCtx.createLinearGradient(0, 0, 512, 384);
    gradient.addColorStop(0, '#0a1530');
    gradient.addColorStop(0.5, '#152540');
    gradient.addColorStop(1, '#0a1530');
    solarCtx.fillStyle = gradient;
    solarCtx.fillRect(0, 0, 512, 384);

    solarCtx.strokeStyle = '#1a2a4a';
    solarCtx.lineWidth = 2;
    const cellSize = 32;
    for (let i = 0; i <= 512; i += cellSize) {
      solarCtx.beginPath();
      solarCtx.moveTo(i, 0);
      solarCtx.lineTo(i, 384);
      solarCtx.stroke();
    }
    for (let i = 0; i <= 384; i += cellSize) {
      solarCtx.beginPath();
      solarCtx.moveTo(0, i);
      solarCtx.lineTo(512, i);
      solarCtx.stroke();
    }

    const solarTexture = new THREE.CanvasTexture(solarCanvas);
    const solarMaterial = new THREE.MeshStandardMaterial({
      map: solarTexture,
      metalness: 0.3,
      roughness: 0.7,
      emissive: 0x001a44,
      emissiveIntensity: 0.4
    });

    const solarPanelLeft = new THREE.Mesh(solarPanelGeometry, solarMaterial);
    solarPanelLeft.position.set(-32 * scale, 0, 0);
    satelliteGroup.add(solarPanelLeft);

    const solarPanelRight = new THREE.Mesh(solarPanelGeometry, solarMaterial);
    solarPanelRight.position.set(32 * scale, 0, 0);
    satelliteGroup.add(solarPanelRight);

    // Communication dish
    const dishArmGeometry = new THREE.CylinderGeometry(0.5 * scale, 0.5 * scale, 15 * scale, 16);
    const dishArmMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.75,
      roughness: 0.25
    });
    const dishArm = new THREE.Mesh(dishArmGeometry, dishArmMaterial);
    dishArm.position.set(-14 * scale, 4 * scale, 0);
    dishArm.rotation.z = Math.PI / 2;
    satelliteGroup.add(dishArm);

    const dishGeometry = new THREE.CylinderGeometry(7 * scale, 6 * scale, 2 * scale, 32);
    const dishMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5e5e5,
      metalness: 0.92,
      roughness: 0.15,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeometry, dishMaterial);
    dish.rotation.z = Math.PI / 2;
    dish.position.set(-20 * scale, 4 * scale, 0);
    satelliteGroup.add(dish);

    // Antenna array
    const mainMastGeometry = new THREE.CylinderGeometry(0.5 * scale, 0.5 * scale, 16 * scale, 16);
    const mastMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.85,
      roughness: 0.2
    });
    const mainMast = new THREE.Mesh(mainMastGeometry, mastMaterial);
    mainMast.position.set(0, 17 * scale, 0);
    satelliteGroup.add(mainMast);

    // Navigation lights
    const lightConfigs = [
      { pos: [0, 26 * scale, 0], color: 0xff0000 },
      { pos: [6 * scale, 9 * scale, 6 * scale], color: 0x00ff00 },
      { pos: [-6 * scale, -9 * scale, 6 * scale], color: 0x0088ff }
    ];

    satelliteGroup.userData.lights = [];
    lightConfigs.forEach((config) => {
      const lightGeometry = new THREE.SphereGeometry(0.7 * scale, 8, 8);
      const lightMaterial = new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 1
      });
      const light = new THREE.Mesh(lightGeometry, lightMaterial);
      light.position.set(config.pos[0], config.pos[1], config.pos[2]);
      satelliteGroup.add(light);

      satelliteGroup.userData.lights.push({
        mesh: light,
        offset: Math.random() * Math.PI * 2
      });
    });

    satelliteGroup.position.x = radius;

    return { orbitGroup, satelliteGroup, speed, tilt };
  }

  /* ====== فقط قمرين ====== */
  const satellites = [
    createDetailedSatellite(2.3, 0.008, 0.25),
    createDetailedSatellite(2.6, 0.006, -0.35)
  ];

  /* ================= Animate ================= */
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);

    time += 0.01;
    earthGroup.rotation.y += 0.002;

    satellites.forEach(s => {
      s.orbitGroup.rotation.y += s.speed;
      s.orbitGroup.rotation.x = s.tilt;

      // دايمًا بصّين على الأرض
      s.satelliteGroup.lookAt(earth.position);

      // Blink navigation lights
      if (s.satelliteGroup.userData.lights) {
        s.satelliteGroup.userData.lights.forEach((light, index) => {
          const blinkValue = Math.sin(time * 1.5 + light.offset);
          if (index === 0) {
            light.mesh.material.emissiveIntensity = blinkValue > 0 ? 1 : 0.2;
          } else {
            light.mesh.material.emissiveIntensity = 0.5 + (blinkValue + 1) / 4;
          }
        });
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  /* ================= Resize ================= */
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

};