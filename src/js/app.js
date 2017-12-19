require('../css/app.css');
// require('../css/node_editor.css');
// import {createGraphics} from "./graphics";
import {createGraphics2} from "./graphics2";
import {createNodeEditor} from "./node_editor";
import {createVueUI} from "./vueui";

var height = window.innerHeight;

console.log(height);

createNodeEditor();
createGraphics2(height-150);
createVueUI();