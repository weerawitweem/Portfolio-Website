import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//-----------------------------------------------------------------------------------------------------------------------//
//Initialize scene
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "threejs-canvas";
document.body.append(renderer.domElement);
renderer.setClearColor(0x87CEEB);

// Raycaster
const rayCaster = new THREE.Raycaster();

// Cursor
const mouse = new THREE.Vector2();

// Loader
const loader = THREE.GLTFLoader();
//-----------------------------------------------------------------------------------------------------------------------//


//-----------------------------------------------------------------------------------------------------------------------//
// Object
const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial( {color : 0x32a852} ));
cube.canView = true;
cube.position.x = 2;
cube.name = "cube";
scene.add( cube );

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial( {color : 0x3246a8} ));
sphere.position.x = -2;
sphere.name = "sphere";
scene.add( sphere );

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(4,3,2);

scene.add( light );

const cubePopup = new THREE.Mesh(new THREE.PlaneGeometry(2,1), new THREE.MeshBasicMaterial( {color:0xffffff} ));
cubePopup.visible = false;
scene.add( cubePopup );
//-----------------------------------------------------------------------------------------------------------------------//


//-----------------------------------------------------------------------------------------------------------------------//
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const cameraRotateTarget = [-1, 0, 1];
let cameraRotateSensitivity = 0.1;
let cameraView = 1;
let cameraMove = {value:0};


function turnLeft() {
    if (cameraView == 1 || cameraView == 2) {
        gsap.to(cameraMove, {value:cameraRotateTarget[cameraView-1], duration:1});
        cameraView--;
    }
}

function turnRight() {
    if (cameraView == 0 || cameraView == 1) {
        gsap.to(cameraMove, {value:cameraRotateTarget[cameraView+1], duration:1});
        cameraView++;
    }
}

function cameraAnimate() {
    camera.rotation.y = - mouse.x * cameraRotateSensitivity - cameraMove.value;
    camera.rotation.x = ( mouse.y * cameraRotateSensitivity );
}
//-----------------------------------------------------------------------------------------------------------------------//


//-----------------------------------------------------------------------------------------------------------------------//
//Event
document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //Raycast
    rayCaster.setFromCamera(mouse, camera);
    const intersects = rayCaster.intersectObjects( scene.children );
    if (intersects.length > 0) {
        cubePopup.visible = true;
    } else {
        cubePopup.visible = false;
    }

});

document.addEventListener('click', (event) => {
    const intersects = rayCaster.intersectObjects( scene.children );
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.canView) {
            intersectedObject.view();
        }
    }
});

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add event listener to the button
document.addEventListener("DOMContentLoaded", function() {
    const leftbutton = document.getElementById("left-button");
    leftbutton.addEventListener("click", turnLeft);
    const rightbutton = document.getElementById("right-button");
    rightbutton.addEventListener("click", turnRight);
});
//-----------------------------------------------------------------------------------------------------------------------//


//-----------------------------------------------------------------------------------------------------------------------//
// Render
function animate() {
    cameraAnimate();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
//-----------------------------------------------------------------------------------------------------------------------//