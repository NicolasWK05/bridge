import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls";

const canvasContainer = document.getElementById("canvas-container");

// Creating a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  parent.innerWidth / parent.innerHeight,
  0.1,
  1000
);
camera.position.z = 3.5;
camera.position.y = 0.5;
camera.rotation.x = -0.2;

// Scene background
scene.background = new THREE.Color("#1e1e21");

// Creating a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
canvasContainer.appendChild(renderer.domElement);

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

let model = undefined;

const loader = new GLTFLoader();
loader.load(
  "./assets/models/davinci_bridge/bridge4.gltf",
  function (gltf) {
    console.log({ gltf });
    model = gltf.scene;

    // Add the texture to the model
    model.traverse((o) => {
      if (o.isMesh) {
        console.log({ o });
        o.material = new THREE.MeshBasicMaterial({ map: o.material.map });
      }
    });

    // Scale the model down
    console.log(document.body.clientWidth);
    if (document.body.clientWidth < 600) {
      console.log("mobile");
      model.scale.set(0.5, 1, 0.5);
      camera.position.z = 4;
      camera.fov = 75.0;
      camera.updateProjectionMatrix();
      console.log(camera.fov);
    }

    // Adjust the position of the model
    const bbox = new THREE.Box3().setFromObject(model);
    const center = bbox.getCenter(new THREE.Vector3());
    model.position.sub(center);

    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(4, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Controls
// const controls = new OrbitControls( camera, renderer.domElement );
// controls.enableDamping = true;
// controls.dampingFactor = 0.1;

const centerPoint = new THREE.Vector3(0, 0, 0);
const axis = new THREE.Vector3(0, 1, 0);
const theta = 0.01;
const pointIsWorld = false;

// Rendering the scene
function animate() {
  requestAnimationFrame(animate);
  // controls.update();

  if (model) {
    rotateAboutPoint(model, centerPoint, axis, theta, pointIsWorld);
  }
  renderer.render(scene, camera);
}

animate();
