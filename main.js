import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls';

const canvasContainer = document.getElementById('canvas-container');

// Creating a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// Creating a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
canvasContainer.appendChild( renderer.domElement );

let model = undefined;

const loader = new GLTFLoader();
loader.load('models/wooden_bridge/scene.gltf', function(gltf) {
    console.log(gltf.scene)
    model = gltf.scene;

    // Add the texture to the model
    model.traverse((o) => {
        if (o.isMesh) {
            o.material = new THREE.MeshBasicMaterial({ map: o.material.map });
        }
    });

    // Scale the model down
    model.scale.set(0.2, 0.2, 0.2);

    // Adjust the position of the model
    const bbox = new THREE.Box3().setFromObject(model);
    const center = bbox.getCenter(new THREE.Vector3());
    model.position.sub(center);


    scene.add(model);
}, undefined, function(error) {
    console.error(error);
});

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);


// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.1;
    
// Rendering the scene
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}


animate();