import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';

// Creating a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Creating a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Creating a cube

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );

// scene.add( cube );


function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}




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


    scene.add(model);
}, undefined, function(error) {
    console.error(error);
});



// get length of model
if(model) {
    const box = new THREE.Box3().setFromObject(model);
    const length = box.max.x - box.min.x;
    // const height = box.max.y - box.min.y;
    // const width = box.max.z - box.min.z;

    console.log({length});
}



// Create center point
const centerPoint = new THREE.Vector3(2.5, 0, 0);
const axis = new THREE.Vector3(0, 1, 0);
const theta = Math.PI / 50;
const pointIsWorld = false;


camera.position.z = 5;
    
// Rendering the scene
function animate() {
    requestAnimationFrame( animate );

    if (model) {
        rotateAboutPoint(model, centerPoint, axis, theta, pointIsWorld);
    }
    renderer.render( scene, camera );
}


animate();