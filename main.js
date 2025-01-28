import * as THREE from 'three';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

renderer.setClearColor(0x87CEEB);

// Object
const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial( {color : 0x32a852} ));
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

//Pop up Object
const cubePopup = new THREE.Mesh(new THREE.PlaneGeometry(2,1), new THREE.MeshBasicMaterial( {color:0xffffff} ));
cubePopup.position.set(3.25, 0.75, 1);
cubePopup.visible = false;
scene.add( cubePopup );

// Raycaster
const rayCaster = new THREE.Raycaster();

// Cursor
const mouse = new THREE.Vector2();


document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //Raycast
    rayCaster.setFromCamera(mouse, camera);
    console.log(mouse);
    const intersects = rayCaster.intersectObjects( scene.children );
    if (intersects.length > 0) {
        console.log("cast" + intersects[0].object.name);
        if (intersects[0].object.name == "cube") {
            cubePopup.visible = true;
        } else {
            cubePopup.visible = false;
        }
    } else {
        cubePopup.visible = false;
    }

});

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
let cameraRotateSensitivity = 0.1;
function cameraAnimate() {
    //console.log(mouse.x + " " + mouse.y);
    camera.rotation.y = - mouse.x * cameraRotateSensitivity;
    camera.rotation.x = mouse.y * cameraRotateSensitivity;
    // camera.lookAt(pointer);
}


// Render
function animate() {
    cameraAnimate();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);