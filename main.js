import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

renderer.setClearColor(0x87CEEB);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial( {color : 0x32a852} ));
cube.position.x = 2;
scene.add( cube );

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial( {color : 0x3246a8} ));
sphere.position.x = -2;
scene.add( sphere );

let mouseX;
let mouseY;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth;
    mouseY = event.clientY / window.innerHeight;
});

function sphereAnimate() {
    console.log(mouseX + " " + mouseY);
    camera.position.x = mouseX - 0.5;
    camera.position.y = -mouseY + 0.5;
    camera.lookAt(0,0,0);
}

function animate() {
    sphereAnimate();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);