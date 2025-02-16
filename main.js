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
//const loader = THREE.GLTFLoader();
//-----------------------------------------------------------------------------------------------------------------------//


//-----------------------------------------------------------------------------------------------------------------------//
// Object
const loader = new GLTFLoader();

loader.load( 'Assets/model/room.glb', function ( gltf ) {

	scene.add( gltf.scene );
    gltf.scene.position.set(0, -6, 3);

}, undefined, function ( error ) {

	console.error( error );

} );

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshLambertMaterial( {color : 0x32a852} ));
cube1.name = "introbook";
cube1.position.x = 0;
scene.add( cube1 );

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshLambertMaterial( {color : 0x32a852} ));
cube2.name = "pythonProject";
cube2.position.x = 1;
scene.add( cube2 );

const cube3 = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshLambertMaterial( {color : 0x32a852} ));
cube3.name = "ccppProject";
cube3.position.x = 2;
scene.add( cube3 );

const cube4 = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshLambertMaterial( {color : 0x32a852} ));
cube4.name = "javaProject";
cube4.position.x = 3;
scene.add( cube4 );

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial( {color : 0x3246a8} ));
sphere.position.x = -2;
sphere.name = "sphere";
scene.add( sphere );

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(4,3,2);

scene.add( light );
//-----------------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------------//
// Middle Content
// State  <none> - <introduction> - <python project> - <c/c++ experience> - <java project>
let isViewing = false;
let canClick = true;
const middleContent = document.getElementById("middle");

function closePopup() {
    canClick=false;
    console.log("Close");
    gsap.to("#middle", { duration: 0.5, opacity: 0, onComplete: function() {
        middleContent.innerHTML = '';
        canClick=true;
    }});
    
}

function openIntro() {
    console.log("open intro");
    middleContent.innerHTML = `
        <img src="Assets/img/portrait.jpg" alt="lame ahh portrait" id="Intro-Img">
            <p id="Intro-Text">
                Hello
                My name is Weerawit Pungpiboon
                or Weem.<br>Well, I like creating cool thing!
                <br>I used to make small game, write weird website. 
                <br>Right now I'm studying computer engineer 
                <br>So I hope I'll learn more cool stuff!!
            </p>
            <p>please ignore this image I'll change I promise</p>
    `;
    gsap.to("#middle", { duration: 2, opacity: 1 });
}

function openPython() {
    console.log("open python");
    middleContent.innerHTML = `
        <p id="Python-Text"> 
            I have experience coding discord bot using python.<br>
            This bot simply get homework from discord server user <br>
            and will notify when it near due date.<br>
            This is my project for class when I was in 2nd year highschool.
        </p>
    `;
    gsap.to("#middle", { duration: 2, opacity: 1 });
}

function openCCPP() {
    console.log("open c/cpp");
}

function openJava() {
    console.log("open java");
    middleContent.innerHTML = `
        <p id="Java-Text">
            I'm still learning java so I do not have any finished project right now :/ 
        </p>
    `;
    gsap.to("#middle", { duration: 2, opacity: 1 });
}
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
    const computedStyle = window.getComputedStyle(middleContent);
    const opacity = computedStyle.getPropertyValue('opacity');
    console.log(opacity);
});

document.addEventListener('click', (event) => {
    if (!canClick) return;
    const intersects = rayCaster.intersectObjects( scene.children );
    for (let i=0;i<intersects.length;i++) {
        console.log( intersects[i].name );
    }
    if (isViewing) {
        closePopup();
        isViewing = false;
    }
    else if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name == "introbook") {
            openIntro();
            isViewing = true;
        } else if (intersectedObject.name == "pythonProject") {
            openPython();
            isViewing = true;
        } else if (intersectedObject.name == "ccppProject") {
            openCCPP();
            isViewing = true;
        } else if (intersectedObject.name == "javaProject") {
            openJava();
            isViewing = true;
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