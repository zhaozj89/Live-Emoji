// require('../css/app.css');

// import * as D3NE from "./d3-node-editor";
// require('../css/d3-node-editor.css');

var numSocket = new D3NE.Socket("number", "number value", "hint");

var componentNum = new D3NE.Component("Number", {
   builder(node) {
      var out1 = new D3NE.Output("Number", numSocket);
      var numControl = new D3NE.Control('<input type="number">',
         (el, c) => {
            el.value = c.getData('num') || 1;

            function upd() {
               c.putData("num", parseFloat(el.value));
            }

            el.addEventListener("input", ()=>{
               upd();
               editor.eventListener.trigger("change");
            });
            el.addEventListener("mousedown", function(e){e.stopPropagation()});// prevent node movement when selecting text in the input field
           upd();
         }
      );

      return node.addControl(numControl).addOutput(out1);
   },
   worker(node, inputs, outputs) {
      outputs[0] = node.data.num;
   }
});

var componentAdd = new D3NE.Component("Add", {
   builder(node) {
      var inp1 = new D3NE.Input("Number", numSocket);
      var inp2 = new D3NE.Input("Number", numSocket);
      var out = new D3NE.Output("Number", numSocket);

      var numControl = new D3NE.Control(
         '<input readonly type="number">',
         (el, control) => {
            control.setValue = val => {
               el.value = val;
            };
         }
      );

      return node
         .addInput(inp1)
         .addInput(inp2)
         .addControl(numControl)
         .addOutput(out);
   },
   worker(node, inputs, outputs) {
      var sum = inputs[0][0] + inputs[1][0];
      editor.nodes.find(n => n.id == node.id).controls[0].setValue(sum);
      outputs[0] = sum;
   }
});

var menu = new D3NE.ContextMenu({
   Values: {
      Value: componentNum,
      Action: function() {
         alert("ok");
      }
   },
   Add: componentAdd
});

var container = document.getElementById("nodeEditor");
var components = [componentNum, componentAdd];
var editor = new D3NE.NodeEditor("demo@0.1.0", container, components, menu);

var nn = componentNum.newNode();
nn.data.num = 2;
var n1 = componentNum.builder(nn);
var n2 = componentNum.builder(componentNum.newNode());
var add = componentAdd.builder(componentAdd.newNode());

n1.position = [80, 200];
n2.position = [80, 400];
add.position = [500, 240];

editor.connect(n1.outputs[0], add.inputs[0]);
editor.connect(n2.outputs[0], add.inputs[1]);

editor.addNode(n1);
editor.addNode(n2);
editor.addNode(add);
//  editor.selectNode(tnode);

var engine = new D3NE.Engine("demo@0.1.0", components);

editor.eventListener.on("change", async function() {
   await engine.abort();
   await engine.process(editor.toJSON());
});

editor.view.zoomAt(editor.nodes);
editor.eventListener.trigger("change");
editor.view.resize();


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
