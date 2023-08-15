const canvasSketch = require("canvas-sketch");

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

  // Setup
  const renderer = new THREE.WebGLRenderer({
    context,
    antialias: false,
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
  scene.background = new THREE.Color( 0xffffff );
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
  const bgTexture = textureLoader.load("src/texture.png");
  const bgGeometry = new THREE.PlaneGeometry(10.6666, 6); // asoect ration for the background image containined the h1 text
  const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.position.set(0, 0, -2);
  scene.add(bgMesh);

  const hdrEquirect = new THREE.RGBELoader().load(
    "src/empty_warehouse_01_2k.hdr",
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );

  const normalMapTexture = textureLoader.load("src/normal.jpg");
  normalMapTexture.wrapS = THREE.RepeatWrapping;
  normalMapTexture.wrapT = THREE.RepeatWrapping;
  normalMapTexture.repeat.set(options.normalRepeat, options.normalRepeat);

  const heartMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
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
    color: 0xffffff,
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


  let heartMesh = null;
  let swirlMesh = null;

  // Define variables to store the translation values
  let rotationX = 0;
  let rotationY = 0;
  let translationX = 0;
  let translationY = -10;

  // Add mousemove event listener to the document
  document.addEventListener("mousemove", updateModelPosition);

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
    heartMesh.rotation.x = rotationX;
    // heartMesh.rotation.y = rotationY;
    heartMesh.rotation.z = rotationZ;
    heartMesh.position.x = translationX / 2;
    heartMesh.position.y = translationY / 2;
    
    swirlMesh.rotation.y = swirlrotationX * 10;
  }

  // Load GLTF heart model
  new THREE.GLTFLoader().load("src/heart.glb", (gltf) => {
    
    const heartModel = gltf.scene.children.find((mesh) => mesh.name === "Heart");
    // Just copy the geometry from the loaded model
    const heartGeometry = heartModel.geometry.clone();

    // Adjust geometry to suit our scene
    heartGeometry.rotateX(Math.PI / 0.5);
    heartGeometry.rotateY(Math.PI / 0.5);
    heartGeometry.rotateZ(Math.PI / 0.65);
    heartGeometry.translate(5, -10, 0);

    // Create a new mesh and place it in the scene
    heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.scale.set(0.1, 0.1, 0.1);
    scene.add(heartMesh);

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      child.heartGeometry.dispose();
      child.heartMaterial.dispose();
    });

    heartMesh.rotation.x = rotationX;
    heartMesh.position.x = translationX;
    heartMesh.position.y = translationY;
  });

  // Load GLTF swirl model
  new THREE.GLTFLoader().load("src/swirl.glb", (gltf) => {
  
    const swirlModel = gltf.scene.children.find((mesh) => mesh.name === "swirl");
    // Just copy the geometry from the loaded model
    const swirlGeometry = swirlModel.geometry.clone();

    // Adjust geometry to suit our scene
    swirlGeometry.rotateX(Math.PI / 0.4);
    swirlGeometry.rotateY(Math.PI / 0.5);
    swirlGeometry.translate(0, 10, 5);

    // Create a new mesh and place it in the scene
    swirlMesh = new THREE.Mesh(swirlGeometry, swirlMaterial);
    swirlMesh.scale.set(0.02, 0.02, 0.02);
    scene.add(swirlMesh);

    // Discard the loaded model
    gltf.scene.children.forEach((child) => {
      child.swirlGeometry.dispose();
      child.swirlMaterial.dispose();
    });

    swirlMesh.rotation.x = rotationX;
    swirlMesh.position.x = translationX;
    swirlMesh.position.y = translationY;
  });

  // GUI
  // ---

  gui.add(options, "enableSwoopingCamera").onChange((val) => {
    controls.enabled = !val;
    controls.reset();
  });

  gui.add(options, "enableRotation").onChange(() => {
    if (heartMesh) heartMesh.rotation.set(0, 0, 0);
    if (swirlMesh) swirlMesh.rotation.set(0, 0, 0);
  });

  gui.addColor(options, "color").onChange((val) => {
    heartMaterial.color.set(val);
    swirlMaterial.color.set(val);
  });

  gui.add(options, "roughness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.roughness = val;
    swirlMaterial.roughness = val;
  });

  gui.add(options, "metalness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.metalness = val;
    swirlMaterial.metalness = val;
  });

  gui.add(options, "transmission", 0, 1, 0.01).onChange((val) => {
    heartMaterial.transmission = val;
    swirlMaterial.transmission = val;
  });

  gui.add(options, "ior", 1, 2.33, 0.01).onChange((val) => {
    heartMaterial.ior = val;
    swirlMaterial.ior = val;
  });

  gui.add(options, "reflectivity", 0, 1, 0.01).onChange((val) => {
    heartMaterial.reflectivity = val;
    swirlMaterial.reflectivity = val;
  });

  gui.add(options, "thickness", 0, 5, 0.1).onChange((val) => {
    heartMaterial.thickness = val;
    swirlMaterial.thickness = val;
  });

  gui.add(options, "envMapIntensity", 0, 3, 0.1).onChange((val) => {
    heartMaterial.envMapIntensity = val;
    swirlMaterial.envMapIntensity = val;
  });

  gui.add(options, "clearcoat", 0, 1, 0.01).onChange((val) => {
    heartMaterial.clearcoat = val;
    swirlMaterial.clearcoat = val;
  });

  gui.add(options, "clearcoatRoughness", 0, 1, 0.01).onChange((val) => {
    heartMaterial.clearcoatRoughness = val;
    swirlMaterial.clearcoatRoughness = val;
  });

  gui.add(options, "normalScale", 0, 5, 0.01).onChange((val) => {
    heartMaterial.normalScale.set(val, val);
    swirlMaterial.normalScale.set(val, val);
  });

  gui.add(options, "clearcoatNormalScale", 0, 5, 0.01).onChange((val) => {
    heartMaterial.clearcoatNormalScale.set(val, val);
    swirlMaterial.clearcoatNormalScale.set(val, val);
  });

  gui.add(options, "normalRepeat", 1, 4, 1).onChange((val) => {
    normalMapTexture.repeat.set(val, val);
    swirlMaterial.repeat.set(val, val);
  });
  
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
      hdrEquirect.dispose();
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);