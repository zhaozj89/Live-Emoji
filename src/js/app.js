import {createGraphics} from "./graphics";

require('../css/app.css');

import {createNodeEditor} from "./node_editor";

createNodeEditor();
createGraphics();

// canvas renderer

/*
var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("canvas").appendChild(renderer.domElement);
}

function animate() {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);

}
*/

// import * as BBW from "./bbw";

// BBW.init_3D(document.getElementById("canvas"), 480, 320);
// BBW.init_Widgets();
// BBW.needs_redisplay();

// init_Widgets();
// needs_redisplay();
