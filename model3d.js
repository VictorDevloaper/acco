/* ============================================
   ACCO CAIXAS – THREE.JS 3D MODEL + SCROLL
   ES Module version
   ============================================ */

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

(function() {

  const MODEL_PATH = 'ACCO-S11-62CM-R.obj';
  const MTL_PATH   = 'ACCO-S11-62CM-R.mtl';

  const canvas = document.getElementById('model3d-canvas');
  if (!canvas) return;

  // ---- RENDERER ----
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  // renderer.setClearColor(0xff0000, 1); // DEBUG: MUST SHOW RED BACKGROUND
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // ---- SCENE ----
  const scene = new THREE.Scene();

  // ---- CAMERA ----
  const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 5000 // increased far plain
  );
  camera.position.set(0, 0, 15); // increased distance from 5 to 15

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

  // ---- MATERIAL (Aluminium) ----
  const aluminiumMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.4,
    emissive: 0xffffff,
    emissiveIntensity: 0.35,
    envMap: envMap,
    envMapIntensity: 0.5,
  });

  // ---- LOAD MODEL ----
  let model = null;

  const mtlLoader = new MTLLoader();
  mtlLoader.load(MTL_PATH, function(materials) {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);

    objLoader.load(MODEL_PATH, function(object) {
      // Override materials
      object.traverse(function(child) {
        if (child.isMesh) {
          child.material = aluminiumMaterial;
        }
      });

      // Center and scale
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, Math.max(size.y, size.z));
      
      let scaleFactor = 1;
      if (maxDim > 0 && maxDim !== Infinity) {
        scaleFactor = 3.5 / maxDim; // Adjusted scale to fit comfortably without clipping
      }

      // Important: Translate object so its center is 0,0,0, then scale a wrapper.
      object.position.copy(center).multiplyScalar(-1);
      
      const wrapper = new THREE.Group();
      wrapper.add(object);
      wrapper.scale.setScalar(scaleFactor);
      
      // ROTATION FIX: CAD is inverted/upside down
      wrapper.rotation.x = Math.PI; // Flip 180 degrees
      wrapper.rotation.y = Math.PI; // Face the correct front

      const group = new THREE.Group();
      group.add(wrapper);
      scene.add(group);
      model = group;

      // Initial rotation
      model.rotation.x = 0.3;
      model.rotation.y = -0.5;

      setupScrollAnimations();
      animate();

      console.log('[ACCO 3D] Model loaded successfully');
    },
    function(xhr) {
      if (xhr.total) {
        console.log('[ACCO 3D] Loading: ' + (xhr.loaded / xhr.total * 100).toFixed(0) + '%');
      }
    },
    function(error) {
      console.error('[ACCO 3D] Error loading model:', error);
    });
  },
  undefined,
  function(error) {
    console.error('[ACCO 3D] Error loading MTL:', error);
    // Try loading OBJ without materials
    const objLoader = new OBJLoader();
    objLoader.load(MODEL_PATH, function(object) {
      object.traverse(function(child) {
        if (child.isMesh) {
          child.material = aluminiumMaterial;
        }
      });
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      object.position.sub(center);
      object.scale.setScalar(2.5 / maxDim);
      const group = new THREE.Group();
      group.add(object);
      scene.add(group);
      model = group;
      model.rotation.x = 0.3;
      model.rotation.y = -0.5;
      setupScrollAnimations();
      animate();
      console.log('[ACCO 3D] Model loaded (no MTL)');
    });
  });

  // ---- SCROLL ANIMATIONS ----
  function setupScrollAnimations() {
    if (!model || typeof gsap === 'undefined') return;

    // SCENE 2: LIGHTNESS
    gsap.to(model.position, { x: 3, y: 0, ease: 'none', scrollTrigger: { trigger: '#scene-lightness', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.rotation, { y: Math.PI * -0.2, x: 0.1, ease: 'none', scrollTrigger: { trigger: '#scene-lightness', start: 'top bottom', end: 'center center', scrub: 1.5 } });

    // SCENE 3: AESTHETICS 
    gsap.to(model.position, { x: -3, y: 0, ease: 'none', scrollTrigger: { trigger: '#scene-aesthetics', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.rotation, { y: Math.PI * 0.8, x: 0.2, ease: 'none', scrollTrigger: { trigger: '#scene-aesthetics', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.scale, { x: 1.2, y: 1.2, z: 1.2, ease: 'none', scrollTrigger: { trigger: '#scene-aesthetics', start: 'top bottom', end: 'center center', scrub: 1.5 } });

    // SCENE 4: COMPARE
    gsap.to(model.position, { x: 3, y: -0.5, ease: 'none', scrollTrigger: { trigger: '#scene-compare', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.rotation, { y: Math.PI * 1.5, x: 0.1, ease: 'none', scrollTrigger: { trigger: '#scene-compare', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.scale, { x: 1, y: 1, z: 1, ease: 'none', scrollTrigger: { trigger: '#scene-compare', start: 'top bottom', end: 'center center', scrub: 1.5 } });

    // SCENE 5: TECH
    gsap.to(model.position, { x: -3, y: 0, ease: 'none', scrollTrigger: { trigger: '#scene-tech', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.rotation, { y: Math.PI * 2.2, x: 0.3, ease: 'none', scrollTrigger: { trigger: '#scene-tech', start: 'top bottom', end: 'center center', scrub: 1.5 } });

    // SCENE 6: AUDIENCE
    gsap.to(model.position, { x: 0, y: -1, ease: 'none', scrollTrigger: { trigger: '#scene-audience', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.rotation, { y: Math.PI * 3, x: -0.2, ease: 'none', scrollTrigger: { trigger: '#scene-audience', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.scale, { x: 1.1, y: 1.1, z: 1.1, ease: 'none', scrollTrigger: { trigger: '#scene-audience', start: 'top bottom', end: 'center center', scrub: 1.5 } });

    // SCENE 7: HISTORY
    gsap.to(model.position, { x: 2, y: 0, ease: 'none', scrollTrigger: { trigger: '#scene-history', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.rotation, { y: Math.PI * 3.8, x: 0.1, ease: 'none', scrollTrigger: { trigger: '#scene-history', start: 'top bottom', end: 'center center', scrub: 1.5 } });
    gsap.to(model.scale, { x: 0.9, y: 0.9, z: 0.9, ease: 'none', scrollTrigger: { trigger: '#scene-history', start: 'top bottom', end: 'center center', scrub: 1.5 } });

    // SCENE 8: CTA
    gsap.to(model.position, { x: 0, y: 3, ease: 'none', scrollTrigger: { trigger: '#scene-cta', start: 'top bottom', end: 'top center', scrub: 1.5 } });
    gsap.to(model.scale, { x: 0.5, y: 0.5, z: 0.5, ease: 'none', scrollTrigger: { trigger: '#scene-cta', start: 'top bottom', end: 'top center', scrub: 1.5 } });
    gsap.to(canvas, { opacity: 0.1, ease: 'none', scrollTrigger: { trigger: '#scene-cta', start: 'top 50%', end: 'bottom bottom', scrub: 1 } });
  }

  // ---- MOUSE PARALLAX ----
  let mouseInfluenceX = 0;
  let mouseInfluenceY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseInfluenceX = (e.clientX / window.innerWidth - 0.5) * 0.15;
    mouseInfluenceY = (e.clientY / window.innerHeight - 0.5) * 0.08;
  });

  // ---- RENDER LOOP ----
  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      // Subtle constant auto-rotation
      model.rotation.y += 0.002;
      // Mouse parallax
      model.rotation.y += mouseInfluenceX * 0.02;
      model.rotation.x += mouseInfluenceY * 0.01;
    }

    renderer.render(scene, camera);
  }

  // ---- RESIZE ----
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

})();
