import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

(function() {
  const MODEL_PATH = 'ACCO-S11-62CM-R.obj';
  const MTL_PATH   = 'ACCO-S11-62CM-R.mtl';

  const canvas = document.getElementById('canvas-container');
  if (!canvas) return;

  const container = canvas.parentElement;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Transparent to show CSS background
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 5000);
  camera.position.set(2, 2, 8); // good starting angle

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enableZoom = false; // Disabled native continuous zoom
  controls.enablePan = false;
  controls.maxDistance = 15;
  controls.minDistance = 4;

  // ---- LIGHTING (studio setup for bright whites) ----
  const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
  fillLight.position.set(-3, 1, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(0, -2, -3);
  scene.add(rimLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
  topLight.position.set(0, 5, 0);
  scene.add(topLight);

  const bottomFillLight = new THREE.DirectionalLight(0xffffff, 0.6);
  bottomFillLight.position.set(0, -5, 2);
  scene.add(bottomFillLight);

  // ---- ENVIRONMENT MAP (bright white studio) ----
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(50, 32, 32);
  const envMat = new THREE.MeshBasicMaterial({ color: 0xf0f0f5, side: THREE.BackSide });
  envScene.add(new THREE.Mesh(envGeo, envMat));
  const spotGeo = new THREE.SphereGeometry(6, 8, 8);
  const spot1 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  spot1.position.set(10, 12, 10);
  envScene.add(spot1);
  const spot2 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  spot2.position.set(-10, 8, 8);
  envScene.add(spot2);
  const spot3 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  spot3.position.set(5, -5, -10);
  envScene.add(spot3);
  const spot4 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  spot4.position.set(-5, 15, -5);
  envScene.add(spot4);
  const spot5 = new THREE.Mesh(spotGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  spot5.position.set(0, -10, 10);
  envScene.add(spot5);

  const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;

  // ---- FLOOR (MIRRORED) ----
  const floorGeo = new THREE.PlaneGeometry(100, 100);
  const mirror = new Reflector(floorGeo, {
    clipBias: 0.003,
    textureWidth: container.clientWidth * window.devicePixelRatio,
    textureHeight: container.clientHeight * window.devicePixelRatio,
    color: 0x444444 
  });
  mirror.rotation.x = -Math.PI / 2;
  mirror.position.y = -1.5; 
  scene.add(mirror);

  // ---- MATERIAL ----
  const aluminiumMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.4,
    emissive: 0xffffff,
    emissiveIntensity: 0.3,
    envMap: envMap,
    envMapIntensity: 0.5,
  });

  // ---- LIGHT MODE DEFAULT ----
  let isDarkMode = false;
  renderer.setClearColor(0x000000, 0);

  // Mirror hidden in light mode as per previous logic
  if (mirror) mirror.visible = false;

  // Theme toggle removed from UI, so we remove the listener too.
  // We keep the logic for future reference if needed, but it's now inactive.


  // ---- LOAD MODEL ----
  const mtlLoader = new MTLLoader();
  mtlLoader.load(MTL_PATH, function(materials) {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);

    objLoader.load(MODEL_PATH, function(object) {
      object.traverse(function(child) {
        if (child.isMesh) child.material = aluminiumMaterial;
      });

      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, Math.max(size.y, size.z));
      const scaleFactor = 3.5 / (maxDim || 1);

      object.position.copy(center).multiplyScalar(-1);
      
      const wrapper = new THREE.Group();
      wrapper.add(object);
      wrapper.scale.setScalar(scaleFactor);
      wrapper.rotation.x = Math.PI;
      wrapper.rotation.y = Math.PI;

      scene.add(wrapper);
      
      controls.addEventListener('start', () => controls.autoRotate = false);

      function smoothZoom(distanceLevel) {
        controls.autoRotate = false;
        const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        const targetPos = new THREE.Vector3().copy(controls.target).add(dir.multiplyScalar(distanceLevel));
        window.gsap.to(camera.position, {
          x: targetPos.x, y: targetPos.y, z: targetPos.z,
          duration: 1.0, ease: "power2.inOut",
          onUpdate: () => controls.update()
        });
      }

      const zoomLevels = [10, 6, 3.5];
      let currentZoomLevel = 0;
      
      document.getElementById('zoom-in')?.addEventListener('click', () => {
        if (window.gsap.isTweening(camera.position)) return;
        currentZoomLevel = Math.min(zoomLevels.length - 1, currentZoomLevel + 1);
        smoothZoom(zoomLevels[currentZoomLevel]);
      });

      document.getElementById('zoom-out')?.addEventListener('click', () => {
        if (window.gsap.isTweening(camera.position)) return;
        currentZoomLevel = Math.max(0, currentZoomLevel - 1);
        smoothZoom(zoomLevels[currentZoomLevel]);
      });

      // ---- COLOR CONFIGURATOR ----
      document.querySelectorAll('.color-circle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const colorHex = e.target.getAttribute('data-color');
          const newColor = new THREE.Color(colorHex);
          const brightness = (newColor.r + newColor.g + newColor.b) / 3;
          // For very dark colors, drop light scale near zero.
          const lightScale = brightness < 0.1 ? 0.02 : 0.05 + brightness * 0.95;
          
          window.gsap.to(aluminiumMaterial.color, {
            r: newColor.r, g: newColor.g, b: newColor.b,
            duration: 0.6, ease: "power2.out"
          });
          window.gsap.to(aluminiumMaterial.emissive, {
            r: newColor.r, g: newColor.g, b: newColor.b,
            duration: 0.6, ease: "power2.out"
          });
          
          window.gsap.to(aluminiumMaterial, {
            emissiveIntensity: brightness * 0.3,
            envMapIntensity: brightness < 0.1 ? 0 : brightness * 0.5,
            roughness: brightness < 0.1 ? 0.9 : 0.4 + (1 - brightness) * 0.5,
            duration: 0.6, ease: "power2.out"
          });
          
          window.gsap.to(ambientLight, { intensity: 3.0 * lightScale, duration: 0.6, ease: "power2.out" });
          window.gsap.to(keyLight, { intensity: 3.0 * lightScale, duration: 0.6, ease: "power2.out" });
          window.gsap.to(fillLight, { intensity: 1.5 * lightScale, duration: 0.6, ease: "power2.out" });
          window.gsap.to(rimLight, { intensity: 0.8 * lightScale, duration: 0.6, ease: "power2.out" });
          window.gsap.to(topLight, { intensity: 2.0 * lightScale, duration: 0.6, ease: "power2.out" });
          window.gsap.to(bottomFillLight, { intensity: 0.6 * lightScale, duration: 0.6, ease: "power2.out" });
          // Update color name label
          const colorName = e.target.getAttribute('data-name') || e.target.getAttribute('title') || '';
          const label = document.getElementById('color-name-label');
          if (label) label.textContent = colorName;
        });
      });

      animate();
    }, undefined, (err) => console.error(err));
  }, undefined, (err) => console.error(err));

  // ---- ANIMATE ----
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  // ---- RESIZE ----
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if(mirror) mirror.getRenderTarget().setSize(w * window.devicePixelRatio, h * window.devicePixelRatio);
  });

  // ---- PAGE TRANSITIONS (N/A in embedded mode) ----
  // Removed back-btn and manual gsap from body for integrated section
})();
