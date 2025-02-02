import * as THREE from 'three';
import gsap from 'gsap';

//Initialize scene
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "threejs-canvas";
document.body.append(renderer.domElement);
renderer.setClearColor(0x87CEEB);


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

// function viewObject(object) {
//     let initPosition = object.position;
    
// }


// Raycaster
const rayCaster = new THREE.Raycaster();


// Cursor
const mouse = new THREE.Vector2();


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

    // Camera
    turnLeft = (cameraView == 1 || cameraView == 2) && inleftArea;
    turnRight = (cameraView == 0 || cameraView == 1) && inrightArea;
    console.log(turnLeft + " " + inleftArea + " " + (cameraView == 1 || cameraView == 2));
    if (mouse.x > 0.85) {
        inrightArea = true;
    } else if (mouse.x < -0.85) {
        inleftArea = true;
    } else {
        inleftArea = false;
        inrightArea = false;
    }
});

document.addEventListener('click', (event) => {
    const intersects = rayCaster.intersectObjects( scene.children );
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object; // Access the actual object
        if (intersectedObject.canView) {
            console.log("open");
        }
    }

    // Camera
    if (turnLeft) {
        gsap.to(cameraMove, {value:cameraRotateTarget[cameraView-1], duration:1});
        cameraView--;
    } else if (turnRight) {
        gsap.to(cameraMove, {value:cameraRotateTarget[cameraView+1], duration:1});
        cameraView++;
    }
});


// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const cameraRotateTarget = [-1, 0, 1];
let cameraRotateSensitivity = 0.1;
let cameraView = 1;
let inleftArea = false, inrightArea = false;
let turnLeft = false;
let turnRight = false;
let cameraMove = {value:0};


function cameraAnimate() {
    // console.log(mouse.x + " " + mouse.y);
    camera.rotation.y = - mouse.x * cameraRotateSensitivity - cameraMove.value;
    camera.rotation.x = ( mouse.y * cameraRotateSensitivity );
    // camera.lookAt(pointer);
}


// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Render
function animate() {
    cameraAnimate();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);