const canvasSketch = require("canvas-sketch");

const ASSET_SOURCE = window.location.protocol.includes('https') ? `https://spruce-cdn.s3.ap-southeast-2.amazonaws.com/sohn-threejs-glass/` : './'

// Import ThreeJS and assign it to global scope
// This way examples/ folder can use it too
const THREE = require("three");
global.THREE = THREE;

// Import extra THREE plugins
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/geometries/RoundedBoxGeometry.js");
require("three/examples/js/loaders/GLTFLoader.js");
require("three/examples/js/loaders/RGBELoader.js");
require("three/examples/js/postprocessing/EffectComposer.js");
require("three/examples/js/postprocessing/RenderPass.js");
require("three/examples/js/postprocessing/ShaderPass.js");
require("three/examples/js/postprocessing/UnrealBloomPass.js");
require("three/examples/js/shaders/LuminosityHighPassShader.js");
require("three/examples/js/shaders/CopyShader.js");

const { GUI } = require("dat.gui");

const settings = {
  animate: true,
  context: "webgl",
  resizeCanvas: false,
};

let lastScrollPosition = 0;
let initialized = false;

let heartMesh;
let swirlMesh;
let arrowMesh;
let pebbleaMesh;
let pebblebMesh;
let pebblecMesh;
let soundwaveMesh;

const OBJECTS = ['pebble_a.glb', 'pebble_b.glb', 'pebble_c.glb', 'swirl.glb', 'heart.glb', 'arrow.glb', 'soundwave.glb']
const TEXTURES = [
  'hero_white.png',
  'hero_black.png',
  '60_minute_thesis_white.png',
  '60_minute_thesis_black.png',
  'about_what_matters_white.png',
  'about_what_matters_black.png',
  'fresh_perspective_white.png',
  'fresh_perspective_black.png',
  'investment_for_good_white.png',
  'investment_for_good_black.png',
  'leadership_that_reflects_white.png',
  'leadership_that_reflects_black.png',
  'meet_8_minute_power_pitch_white.png',
  'meet_8_minute_power_pitch_black.png',
  'Provoking_the_paradigm_white.png',
  'Provoking_the_paradigm_black.png',
  'refacts_tomorrow_white.png',
  'refacts_tomorrow_black.png',
  'transform_tomorrow_white.png',
  'transform_tomorrow_black.png',
  'what_matters_white.png',
  'what_matters_black.png',
  'why_it_matters_white.png',
  'why_it_matters_black.png',
  '50_million.png',
  'dolton_house.png',
  'media.png',
  'speakers.png',
  'summary.png',
];
// Instances of THREE classes are kept in this object by asset filename
const MODELS = {};

