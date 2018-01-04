"use strict";

let NEDITOR_MOUSE_INFO = {
	currentInput: undefined
};

let NEDITOR_SVG_CANVAS = null;

let NEDITOR_NODE_TYPE = {
  KEYBOARD_TRIGGER : 0,
  EMOTION_TRIGGER : 1
};

let NEDITOR_INPUT_TYPE = {
  INPUT : 0,
  CONNECTION : 1
};

function NEditorCreatePath( a, b ) {
  var diff = {
    x: b.x - a.x,
    y: b.y - a.y
  };

  var pathStr = [
    'M' + a.x + ',' + a.y + ' C',
    a.x + diff.x / 3 * 2 + ',' + a.y + ' ',
    a.x + diff.x / 3 + ',' + b.y + ' ',
    b.x + ',' + b.y
  ].join('');

  return pathStr;
}

var getFullOffset = function(el) {
  function innerRecursive (el){
  	let offset = {
  		top: el.offsetTop,
  		left: el.offsetLeft
  	};

  	if (el.offsetParent){
  		var parentOff = innerRecursive(el.offsetParent);
  		offset.top += parentOff.top;
  		offset.left += parentOff.left;
  	}

  	return offset;
  };

  let offset = innerRecursive(el);
  offset.top -= 32;
  return offset;
}


class NodeInput {
  constructor( options ) {
    this.name = '';
    this.type = '';

    for (var prop in options)
      if (this.hasOwnProperty(prop))
        this[prop] = options[prop];

    this.node = undefined;

    this.domElement = document.createElement('div');
    this.domElement.textContent = this.name;
    this.domElement.title = this.name;

    this.domElement.classList.add('x-connection');
    this.domElement.classList.add('empty');

    var that = this;
    if (this.type === NEDITOR_INPUT_TYPE.INPUT){
      var input = document.createElement('input');
      Object.defineProperty(that, 'value', {
        get: function(){ return input.value; },
        set: function(val){ input.value = val },
        enumerable: true
      });
      this.domElement.textContent += ' ';
      this.domElement.appendChild(input);
    }

    this.path = document.createElementNS(NEDITOR_SVG_CANVAS.ns, 'path');
    this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
    this.path.setAttributeNS(null, 'stroke-width', '2');
    this.path.setAttributeNS(null, 'fill', 'none');
    NEDITOR_SVG_CANVAS.appendChild(this.path);

    this.domElement.onclick = function(event){
      if (NEDITOR_MOUSE_INFO.currentInput){
        if (NEDITOR_MOUSE_INFO.currentInput.path.hasAttribute('d'))
          NEDITOR_MOUSE_INFO.currentInput.path.removeAttribute('d');
        if (NEDITOR_MOUSE_INFO.currentInput.node){
          NEDITOR_MOUSE_INFO.currentInput.node.detachInput(NEDITOR_MOUSE_INFO.currentInput);
          NEDITOR_MOUSE_INFO.currentInput.node = undefined;
        }
      }

      NEDITOR_MOUSE_INFO.currentInput = that;
      if (that.node){
        that.node.detachInput(that);
        that.domElement.classList.remove('filled');
        that.domElement.classList.add('empty');
      }

      event.stopPropagation();
    };
  }

  getAttachPoint() {
    var offset = getFullOffset(this.domElement);
    return {
      x: offset.left + this.domElement.offsetWidth - 2,
      y: offset.top + this.domElement.offsetHeight / 2
    };
  }
}

class Node {
	constructor( name, isRoot, value ) {
		this.name = name;
		this.isRoot = isRoot;
    this.value = value;

    this.inputs = [];
    this.attachedPaths = [];
    this.connected = false;

    this.domElement = document.createElement('div');
    this.domElement.classList.add('x-node');
    this.domElement.setAttribute('title', this.name);

    // here ONLY ONE output, refine it later
    let outputDom = document.createElement('span');
    outputDom.classList.add('x-output');
    outputDom.textContent = '';

    if ( this.isRoot )
      outputDom.classList.add('hide');

    this.domElement.appendChild(outputDom);

    var that = this;
    outputDom.onclick = function(event){
      if (NEDITOR_MOUSE_INFO.currentInput && !that.ownsInput(NEDITOR_MOUSE_INFO.currentInput)){
        that.connectTo(NEDITOR_MOUSE_INFO.currentInput);
        NEDITOR_MOUSE_INFO.currentInput = undefined;
      }
      event.stopPropagation();
    };
	}

