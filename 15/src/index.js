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

let heartMesh;
let swirlMesh;
let arrowMesh;
let pebbleaMesh;
let pebblebMesh;
let pebblecMesh;
let soundwaveMesh;
let brainMesh;

const TEXTURES = [
  'hero_white.png',
  'hero_white.jpg',
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

function rgbaToRgb(rgba) {
  // Use a regex to match rgba values
  const match = rgba.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([\d.]+)\)$/i);
  
  if (!match) {
      return rgba
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  return `rgb(${r},${g},${b})`;
}

function watchTargetBgColor(target, callback) {
  // Select the node that will be observed for mutations
  const targetNode = document.getElementById(target);

  // Options for the observer (which mutations to observe)
  
  // The configuration
  const config = {
    attributes: true,       // We're observing attribute changes
    attributeFilter: ['style']  // Specifically, changes to the "style" attribute
  };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'style') {
        const formatted = rgbaToRgb(mutation.target.style.backgroundColor)
        callback(formatted)
      }
    });
  });

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // initial
  callback(rgbaToRgb(targetNode.style.backgroundColor))
}

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
    ior: 1.94,
    reflectivity: 0.37,
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
    ior: 1.9,
    reflectivity: 0.35,
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
    metalness: 0.03,
    roughness: 0.3,
    transmission: 0.99,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    normalScale: 0.05,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,
    bloomThreshold: 0.0,
    bloomStrength: 0.0,
    bloomRadius: 0.0,
  };

  const brainOptions = {
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xff8e00,
    metalness: 0.03,
    roughness: 0.3,
    transmission: 0.99,
    ior: 1.3,
    reflectivity: 0.2,
    thickness: 5,
    envMapIntensity: 1.5,
    clearcoat: 0.5,
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
  
  const brainMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf9f0e3,
    metalness: brainOptions.metalness,
    roughness: brainOptions.roughness,
    transmission: brainOptions.transmission,
    ior: brainOptions.ior,
    reflectivity: brainOptions.reflectivity,
    thickness: brainOptions.thickness,
    envMap: hdrEquirect,
    envMapIntensity: brainOptions.envMapIntensity,
    clearcoat: brainOptions.clearcoat,
    clearcoatRoughness: brainOptions.clearcoatRoughness,
    normalScale: new THREE.Vector2(brainOptions.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(brainOptions.clearcoatNormalScale),
  });

  // Define variables to store the translation values
  // Load GLTF heart model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/heart.glb`, (gltf) => {
    
    const heartModel = gltf.scene.children.find((mesh) => mesh.name === "Heart");
    const heartMeshName = heartModel.name; // Store the mesh name in a variable
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
    heartMesh.visible = false;
  });

  // Load GLTF swirl model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/swirl.glb`, (gltf) => {
    const swirlModel = gltf.scene.children.find((mesh) => mesh.name === "swirl");
    const swirlMeshName = swirlModel.name; // Store the mesh name in a variable
    // Just copy the geometry from the loaded model
    const swirlGeometry = swirlModel.geometry.clone();

    // Adjust geometry to suit our scene
    swirlGeometry.rotateX(Math.PI / 0.4);
    swirlGeometry.rotateY(Math.PI / 0.5);
    swirlGeometry.translate(-2, 10, 5);

    // Create a new mesh and place it in the scene
    swirlMesh = MODELS['swirl.glb'] = new THREE.Mesh(swirlGeometry, swirlMaterial);
    swirlMesh.scale.set(0.02, 0.02, 0.02);
    scene.add(swirlMesh);
    
    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.swirlGeometry) child.swirlGeometry.dispose();
      if (child.swirlMaterial) child.swirlMaterial.dispose();
    });
    swirlMesh.visible = false;
  });

  // Load GLTF arrow model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/arrow.glb`, (gltf) => {
    const arrowModel = gltf.scene.children.find((mesh) => mesh.name === "arrow");
    const arrowMeshName = arrowModel.name; // Store the mesh name in a variable
    // Just copy the geometry from the loaded model
    const arrowGeometry = arrowModel.geometry.clone();

    // Adjust geometry to suit our scene
    arrowGeometry.rotateX(Math.PI + -5.2);
    arrowGeometry.rotateY(Math.PI);
    arrowGeometry.rotateZ(Math.PI + -0.8);
    arrowGeometry.translate(-320, 0, 20);

    // Create a new mesh and place it in the scene
    arrowMesh = MODELS['arrow.glb'] = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowMesh.scale.set(0.009, 0.009, 0.009);
    scene.add(arrowMesh);
    

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.arrowGeometry) child.arrowGeometry.dispose();
      if (child.arrowMaterial) child.arrowMaterial.dispose();
    });
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
    pebbleaMesh.visible = false;
  });

  // Load GLTF pebbleb model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/pebble_b.glb`, (gltf) => {
    const pebblebModel = gltf.scene.children.find((mesh) => mesh.name === "pebble_b_remesh");
    const pebblebMeshName = pebblebModel.name; // Store the mesh name in a variable
    // Just copy the geometry from the loaded model
    const pebblebGeometry = pebblebModel.geometry.clone();

    // Adjust geometry to suit our scene
    pebblebGeometry.rotateX(Math.PI / 2);
    pebblebGeometry.rotateY(Math.PI / 4);
    pebblebGeometry.rotateZ(Math.PI / 2);
    pebblebGeometry.translate(150, 50, 50);

    // Create a new mesh and place it in the scene
    pebblebMesh = MODELS['pebble_b.glb'] = new THREE.Mesh(pebblebGeometry, pebblebMaterial);
    pebblebMesh.scale.set(0.01, 0.01, 0.01);
    scene.add(pebblebMesh);
    

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.pebblebGeometry) child.pebblebGeometry.dispose();
      if (child.pebblebMaterial) child.pebblebMaterial.dispose();
    });
    pebblebMesh.visible = false;
  });

  // Load GLTF pebblec model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/pebble_c.glb`, (gltf) => {
    const pebblecModel = gltf.scene.children.find((mesh) => mesh.name === "pebble_c_remesh001");
    const pebblecMeshName = pebblecModel.name; // Store the mesh name in a variable
    // Just copy the geometry from the loaded model
    const pebblecGeometry = pebblecModel.geometry.clone();

    // Adjust geometry to suit our scene
    pebblecGeometry.rotateX(Math.PI / 2);
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
    pebblecMesh.visible = false;
  });

  
  // Load GLTF soundwave model
  new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/soundwave.glb`, (gltf) => {
    const soundwaveModel = gltf.scene.children.find((mesh) => mesh.name === "soundwave");
    const soundwaveMeshName = soundwaveModel.name; // Store the mesh name in a variable
    // Just copy the geometry from the loaded model
    const soundwaveGeometry = soundwaveModel.geometry.clone();

    // Adjust geometry to suit our scene
    soundwaveGeometry.rotateX(Math.PI / 0.4);
    soundwaveGeometry.rotateY(Math.PI / 0.55);
    soundwaveGeometry.translate(130, -20, 5);

    // Create a new mesh and place it in the scene
    soundwaveMesh = MODELS['soundwave.glb'] = new THREE.Mesh(soundwaveGeometry, soundwaveMaterial);
    soundwaveMesh.scale.set(0.02, 0.02, 0.02);
    scene.add(soundwaveMesh);
    
    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      if (child.soundwaveGeometry) child.soundwaveGeometry.dispose();
      if (child.soundwaveMaterial) child.soundwaveMaterial.dispose();
    });
    soundwaveMesh.visible = false;
  });

    // Load GLTF brain model
    new THREE.GLTFLoader().load(`${ASSET_SOURCE}assets/brain.glb`, (gltf) => {
      const brainModel = gltf.scene.children.find((mesh) => mesh.name === "brain");
      // Just copy the geometry from the loaded model
      const brainGeometry = brainModel.geometry.clone();
  
      // Adjust geometry to suit our scene
      brainGeometry.rotateX(Math.PI / 6);
      brainGeometry.rotateY(Math.PI / 2);
      brainGeometry.rotateZ(Math.PI);
      brainGeometry.translate(15, 0, 5);
  
      // Create a new mesh and place it in the scene
      brainMesh = MODELS['brain.glb'] = new THREE.Mesh(brainGeometry, brainMaterial);
      brainMesh.scale.set(0.12, 0.12, 0.12);
      scene.add(brainMesh);
      
      // Discard the loaded model
      gltf.scene.children.forEach((child) => {
        if (child.brainGeometry) child.brainGeometry.dispose();
        if (child.brainMaterial) child.brainMaterial.dispose();
      });
      brainMesh.visible = false;
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
    if (brainMesh) brainMesh.rotation.set(0, 0, 0);
  });

  gui.addColor(options, "color").onChange((val) => {
    heartMaterial.color.set(val);
    swirlMaterial.color.set(val);
    arrowMaterial.color.set(val);
    pebbleaMaterial.color.set(val);
    pebblebMaterial.color.set(val);
    pebblecMaterial.color.set(val);
    soundwaveMaterial.color.set(val);
    brainMaterial.color.set(val);
  });

  gui.add(options, "roughness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.roughness = val;
    swirlMaterial.roughness = val;
    arrowMaterial.roughness = val;
    pebbleaMaterial.roughness = val;
    pebblebMaterial.roughness = val;
    pebblecMaterial.roughness = val;
    soundwaveMaterial.roughness = val;
    brainMaterial.roughness = val;
  });

  gui.add(options, "metalness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.metalness = val;
    swirlMaterial.metalness = val;
    arrowMaterial.metalness = val;
    pebbleaMaterial.metalness = val;
    pebblebMaterial.metalness = val;
    pebblecMaterial.metalness = val;
    soundwaveMaterial.metalness = val;
    brainMaterial.metalness = val;
   
  });

  gui.add(options, "transmission", 0, 1, 0.01).onChange((val) => {
    heartMaterial.transmission = val;
    swirlMaterial.transmission = val;
    arrowMaterial.transmission = val;
    pebbleaMaterial.transmission = val;
    pebblebMaterial.transmission = val;
    pebblecMaterial.transmission = val;
    soundwaveMaterial.transmission = val;
    brainMaterial.transmission = val;
  });

  gui.add(options, "ior", 1, 2.33, 0.01).onChange((val) => {
    heartMaterial.ior = val;
    swirlMaterial.ior = val;
    arrowMaterial.ior = val;
    pebbleaMaterial.ior = val;
    pebblebMaterial.ior = val;
    pebblecMaterial.ior = val;
    soundwaveMaterial.ior = val;
    brainMaterial.ior = val;
  });

  gui.add(options, "reflectivity", 0, 1, 0.01).onChange((val) => {
    heartMaterial.reflectivity = val;
    swirlMaterial.reflectivity = val;
    arrowMaterial.reflectivity = val;
    pebbleaMaterial.reflectivity = val;
    pebblebMaterial.reflectivity = val;
    pebblecMaterial.reflectivity = val;
    soundwaveMaterial.reflectivity = val;
    brainMaterial.reflectivity = val;
  });

  gui.add(options, "thickness", 0, 5, 0.1).onChange((val) => {
    heartMaterial.thickness = val;
    swirlMaterial.thickness = val;
    arrowMaterial.thickness = val;
    pebbleaMaterial.thickness = val;
    pebblebMaterial.thickness = val;
    pebblecMaterial.thickness = val;
    soundwaveMaterial.thickness = val;
    brainMaterial.thickness = val;
  });

  gui.add(options, "envMapIntensity", 0, 3, 0.1).onChange((val) => {
    heartMaterial.envMapIntensity = val;
    swirlMaterial.envMapIntensity = val;
    arrowMaterial.envMapIntensity = val;
    pebbleaMaterial.envMapIntensity = val;
    pebblebMaterial.envMapIntensity = val;
    pebblecMaterial.envMapIntensity = val;
    soundwaveMaterial.envMapIntensity = val;
    brainMaterial.envMapIntensity = val;
  });

  gui.add(options, "clearcoat", 0, 1, 0.01).onChange((val) => {
    heartMaterial.clearcoat = val;
    swirlMaterial.clearcoat = val;
    arrowMaterial.clearcoat = val;
    pebbleaMaterial.clearcoat = val;
    pebblebMaterial.clearcoat = val;
    pebblecMaterial.clearcoat = val;
    soundwaveMaterial.clearcoat = val;
    brainMaterial.clearcoat = val;
  });

  gui.add(options, "clearcoatRoughness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.clearcoatRoughness = val;
    swirlMaterial.clearcoatRoughness = val;
    arrowMaterial.clearcoatRoughness = val;
    pebbleaMaterial.clearcoatRoughness = val;
    pebblebMaterial.clearcoatRoughness = val;
    pebblecMaterial.clearcoatRoughness = val;
    soundwaveMaterial.clearcoatRoughness = val;
    brainMaterial.clearcoatRoughness = val;
  });

  gui.add(options, "normalScale", 0, 5, 0.01).onChange((val) => {
    heartMaterial.normalScale.set(val, val);
    swirlMaterial.normalScale.set(val, val);
    arrowMaterial.normalScale.set(val, val);
    pebbleaMaterial.normalScale.set(val, val);
    pebblebMaterial.normalScale.set(val, val);
    pebblecMaterial.normalScale.set(val, val);
    soundwaveMaterial.normalScale.set(val, val);
    brainMaterial.normalScale.set(val, val);
  });

  gui.add(options, "clearcoatNormalScale", 0, 5, 0.01).onChange((val) => {
    heartMaterial.clearcoatNormalScale.set(val, val);
    swirlMaterial.clearcoatNormalScale.set(val, val);
    arrowMaterial.clearcoatNormalScale.set(val, val);
    pebbleaMaterial.clearcoatNormalScale.set(val, val);
    pebblebMaterial.clearcoatNormalScale.set(val, val);
    pebblecMaterial.clearcoatNormalScale.set(val, val);
    soundwaveMaterial.clearcoatNormalScale.set(val, val);
    brainMaterial.clearcoatNormalScale.set(val, val);
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

    // const swirlrotationX = Math.PI / 2 + mouse.y * 1;

    // Apply the new translation to the model
    if (heartMesh) {
      const hrotationX = Math.PI / 2 + mouse.y * 1;
      // const hrotationY = Math.PI / 2 + mouse.x * 1;
      const hrotationZ = Math.PI / 2 + mouse.x * 2;
      const htranslationX = mouse.x * 6;
      const htranslationY = 0 + mouse.y * 2;
      
      heartMesh.rotation.x = hrotationX;
      // heartMesh.rotation.y = hrotationY;
      heartMesh.rotation.z = hrotationZ;
      heartMesh.position.x = htranslationX / 2;
      heartMesh.position.y = htranslationY / 2;
    }
    
    if (swirlMesh) {
      const srotationX = Math.PI / 2 + mouse.y * 1;
      //const srotationY = Math.PI / 2 + mouse.x * 1;
      //const srotationZ = Math.PI / 2 + mouse.x * 2;
      const stranslationX = mouse.x * 6;
      const stranslationY = 0 + mouse.y * 2;

      swirlMesh.rotation.y = srotationX * 10;
      //swirlMesh.rotation.y = srotationY;
      //swirlMesh.rotation.z = srotationZ;
      swirlMesh.position.x = stranslationX / 2;
      swirlMesh.position.y = stranslationY / 2;
    }

    if (arrowMesh) {
      const arrotationX = Math.PI / 2 + mouse.y * 1;
      const arrotationY = Math.PI / 2 + mouse.x * 1;
      const arrotationZ = Math.PI / 2 + mouse.x * 1;
      const artranslationX = mouse.x * 6;
      const artranslationY = mouse.y * 2;
      
      arrowMesh.rotation.x = arrotationX / 8;
      arrowMesh.rotation.y = arrotationY / 8;
      arrowMesh.rotation.z = arrotationZ / 8;
      arrowMesh.position.x = artranslationX / 6;
      arrowMesh.position.y = artranslationY ;
    }

    if (pebbleaMesh) {
      const parotationX = Math.PI / 2 + mouse.y * 1;
      const parotationY = Math.PI / 2 + mouse.x * 1;
      const parotationZ = Math.PI / 2 + mouse.x * 2;
      const patranslationX = mouse.x * 6;
      const patranslationY = 0 + mouse.y * 2;

      pebbleaMesh.rotation.x = parotationX;
      pebbleaMesh.rotation.y = parotationY;
      pebbleaMesh.rotation.z = parotationZ;
      pebbleaMesh.position.x = patranslationX / 2;
      pebbleaMesh.position.y = patranslationY / 2;
    }

    if (pebblebMesh) {
      const pbrotationX = Math.PI / 2 + mouse.y * 1;
      const pbrotationY = Math.PI / 2 + mouse.x * 1;
      // const pbrotationZ = Math.PI / 2 + mouse.x * 2;
      const pbtranslationX = mouse.x * 6;
      const pbtranslationY = 0 + mouse.y * 2;

      //pebblebMesh.rotation.x = pbrotationX / 4;
      pebblebMesh.position.x = pbtranslationX / 8;
      pebblebMesh.position.y = pbtranslationY / 8;
    }

    if (pebblecMesh) {
      //const pcrotationX = Math.PI / 2 + mouse.y * 1;
      const pcrotationY = Math.PI / 2 + mouse.x * 1;
      //const pcrotationZ = Math.PI / 2 + mouse.x * 2;
      const pctranslationX = mouse.x * 6;
      const pctranslationY = 0 + mouse.y * 2;

      //pebblecMesh.rotation.x = pcrotationX;
      pebblecMesh.rotation.y = pcrotationY / 4;
      //pebblecMesh.rotation.z = pcrotationZ;
      pebblecMesh.position.x = pctranslationX / 8;
      pebblecMesh.position.y = pctranslationY / 8;
    }

    if (soundwaveMesh) {
      const swrotationX = Math.PI / 2 + mouse.y * 1;
      const swrotationY = Math.PI / 2 + mouse.x * 1;
      const swrotationZ = Math.PI / 2 + mouse.x * 2;
      const swtranslationX = mouse.x * 2;
      const swtranslationY = 0 + mouse.y * 2;

       soundwaveMesh.rotation.x = swrotationX / 4;
       soundwaveMesh.rotation.y = swrotationY / 4;
      // soundwaveMesh.rotation.z = swrotationZ;
       soundwaveMesh.position.x = swtranslationX / 2;
      // soundwaveMesh.position.y = swtranslationY / 2;
    }

    if (brainMesh) {
      const bwrotationX = Math.PI / 2 + mouse.y * 1;
      const bwrotationY = Math.PI / 2 + mouse.x * 1;
      const bwrotationZ = Math.PI / 2 + mouse.x * 2;
      const bwtranslationX = mouse.x * 2;
      const bwtranslationY = 0 + mouse.y * 2;

      brainMesh.rotation.x = bwrotationX;
      brainMesh.rotation.y = bwrotationY / 4;
      brainMesh.rotation.z = bwrotationZ / 4;
      brainMesh.position.x = bwtranslationX / 2;
      brainMesh.position.y = bwtranslationY / 2;
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
          // if (el.getAttribute('data-entered') !== 'true') console.log('ENTERING: ', modelKey, !!MODELS[modelKey])
          // el.style.backgroundColor = 'green';
          // el.style.opacity = '0.5';
          el.setAttribute('data-entered', 'true');
          if (MODELS[modelKey]) {
            MODELS[modelKey].visible = true;
          }
        } 
        else if (isExiting(el, isDown, exitOffset)) {
          // if (el.getAttribute('data-entered') !== 'false') console.log('EXITING: ', modelKey, !!MODELS[modelKey])
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

  watchTargetBgColor('canvas-wrapper', (color) => {
    scene.background = new THREE.Color( color );
  });

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
      brainMesh.geometry.dispose();
      brainMaterial.dispose();
      hdrEquirect.dispose();
      controls.dispose();
      renderer.dispose();
    },
  };
};



canvasSketch(sketch, settings);
console.log("threejs-glass initialized...")