const sketch = ({ context, canvas, width, height }) => {
  const gui = new GUI();
  const options = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.01,
    roughness: 0.1,
    transmission: 1,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };

  const swirlOptions = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.01,
    roughness: 0.1,
    transmission: 1,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };

  const arrowOptions = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.01,
    roughness: 0.1,
    transmission: 1,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };

  const pebbleaOptions = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.01,
    roughness: 0.1,
    transmission: 1,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };

  const pebblebOptions = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.01,
    roughness: 0.1,
    transmission: 1,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };

  const pebblecOptions = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.01,
    roughness: 0.1,
    transmission: 1,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };

  const soundwaveOptions = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.01,
    roughness: 0.1,
    transmission: 1,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };
  // Setup
  const renderer = new THREE.WebGLRenderer({
    context,
    antialias: false,
    alpha: true,
  });
  renderer.setClearColor(0xffffff, 1);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(0, 0, 5);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enabled = !options.enableSwoopingCamera;
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.enablePan = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  scene.background.a = 0.5;
  const renderPass = new THREE.RenderPass(scene, camera);
  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(width, height),
    options.bloomStrength,
    options.bloomRadius,
    options.bloomThreshold
  );

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);

  // Content
  const textureLoader = new THREE.TextureLoader();
  const bgGeometry = new THREE.PlaneGeometry(10.6666, 6); // asoect ration for the background image containined the h1 text

  function loadTextures() {
    for (const key of TEXTURES) {
      new THREE.TextureLoader().load(`${ASSET_SOURCE}assets/textures/${key}`, (texture) => {
        const bgMaterial = new THREE.MeshBasicMaterial({ map: texture });
        MODELS[key] = new THREE.Mesh(bgGeometry, bgMaterial);
        MODELS[key].position.set(0, 0, -2);
        MODELS[key].visible = false;        
        scene.add(MODELS[key]);
      });
    }
  }
  loadTextures()

  const hdrEquirect = new THREE.RGBELoader().load(
    `${ASSET_SOURCE}assets/empty_warehouse_01_2k.hdr`,
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );

  const normalMapTexture = textureLoader.load(`${ASSET_SOURCE}assets/textures/normal.jpg`);
  normalMapTexture.wrapS = THREE.RepeatWrapping;
  normalMapTexture.wrapT = THREE.RepeatWrapping;
  normalMapTexture.repeat.set(options.normalRepeat, options.normalRepeat);

  const heartMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: options.metalness,
    roughness: options.roughness,
    transmission: options.transmission,
    ior: options.ior,
    reflectivity: options.reflectivity,
    thickness: options.thickness,
    envMap: hdrEquirect,
    envMapIntensity: options.envMapIntensity,
    clearcoat: options.clearcoat,
    clearcoatRoughness: options.clearcoatRoughness,
    normalScale: new THREE.Vector2(options.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(options.clearcoatNormalScale),
  });

  const swirlMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: swirlOptions.metalness,
    roughness: swirlOptions.roughness,
    transmission: swirlOptions.transmission,
    ior: swirlOptions.ior,
    reflectivity: swirlOptions.reflectivity,
    thickness: swirlOptions.thickness,
    envMap: hdrEquirect,
    envMapIntensity: swirlOptions.envMapIntensity,
    clearcoat: swirlOptions.clearcoat,
    clearcoatRoughness: swirlOptions.clearcoatRoughness,
    normalScale: new THREE.Vector2(swirlOptions.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(swirlOptions.clearcoatNormalScale),
  });

  const arrowMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: arrowOptions.metalness,
    roughness: arrowOptions.roughness,
    transmission: arrowOptions.transmission,
    ior: arrowOptions.ior,
    reflectivity: arrowOptions.reflectivity,
    thickness: arrowOptions.thickness,
    envMap: hdrEquirect,
    envMapIntensity: arrowOptions.envMapIntensity,
    clearcoat: arrowOptions.clearcoat,
    clearcoatRoughness: arrowOptions.clearcoatRoughness,
    normalScale: new THREE.Vector2(arrowOptions.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(arrowOptions.clearcoatNormalScale),
  });

  const pebbleaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: pebbleaOptions.metalness,
    roughness: pebbleaOptions.roughness,
    transmission: pebbleaOptions.transmission,
    ior: pebbleaOptions.ior,
    reflectivity: pebbleaOptions.reflectivity,
    thickness: pebbleaOptions.thickness,
    envMap: hdrEquirect,
    envMapIntensity: pebbleaOptions.envMapIntensity,
    clearcoat: pebbleaOptions.clearcoat,
    clearcoatRoughness: pebbleaOptions.clearcoatRoughness,
    normalScale: new THREE.Vector2(pebbleaOptions.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(pebbleaOptions.clearcoatNormalScale),
  });

  const pebblebMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: pebblebOptions.metalness,
    roughness: pebblebOptions.roughness,
    transmission: pebblebOptions.transmission,
    ior: pebblebOptions.ior,
    reflectivity: pebblebOptions.reflectivity,
    thickness: pebblebOptions.thickness,
    envMap: hdrEquirect,
    envMapIntensity: pebblebOptions.envMapIntensity,
    clearcoat: pebblebOptions.clearcoat,
    clearcoatRoughness: pebblebOptions.clearcoatRoughness,
    normalScale: new THREE.Vector2(pebblebOptions.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(pebblebOptions.clearcoatNormalScale),
  });

  const pebblecMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: pebblecOptions.metalness,
    roughness: pebblecOptions.roughness,
    transmission: pebblecOptions.transmission,
    ior: pebblecOptions.ior,
    reflectivity: pebblecOptions.reflectivity,
    thickness: pebblecOptions.thickness,
    envMap: hdrEquirect,
    envMapIntensity: pebblecOptions.envMapIntensity,
    clearcoat: pebblecOptions.clearcoat,
    clearcoatRoughness: pebblecOptions.clearcoatRoughness,
    normalScale: new THREE.Vector2(pebblecOptions.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(pebblecOptions.clearcoatNormalScale),
  });

  const soundwaveMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: soundwaveOptions.metalness,
    roughness: soundwaveOptions.roughness,
    transmission: soundwaveOptions.transmission,
    ior: soundwaveOptions.ior,
    reflectivity: soundwaveOptions.reflectivity,
    thickness: soundwaveOptions.thickness,
    envMap: hdrEquirect,
    envMapIntensity: soundwaveOptions.envMapIntensity,
    clearcoat: soundwaveOptions.clearcoat,
    clearcoatRoughness: soundwaveOptions.clearcoatRoughness,
    normalScale: new THREE.Vector2(soundwaveOptions.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(soundwaveOptions.clearcoatNormalScale),
  });
  
  // Define variables to store the translation values
  let rotationX = 0;
  let rotationY = 0;
  let rotationZ = 0;
  let translationX = 0;
  let translationY = -10;

  // Load GLTF heart model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/heart.glb`, (gltf) => {
    
    const heartModel = gltf.scene.children.find((mesh) => mesh.name === "Heart");
    const heartMeshName = heartModel.name; // Store the mesh name in a variable
    console.log(heartMeshName);
    // Just copy the geometry from the loaded model
    const heartGeometry = heartModel.geometry.clone();

    // Adjust geometry to suit our scene
    heartGeometry.rotateX(Math.PI / 0.5);
    heartGeometry.rotateY(Math.PI / 0.5);
    heartGeometry.rotateZ(Math.PI / 0.65);
    heartGeometry.translate(5, -10, 0);

    // Create a new mesh and place it in the scene
    heartMesh = MODELS['heart.glb'] = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.scale.set(0.1, 0.1, 0.1);
    scene.add(heartMesh);

    // Discard the loaded model
    heartGeometry.dispose();
    heartMaterial.dispose();

    heartMesh.rotation.x = rotationX;
    heartMesh.position.x = translationX;
    heartMesh.position.y = translationY;
    heartMesh.visible = false;
  });

  // Load GLTF swirl model
  console.log('Loading swirl asset...')
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/swirl.glb`, (gltf) => {
    console.log('LOADED SWIRL ASSET', gltf)
    const swirlModel = gltf.scene.children.find((mesh) => mesh.name === "swirl");
    const swirlMeshName = swirlModel.name; // Store the mesh name in a variable
    console.log(swirlMeshName);
    // Just copy the geometry from the loaded model
    const swirlGeometry = swirlModel.geometry.clone();

    // Adjust geometry to suit our scene
    swirlGeometry.rotateX(Math.PI / 0.4);
    swirlGeometry.rotateY(Math.PI / 0.5);
    swirlGeometry.translate(0, 10, 5);

    // Create a new mesh and place it in the scene
    swirlMesh = MODELS['swirl.glb'] = new THREE.Mesh(swirlGeometry, swirlMaterial);
    swirlMesh.scale.set(0.02, 0.02, 0.02);
    scene.add(swirlMesh);
    
    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.swirlGeometry) child.swirlGeometry.dispose();
      if (child.swirlMaterial) child.swirlMaterial.dispose();
    });

    swirlMesh.rotation.x = rotationX;
    swirlMesh.position.x = translationX;
    swirlMesh.position.y = translationY;
    swirlMesh.visible = false;
  });

  // Load GLTF arrow model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/arrow.glb`, (gltf) => {
    const arrowModel = gltf.scene.children.find((mesh) => mesh.name === "arrow");
    const arrowMeshName = arrowModel.name; // Store the mesh name in a variable
    console.log(arrowMeshName);
    // Just copy the geometry from the loaded model
    const arrowGeometry = arrowModel.geometry.clone();

    // Adjust geometry to suit our scene
    arrowGeometry.rotateX(Math.PI / 0.4);
    arrowGeometry.rotateY(Math.PI / 0.5);
    arrowGeometry.translate(-100, -100, 5);

    // Create a new mesh and place it in the scene
    arrowMesh = MODELS['arrow.glb'] = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowMesh.scale.set(0.015, 0.015, 0.015);
    scene.add(arrowMesh);
    

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.arrowGeometry) child.arrowGeometry.dispose();
      if (child.arrowMaterial) child.arrowMaterial.dispose();
    });

    arrowMesh.rotation.x = rotationX;
    arrowMesh.position.x = translationX;
    arrowMesh.position.y = translationY;
    arrowMesh.visible = false;
  });

  // Load GLTF pebblea model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/pebble_a.glb`, (gltf) => {
    const pebbleaModel = gltf.scene.children.find((mesh) => mesh.name === "pebble_a");
    const pebbleaMeshName = pebbleaModel.name; // Store the mesh name in a variable
    // Just copy the geometry from the loaded model
    const pebbleaGeometry = pebbleaModel.geometry.clone();

    // Adjust geometry to suit our scene
    pebbleaGeometry.rotateX(Math.PI / 0.4);
    pebbleaGeometry.rotateY(Math.PI / 0.5);
    pebbleaGeometry.translate(0, 10, 5);

    // Create a new mesh and place it in the scene
    pebbleaMesh = MODELS['pebble_a.glb'] = new THREE.Mesh(pebbleaGeometry, pebbleaMaterial);
    pebbleaMesh.scale.set(0.01, 0.01, 0.01);
    scene.add(pebbleaMesh);
    

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.pebbleaGeometry) child.pebbleaGeometry.dispose();
      if (child.pebbleaMaterial) child.pebbleaMaterial.dispose();
    });

    pebbleaMesh.rotation.x = rotationX;
    pebbleaMesh.position.x = translationX;
    pebbleaMesh.position.y = translationY;
    pebbleaMesh.visible = false;
  });

  // Load GLTF pebbleb model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/pebble_b.glb`, (gltf) => {
    const pebblebModel = gltf.scene.children.find((mesh) => mesh.name === "pebble_b_remesh");
    const pebblebMeshName = pebblebModel.name; // Store the mesh name in a variable
    console.log(pebblebMeshName);
    // Just copy the geometry from the loaded model
    const pebblebGeometry = pebblebModel.geometry.clone();

    // Adjust geometry to suit our scene
    pebblebGeometry.rotateX(Math.PI / 0.75);
    pebblebGeometry.rotateY(Math.PI / 0.6);
    pebblebGeometry.translate(150, 0, 50);

    // Create a new mesh and place it in the scene
    pebblebMesh = MODELS['pebble_b.glb'] = new THREE.Mesh(pebblebGeometry, pebblebMaterial);
    pebblebMesh.scale.set(0.01, 0.01, 0.01);
    scene.add(pebblebMesh);
    

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.pebblebGeometry) child.pebblebGeometry.dispose();
      if (child.pebblebMaterial) child.pebblebMaterial.dispose();
    });

    pebblebMesh.rotation.x = rotationX;
    pebblebMesh.position.x = translationX;
    pebblebMesh.position.y = translationY;
    pebblebMesh.visible = false;
  });

  // Load GLTF pebblec model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/pebble_c.glb`, (gltf) => {
    const pebblecModel = gltf.scene.children.find((mesh) => mesh.name === "pebble_c_remesh001");
    const pebblecMeshName = pebblecModel.name; // Store the mesh name in a variable
    console.log(pebblecMeshName);
    // Just copy the geometry from the loaded model
    const pebblecGeometry = pebblecModel.geometry.clone();

    // Adjust geometry to suit our scene
    pebblecGeometry.rotateX(Math.PI / 2);
    //pebblecGeometry.rotateY(Math.PI / 2);
    pebblecGeometry.translate(-150, 10, 5);

    // Create a new mesh and place it in the scene
    pebblecMesh = MODELS['pebble_c.glb'] = new THREE.Mesh(pebblecGeometry, pebblecMaterial);
    pebblecMesh.scale.set(0.01, 0.01, 0.01);
    scene.add(pebblecMesh);
    

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.pebblecGeometry) child.pebblecGeometry.dispose();
      if (child.pebblecMaterial) child.pebblecMaterial.dispose();
    });

    pebblecMesh.rotation.x = rotationX;
    pebblecMesh.position.x = translationX;
    pebblecMesh.position.y = translationY;
    pebblecMesh.visible = false;
  });

  
  // Load GLTF soundwave model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/soundwave.glb`, (gltf) => {
    const soundwaveModel = gltf.scene.children.find((mesh) => mesh.name === "soundwave");
    const soundwaveMeshName = soundwaveModel.name; // Store the mesh name in a variable
    console.log(soundwaveMeshName);
    // Just copy the geometry from the loaded model
    const soundwaveGeometry = soundwaveModel.geometry.clone();

    // Adjust geometry to suit our scene
    soundwaveGeometry.rotateX(Math.PI / 0.4);
    soundwaveGeometry.rotateY(Math.PI / 0.5);
    soundwaveGeometry.translate(0, 10, 5);

    // Create a new mesh and place it in the scene
    soundwaveMesh = MODELS['soundwave.glb'] = new THREE.Mesh(soundwaveGeometry, soundwaveMaterial);
    soundwaveMesh.scale.set(0.02, 0.02, 0.02);
    scene.add(soundwaveMesh);
    

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.soundwaveGeometry) child.soundwaveGeometry.dispose();
      if (child.soundwaveMaterial) child.soundwaveMaterial.dispose();
    });

    soundwaveMesh.rotation.x = rotationX;
    soundwaveMesh.position.x = translationX;
    soundwaveMesh.position.y = translationY;
    soundwaveMesh.visible = false;
  });
 
  // Add the canvas with fixed position
  const canvasStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: -1, // Ensure the canvas stays above other elements
  };

  var canvasWrap = document.getElementById('canvas-wrapper');
  console.log(canvasWrap);
  Object.assign(canvas.style, canvasStyles);
  canvasWrap.appendChild(canvas);

  // Set body display to block
  document.body.style.display = 'block';

  // GUI
  // ---

  gui.add(options, "enableSwoopingCamera").onChange((val) => {
    controls.enabled = !val;
    controls.reset();
  });

  gui.add(options, "enableRotation").onChange(() => {
    if (heartMesh) heartMesh.rotation.set(0, 0, 0);
    if (swirlMesh) swirlMesh.rotation.set(0, 0, 0);
    if (arrowMesh) arrowMesh.rotation.set(0, 0, 0);
    if (pebbleaMesh) pebbleaMesh.rotation.set(0, 0, 0);
    if (pebblebMesh) pebblebMesh.rotation.set(0, 0, 0);
    if (pebblecMesh) pebblecMesh.rotation.set(0, 0, 0);
    if (soundwaveMesh) soundwaveMesh.rotation.set(0, 0, 0);
  });

  gui.addColor(options, "color").onChange((val) => {
    heartMaterial.color.set(val);
    swirlMaterial.color.set(val);
    arrowMaterial.color.set(val);
    pebbleaMaterial.color.set(val);
    pebblebMaterial.color.set(val);
    pebblecMaterial.color.set(val);
    soundwaveMaterial.color.set(val);
  });

  gui.add(options, "roughness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.roughness = val;
    swirlMaterial.roughness = val;
    arrowMaterial.roughness = val;
    pebbleaMaterial.roughness = val;
    pebblebMaterial.roughness = val;
    pebblecMaterial.roughness = val;
    soundwaveMaterial.roughness = val;
  });

  gui.add(options, "metalness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.metalness = val;
    swirlMaterial.metalness = val;
    arrowMaterial.metalness = val;
    pebbleaMaterial.metalness = val;
    pebblebMaterial.metalness = val;
    pebblecMaterial.metalness = val;
    soundwaveMaterial.metalness = val;
   
  });

  gui.add(options, "transmission", 0, 1, 0.01).onChange((val) => {
    heartMaterial.transmission = val;
    swirlMaterial.transmission = val;
    arrowMaterial.transmission = val;
    pebbleaMaterial.transmission = val;
    pebblebMaterial.transmission = val;
    pebblecMaterial.transmission = val;
    soundwaveMaterial.transmission = val;
  });

  gui.add(options, "ior", 1, 2.33, 0.01).onChange((val) => {
    heartMaterial.ior = val;
    swirlMaterial.ior = val;
    arrowMaterial.ior = val;
    pebbleaMaterial.ior = val;
    pebblebMaterial.ior = val;
    pebblecMaterial.ior = val;
    soundwaveMaterial.ior = val;
  });

  gui.add(options, "reflectivity", 0, 1, 0.01).onChange((val) => {
    heartMaterial.reflectivity = val;
    swirlMaterial.reflectivity = val;
    arrowMaterial.reflectivity = val;
    pebbleaMaterial.reflectivity = val;
    pebblebMaterial.reflectivity = val;
    pebblecMaterial.reflectivity = val;
    soundwaveMaterial.reflectivity = val;
  });

  gui.add(options, "thickness", 0, 5, 0.1).onChange((val) => {
    heartMaterial.thickness = val;
    swirlMaterial.thickness = val;
    arrowMaterial.thickness = val;
    pebbleaMaterial.thickness = val;
    pebblebMaterial.thickness = val;
    pebblecMaterial.thickness = val;
    soundwaveMaterial.thickness = val;
  });

  gui.add(options, "envMapIntensity", 0, 3, 0.1).onChange((val) => {
    heartMaterial.envMapIntensity = val;
    swirlMaterial.envMapIntensity = val;
    arrowMaterial.envMapIntensity = val;
    pebbleaMaterial.envMapIntensity = val;
    pebblebMaterial.envMapIntensity = val;
    pebblecMaterial.envMapIntensity = val;
    soundwaveMaterial.envMapIntensity = val;
  });

  gui.add(options, "clearcoat", 0, 1, 0.01).onChange((val) => {
    heartMaterial.clearcoat = val;
    swirlMaterial.clearcoat = val;
    arrowMaterial.clearcoat = val;
    pebbleaMaterial.clearcoat = val;
    pebblebMaterial.clearcoat = val;
    pebblecMaterial.clearcoat = val;
    soundwaveMaterial.clearcoat = val;
  });

  gui.add(options, "clearcoatRoughness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.clearcoatRoughness = val;
    swirlMaterial.clearcoatRoughness = val;
    arrowMaterial.clearcoatRoughness = val;
    pebbleaMaterial.clearcoatRoughness = val;
    pebblebMaterial.clearcoatRoughness = val;
    pebblecMaterial.clearcoatRoughness = val;
    soundwaveMaterial.clearcoatRoughness = val;
  });

  gui.add(options, "normalScale", 0, 5, 0.01).onChange((val) => {
    heartMaterial.normalScale.set(val, val);
    swirlMaterial.normalScale.set(val, val);
    arrowMaterial.normalScale.set(val, val);
    pebbleaMaterial.normalScale.set(val, val);
    pebblebMaterial.normalScale.set(val, val);
    pebblecMaterial.normalScale.set(val, val);
    soundwaveMaterial.normalScale.set(val, val);
  });

  gui.add(options, "clearcoatNormalScale", 0, 5, 0.01).onChange((val) => {
    heartMaterial.clearcoatNormalScale.set(val, val);
    swirlMaterial.clearcoatNormalScale.set(val, val);
    arrowMaterial.clearcoatNormalScale.set(val, val);
    pebbleaMaterial.clearcoatNormalScale.set(val, val);
    pebblebMaterial.clearcoatNormalScale.set(val, val);
    pebblecMaterial.clearcoatNormalScale.set(val, val);
    soundwaveMaterial.clearcoatNormalScale.set(val, val);
  });

  gui.add(options, "normalRepeat", 1, 4, 1).onChange((val) => {
    normalMapTexture.repeat.set(val, val);
    swirlMaterial.repeat.set(val, val);
    
  });

  
  // Function to handle mouse movement and update the model's position
  function updateModelPosition(event) {
    // Get the mouse position relative to the viewport
    const mouse = {
      x: (event.clientX / window.innerWidth) * 1 - 0.5,
      y: -(event.clientY / window.innerHeight) * 1 + 0.5,
    };

    // Update translation based on mouse position
    rotationX = Math.PI / 2 + mouse.y * 1;
    rotationY = Math.PI / 2 + mouse.x * 1;
    rotationZ = Math.PI / 2 + mouse.x * 2;
    translationX = mouse.x * 6;
    translationY = 0 + mouse.y * 2;

    swirlrotationX = Math.PI / 2 + mouse.y * 1;

    // Apply the new translation to the model
    if (heartMesh) {
      heartMesh.rotation.x = rotationX;
      // heartMesh.rotation.y = rotationY;
      heartMesh.rotation.z = rotationZ;
      heartMesh.position.x = translationX / 2;
      heartMesh.position.y = translationY / 2;
    }
    
    if (swirlMesh) {
      swirlMesh.rotation.y = swirlrotationX * 10;
      //swirlMesh.rotation.x = rotationX;
      //swirlMesh.rotation.y = rotationY;
      //swirlMesh.rotation.z = rotationZ;
      //swirlMesh.position.x = translationX / 2;
      //swirlMesh.position.y = translationY / 2;
    }

    if (arrowMesh) {
      arrowMesh.rotation.x = rotationX / 2;
      // arrowMesh.rotation.y = rotationY;
      // arrowMesh.rotation.z = rotationZ;
      arrowMesh.position.x = translationX / 2;
      arrowMesh.position.y = translationY / 2;
    }

    if (pebbleaMesh) {
      pebbleaMesh.rotation.x = rotationX;
      pebbleaMesh.rotation.y = rotationY;
      pebbleaMesh.rotation.z = rotationZ;
      pebbleaMesh.position.x = translationX / 2;
      pebbleaMesh.position.y = translationY / 2;
    }

    if (pebblebMesh) {
      // pebblebMesh.rotation.x = rotationX / 2;
       pebblebMesh.rotation.y = rotationY / 4;
      //pebblebMesh.rotation.z = rotationZ;
      pebblebMesh.position.x = translationX / 8;
      pebblebMesh.position.y = translationY / 8;
    }

    if (pebblecMesh) {
      //pebblecMesh.rotation.x = rotationX;
      pebblecMesh.rotation.y = rotationY / 4;
      //pebblecMesh.rotation.z = rotationZ;
      pebblecMesh.position.x = translationX / 8;
      pebblecMesh.position.y = translationY / 8;
    }

    if (soundwaveMesh) {
      soundwaveMesh.rotation.x = rotationX;
      soundwaveMesh.rotation.y = rotationY;
      soundwaveMesh.rotation.z = rotationZ;
      soundwaveMesh.position.x = translationX / 2;
      soundwaveMesh.position.y = translationY / 2;
    }
  }
  document.addEventListener("mousemove", updateModelPosition);


  function getScrollDirection() {
    var st = window.pageY || document.documentElement.scrollTop;
    let res;
    if (st > lastScrollPosition) {
      res = "down"
    } else if (st < lastScrollPosition) {
        res = "up"
    } // else was horizontal scroll
    lastScrollPosition = st <= 0 ? 0 : st; //
    return res
  }

  function isEntering(el, isDown, offset = 0) {
    const rect = el.getBoundingClientRect();
    // console.log('ENTERING?', el, `DOWN=${isDown} TOP=${rect.top} BOTTOM=${rect.bottom} WINDOW=${window.innerHeight}`)
    if (isDown) {
      return rect.top + offset <= window.innerHeight && rect.top > 0
    } else {
        return rect.bottom - offset >= 0 && rect.bottom < window.innerHeight && rect.top < 0
    }
  }

  function isExiting(el, isDown, offset = 0) {
    const rect = el.getBoundingClientRect();
    // console.log('EXITING?', el, `DOWN=${isDown} TOP=${rect.top} BOTTOM=${rect.bottom} WINDOW=${window.innerHeight}`)
    if (isDown) {
        return rect.top + offset < 0 && rect.bottom > 0 && rect.bottom <= window.innerHeight - offset;
    } else {
        return rect.top - offset > 0;
    }
  }

  function isInViewport(el, offsetTop = 0, offsetBottom = 0) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top + offsetTop < window.innerHeight &&
        rect.bottom - offsetBottom > 0
    );
  }

  const mapDataElements = (type) => {
    return [1,2,3].flatMap((n) => {
      const key = `data-threejs-${type}-${n}`;
      return [...document.querySelectorAll(`[${key}]`)].map((el) => ({ type, model: el.getAttribute(key), element: el }))
    }) 
  }

  // {type,model,element}[]
  const elementsWithAssetData = [
    ...mapDataElements('object'), 
    ...mapDataElements('texture'),
  ];
  const renderSectionModelsOnScroll = () => {
    const isDown = getScrollDirection() === 'down'

    const ENTER_PERCENT = 80
    const EXIT_PERCENT = 70

    const enterOffset = (window.innerHeight / 100 * ENTER_PERCENT) // e.g 1300 / 100 * 80 = 1040
    const exitOffset = window.innerHeight - (window.innerHeight / 100 * EXIT_PERCENT) // e.g 1300 - (1300 / 100 * 70) = 390
    elementsWithAssetData.forEach(({ type, model: modelKey, element: el }) => {
      if (isInViewport(el)) {
        // TODO: Canvas elements are hidden unless apply transparent
        el.style.backgroundColor = 'transparent'

        if (isEntering(el, isDown, enterOffset)) {
          if (el.getAttribute('data-entered') !== 'true') console.log('ENTERING: ', modelKey, !!MODELS[modelKey])
          // el.style.backgroundColor = 'green';
          // el.style.opacity = '0.5';
          el.setAttribute('data-entered', 'true');
          if (MODELS[modelKey]) {
            MODELS[modelKey].visible = true;
            if (modelKey === 'swirl.glb') {
              console.log('SWIRL IS VISIBLE', MODELS[modelKey].visible)
            }
          }
        } 
        else if (isExiting(el, isDown, exitOffset)) {
          if (el.getAttribute('data-entered') !== 'false') console.log('EXITING: ', modelKey, !!MODELS[modelKey])
          // el.style.backgroundColor = 'red';
          // el.style.opacity = '0.5';
          el.setAttribute('data-entered', 'false');
          if (MODELS[modelKey]) MODELS[modelKey].visible = false;
        }
      }
    });
  }
  document.addEventListener('scroll', renderSectionModelsOnScroll, false);
  window.addEventListener('resize', renderSectionModelsOnScroll, false);

  // Initial render of models in viewport
  setTimeout(() => {
    console.log('INITIAL RENDER.....')
    elementsWithAssetData.filter(({ element }) => isInViewport(element)).forEach(({ type, model: modelKey, element: el }) => {
      el.style.backgroundColor = 'transparent';
      el.setAttribute('data-entered', 'true');
      if (MODELS[modelKey]) MODELS[modelKey].visible = true;
    });
  // TODO: will need a way to hook into a models loaded event
  }, 1500)
    
  // Update
  // ------

  const update = (time, deltaTime) => {
    const ROTATE_TIME = 10; // Time in seconds for a full rotation
    const xAxis = new THREE.Vector3(1, 0, 0);
    const yAxis = new THREE.Vector3(0, 1, 0);
    const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2;
    const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2;

    if (options.enableRotation && mesh) {
      mesh.rotateOnWorldAxis(xAxis, rotateX);
      mesh.rotateOnWorldAxis(yAxis, rotateY);
    }

    if (options.enableSwoopingCamera) {
      camera.position.x = Math.sin((time / 10) * Math.PI * 2) * 2;
      camera.position.y = Math.cos((time / 10) * Math.PI * 2) * 2;
      camera.position.z = 4;
      camera.lookAt(scene.position);
    }
  };

  // Lifecycle
  return {
    resize({canvas, pixelRatio, viewportWidth, viewportHeight }) {
      const dpr = Math.min(pixelRatio, 2); // Cap DPR scaling to 2x

      canvas.width = viewportWidth * dpr;
      canvas.height = viewportHeight * dpr;
      canvas.style.width = viewportWidth + "px";
      canvas.style.height = viewportHeight + "px";

      renderer.setPixelRatio(dpr);
      renderer.setSize(viewportWidth, viewportHeight);

      composer.setPixelRatio(dpr);
      composer.setSize(viewportWidth, viewportHeight);

      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render({ time, deltaTime }) {
      controls.update();
      update(time, deltaTime);
      composer.render();
    },
    unload() {
      heartMesh.geometry.dispose();
      heartMaterial.dispose();
      swirlMesh.geometry.dispose();
      swirlMaterial.dispose();
      arrowMesh.geometry.dispose();
      arrowMaterial.dispose();
      pebbleaMesh.geometry.dispose();
      pebbleaMaterial.dispose();
      pebblebMesh.geometry.dispose();
      pebblebMaterial.dispose();
      pebblecMesh.geometry.dispose();
      pebblecMaterial.dispose();
      soundwaveMesh.geometry.dispose();
      soundwaveMaterial.dispose();
      hdrEquirect.dispose();
      controls.dispose();
      renderer.dispose();
    },
  };
};



canvasSketch(sketch, settings);
console.log("threejs-glass initialized...")