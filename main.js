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

//-----------------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------------//
// Object
const loader = new GLTFLoader();
let book, python, ccpp, java;

loader.load( 'Assets/model/room.glb', function ( gltf ) {

    scene.add( gltf.scene );
    gltf.scene.position.set(0, 0, 0);
    
}, undefined, function ( error ) {
    
    console.error( error );
    
} );

loader.load( 'Assets/model/book.glb', function ( gltf ) {

    book = gltf.scene;
    book.name = "introbook";
    scene.add(book);
    book.position.set(0.1, 4.1, -3.5);
    book.rotation.set(0.1,0,0);

    // book.position.set(0.1, 5, 3.25);
    // book.rotation.set(0.8,0,0);
    
}, undefined, function ( error ) {
    
    console.error( error );
    
} );

const bookHitbox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1), new THREE.MeshBasicMaterial({color: 0x32a852,transparent: true, opacity:0}));
bookHitbox.name = "introbook";
bookHitbox.position.set(0, 4.5, 0);
scene.add( bookHitbox );

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(4,3,2);

scene.add( light );

const light2 = new THREE.DirectionalLight(0xffffff, 5);
light2.position.set(1,8,2);

scene.add( light2 );
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
        // middleContent.innerHTML = '';
        canClick=true;
        
        gsap.to(book.position, {
            duration:1,
            x:0.1,
            y:4.1,
            z:-3.5
        });
        gsap.to(book.rotation, {
            duration:1,
            x:0.1,
            y:0,
            z:0,
        });

    }});
}

function openIntro() {
    gsap.to(book.position, {
        duration:1,
        x:0.1,
        y:5,
        z:3.25
    });
    gsap.to(book.rotation, {
        duration:1,
        x:0.8,
        y:0,
        z:0,
        onComplete: () => {
    
        console.log("open intro");
        middleContent.innerHTML = `
        <div id="Intro-Container">
                <div id="Intro-Img-Container">
                    <img src="Assets/img/portrait.jpg" alt="lame ahh portrait" id="Intro-Img">
                </div>
                <div id="Intro-Text-Container">
                    <p id="Intro-Text">
                            Hello
                            My name is Weerawit Pungpiboon
                            or Weem.<br>Well, I like creating cool thing!
                            <br>I used to make small game, write weird website. 
                            <br>Right now I'm studying computer engineer 
                            <br>So I hope I'll learn more cool stuff!!
                    </p>
                    <p>please ignore this image I'll change I promise</p>
                </div>
            </div>
        `;
        gsap.to("#middle", { duration: 2, opacity: 1 });
        
        }
    });
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
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,5,5);
    let cameraView = 1;
    
    function gotoExpAndProject() {
    gsap.to(camera.position, {
        duration:1.5,
        x:-3,
        y:5,
        z:0.5
    });
    gsap.to(camera.rotation, {
        duration:1.5,
        x:-0.5,
        y:0.8,
        z:0.375
    });
    
    cameraView = 0;
    console.log("gotopro");
}

function gotoIntro() {
    gsap.to(camera.position, {
        duration:1.5,
        x:0,
        y:5,
        z:5
    });
    gsap.to(camera.rotation, {
        duration:1.5,
        x:0,
        y:0,
        z:0
    });
    cameraView = 1;
    console.log("gointro");
}

function gotoMore() {
    gsap.to(camera.position, {
        duration:1.5,
        x:5,
        y:5,
        z:0
    });
    gsap.to(camera.rotation, {
        duration:1.5,
        x:0,
        y:-0.75,
        z:0
    });
    cameraView = 2;
    console.log("gomore");
}

function turnLeft() {
    console.log("left");
    if (cameraView == 1) {
        gotoExpAndProject();
        document.getElementById("left-button").querySelector(".Button-Text").textContent = "No more!";
        document.getElementById("right-button").querySelector(".Button-Text").textContent = "Introduction";
    } else if (cameraView == 2) {
        gotoIntro();
        document.getElementById("left-button").querySelector(".Button-Text").textContent = "Project";
        document.getElementById("right-button").querySelector(".Button-Text").textContent = "More about me";
    }
}

function turnRight() {
    console.log("right");
    if (cameraView == 0) {
        gotoIntro();
        document.getElementById("left-button").querySelector(".Button-Text").textContent = "Project";
        document.getElementById("right-button").querySelector(".Button-Text").textContent = "More about me";
    } else if (cameraView == 1) {
        gotoMore();
        document.getElementById("left-button").querySelector(".Button-Text").textContent = "Introduction";
        document.getElementById("right-button").querySelector(".Button-Text").textContent = "No more!";
    }
}

function cameraAnimate() {
    let lookSensitive = 0.1;
    //idk how to implement
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