  getOutputPoint() {
    var fchild = this.domElement.firstElementChild;
    var offset = getFullOffset(fchild);
    return {
      x: offset.left + fchild.offsetWidth / 2,
      y: offset.top + fchild.offsetHeight / 2
    };
  }

  addInput( name, type ) {
    var options = {};
    options.name = name;
    type === undefined ? true : options.type = type;

    var input = new NodeInput( options );
    this.inputs.push( input );
    this.domElement.appendChild( input.domElement );

    return input;
  }

  detachInput( input ){
    var index = -1;
    for (var i = 0; i < this.attachedPaths.length; i++){
      if (this.attachedPaths[i].input == input)
        index = i;
    }

    if (index >= 0){
      this.attachedPaths[index].path.removeAttribute('d');
      this.attachedPaths[index].input.node = undefined;
      this.attachedPaths.splice(index, 1);
    }

    if (this.attachedPaths.length <= 0)
      this.domElement.classList.remove('connected');
  }

  ownsInput( input ) {
    for (var i = 0; i < this.inputs.length; ++i){
      if (this.inputs[i] == input)
        return true;
    }

    return false;
  }

  updatePosition() {
    var outputPt = this.getOutputPoint();

    for (var i = 0; i < this.attachedPaths.length; i++){
      var inputPt = this.attachedPaths[i].input.getAttachPoint();
      var pathStr = NEditorCreatePath(inputPt, outputPt);
      this.attachedPaths[i].path.setAttributeNS(null, 'd', pathStr);
    }

    for (var j = 0; j < this.inputs.length; j++){
      if (this.inputs[j].node === undefined) continue;

      var inputPt = this.inputs[j].getAttachPoint();
      var outputPt = this.inputs[j].node.getOutputPoint();

      var pathStr = NEditorCreatePath(inputPt, outputPt);
      this.inputs[j].path.setAttributeNS(null, 'd', pathStr);
    }
  }

  connectTo( input ) {
    input.node = this;
    this.connected = true;
    this.domElement.classList.add('connected');

    input.domElement.classList.remove('empty');
    input.domElement.classList.add('filled');

    this.attachedPaths.push({
      input: input,
      path: input.path
    });

    var inputPt = input.getAttachPoint();
    var outputPt = this.getOutputPoint();

    var pathStr = NEditorCreatePath( inputPt, outputPt );
    input.path.setAttributeNS(null, 'd', pathStr);
  }

  moveTo( point ) {
    this.domElement.style.top = point.y + 'px';
    this.domElement.style.left = point.x + 'px';
    this.updatePosition();
  }

  initUI( my_container ) {
    var that = this;

    $(this.domElement).draggable({
      containment: 'window',
      cancel: '.x-connection, .x-output, .x-input',
      drag: function(e, ui){
        that.updatePosition();
      }
    });

    this.domElement.style.position = 'absolute';
    my_container.appendChild(this.domElement);
    this.updatePosition();
  }
}

class Selector extends Node {
	constructor () {
		super ( null, false, null );
	}
}

class NEditorNodeManager {
  constructor ( svgCanvas, container ) {
    NEDITOR_SVG_CANVAS = svgCanvas;
    this.container = container;

    this.nodes = new Array();
  }

  addNode ( options ) {

    let name = options['name'];
    let isRoot = options['isRoot'];
    let type = options['type'];

    switch ( type ) {
      case NEDITOR_NODE_TYPE.KEYBOARD_TRIGGER: {
        let node = new Node( 'Keyboard', true, null );
        node.addInput( 'Key', NEDITOR_INPUT_TYPE.INPUT );
        node.moveTo({x: 300, y: 80});
        node.initUI(this.container);

        this.nodes.push( node );
        break;
      }

      case NEDITOR_NODE_TYPE.EMOTION_TRIGGER: {
        let node = new Node( 'Emotion', true, name );
        node.addInput( name, NEDITOR_INPUT_TYPE.CONNECTION );
        node.moveTo({x: 300, y: 80});
        node.initUI(this.container);

        this.nodes.push( node );
        break;
      }

      default:
        break;
    }
  }

  infer () {
    for(let i=0; i<this.nodes.length; ++i) {
      console.log( this.nodes[i].value );
      console.log('----------------------');
      for(let j=0; j<this.nodes[i].inputs.length; ++j) {
        console.log( this.nodes[i].inputs[j].value );
      }
    }
  }
}
