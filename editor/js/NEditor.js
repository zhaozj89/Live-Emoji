"use strict";

var svgCanvas = null;

var mouse = {
	currentInput: undefined
};

function createPath(a, b) {
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

var getFullOffset = function(el){
	var offset = {
		top: el.offsetTop,
		left: el.offsetLeft
	};

	if (el.offsetParent){
		var parentOff = getFullOffset(el.offsetParent);
		offset.top += parentOff.top;
		offset.left += parentOff.left;
	}

	return offset;
};

// node class
function Node(options){
	this.name = '';
	this.value = '';
	this.isRoot = false;

	for (var prop in options)
		if (this.hasOwnProperty(prop))
			this[prop] = options[prop];

	this.inputs = [];
	this.attachedPaths = [];
	this.connected = false;

	this.domElement = document.createElement('div');
	this.domElement.classList.add('x-node');
	this.domElement.setAttribute('title', this.name);

	var outputDom = document.createElement('span');
	outputDom.classList.add('x-output');
	outputDom.textContent = '';

	if (this.isRoot)
		outputDom.classList.add('hide');

	this.domElement.appendChild(outputDom);

	var that = this;
	outputDom.onclick = function(event){
		if (mouse.currentInput && !that.ownsInput(mouse.currentInput)){
			that.connectTo(mouse.currentInput);
			mouse.currentInput = undefined;
		}

		event.stopPropagation();
	};
}

Node.prototype = {
	getOutputPoint: function(){
		var fchild = this.domElement.firstElementChild;
		var offset = getFullOffset(fchild);
		return {
			x: offset.left + fchild.offsetWidth / 2,
			y: offset.top + fchild.offsetHeight / 2
		};
	},
	addInput: function(name, type){
		var options = {};
		options.name = name;
		type === undefined ? true : options.type = type;

		var input = new nodeInput(options);
		this.inputs.push(input);
		this.domElement.appendChild(input.domElement);

		return input;
	},
	detachInput: function(input){
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
	},
	ownsInput: function(input){
		for (var i = 0; i < this.inputs.length; i++){
			if (this.inputs[i] == input)
				return true;
		}

		return false;
	},
	updatePosition: function(){
		var outputPt = this.getOutputPoint();

		for (var i = 0; i < this.attachedPaths.length; i++){
			var inputPt = this.attachedPaths[i].input.getAttachPoint();
			var pathStr = createPath(inputPt, outputPt);
			this.attachedPaths[i].path.setAttributeNS(null, 'd', pathStr);
		}

		for (var j = 0; j < this.inputs.length; j++){
			if (this.inputs[j].node === undefined) continue;

			var inputPt = this.inputs[j].getAttachPoint();
			var outputPt = this.inputs[j].node.getOutputPoint();

			var pathStr = createPath(inputPt, outputPt);
			this.inputs[j].path.setAttributeNS(null, 'd', pathStr);
		}
	},
	connectTo: function(input){
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

		var pathStr = createPath(inputPt, outputPt);
		input.path.setAttributeNS(null, 'd', pathStr);
	},
	moveTo: function(point){
		this.domElement.style.top = point.y + 'px';
		this.domElement.style.left = point.x + 'px';
		this.updatePosition();
	},
	initUI: function(my_container){
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
};

// node input class
function nodeInput(options){

	if(svgCanvas===null){
		console.alert('Error! No svg canvas is defined');
	}

	this.name = '';
	this.type = 'connection';

	for (var prop in options)
		if (this.hasOwnProperty(prop))
			this[prop] = options[prop];

	this.node = undefined;

	this.domElement = document.createElement('div');
	this.domElement.textContent = this.name;
	this.domElement.title = this.name;

	this.domElement.classList.add('x-' + this.type);
	this.domElement.classList.add('empty');

	var that = this;
	if (this.type == 'input'){
		var input = document.createElement('input');
		Object.defineProperty(that, 'value', {
			get: function(){ return input.value; },
			set: function(val){ input.value = val },
			enumerable: true
		});
		this.domElement.textContent += ' ';
		this.domElement.appendChild(input);
	}

	this.path = document.createElementNS(svgCanvas.ns, 'path');
	this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
	this.path.setAttributeNS(null, 'stroke-width', '2');
	this.path.setAttributeNS(null, 'fill', 'none');
	svgCanvas.appendChild(this.path);

	if (this.type == 'connection'){
		this.domElement.onclick = function(event){
			if (mouse.currentInput){
				if (mouse.currentInput.path.hasAttribute('d'))
					mouse.currentInput.path.removeAttribute('d');
				if (mouse.currentInput.node){
					mouse.currentInput.node.detachInput(mouse.currentInput);
					mouse.currentInput.node = undefined;
				}
			}

			mouse.currentInput = that;
			if (that.node){
				that.node.detachInput(that);
				that.domElement.classList.remove('filled');
				that.domElement.classList.add('empty');
			}

			event.stopPropagation();
		};
	}
}

nodeInput.prototype = {
	getAttachPoint: function(){
		var offset = getFullOffset(this.domElement);
		return {
			x: offset.left + this.domElement.offsetWidth - 2,
			y: offset.top + this.domElement.offsetHeight / 2
		};
	}
};


var NEditor = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'nEditor' );
	container.setPosition( 'absolute' );
	container.setTop( '0px' );
	container.setRight( '300px' );
	// container.setBottom( '32px' );
	container.setBottom( '0px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.8 );
	container.setBackgroundColor( '#272822' );
	container.setDisplay( 'none' );

	var renderer;

	signals.rendererChanged.add( function ( newRenderer ) {

		renderer = newRenderer;

	} );

	var graphSVG = ( function () {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'position', 'absolute' );
		svg.setAttribute( 'z-index', 1 );
		svg.setAttribute( 'width', '100%' );
		svg.setAttribute( 'height', '100%' );
		svg.setAttribute( 'id', 'node-graph' );
		svg.ns = svg.namespaceURI;
		return svg;
	} )();

	var graphPanel = new UI.Element( graphSVG );
	container.add(graphPanel);

	svgCanvas = graphSVG;

	graphSVG.onmousemove = function(event) {
		if (mouse.currentInput){
			var path = mouse.currentInput.path;
			var inputPt = mouse.currentInput.getAttachPoint();
			var outputPt = {x: event.pageX, y: event.pageY};
			var val = createPath(inputPt, outputPt);
			path.setAttributeNS(null, 'd', val); // namespace, name, value
		}
	};

	graphSVG.onclick = function(event){
		if (mouse.currentInput){
			mouse.currentInput.path.removeAttribute('d');

			if (mouse.currentInput.node)
				mouse.currentInput.node.detachInput(mouse.currentInput);

			mouse.currentInput = undefined;
		}
	};

	// menu
	var menu = new UI.UList();
	menu.setId( 'menu' );
	menu.addLi( 'Package Module', 'ui-state-disabled' );

	var liEmotion = menu.addLi( 'Emotion' );
	var liSecondary = menu.addLi( 'Secondary Motion' );

	var menuEmotion = new UI.UList();
	menuEmotion.addLi( 'Happy' );
	menuEmotion.addLi( 'Angry' );

	var menuSecondary = new UI.UList();
	menuSecondary.addLi( 'Hair' );
	menuSecondary.addLi( '...' );

	liEmotion.appendChild( menuEmotion.dom );
	liSecondary.appendChild( menuSecondary.dom );

	menu.dom.style.position = 'absolute';
	menu.dom.style.left = '80px';
	menu.dom.style.top = '300px';
	container.add( menu );


	$( function() {
		$(menu.dom).draggable();
		$( "#menu" ).menu();
	} );

	// real codes
	var delay;
	var currentMode;
	var currentScript;
	var currentObject;


/*

	// Node 1
	var node = new Node({name: 'Node 1'});
	node.addInput('Value1');
	node.addInput('Value2');
	node.addInput('Value3');

	// Node 2
	var node2 = new Node({name: 'Node 2'});
	node2.addInput('Text In');
	node2.addInput('Value 5');

	// Node 3
	var node3 = new Node({name: 'Something Else'});
	node3.addInput('Color4');
	node3.addInput('Position');
	node3.addInput('Noise Octaves');

	// Node 4
	var node4 = new Node({name: 'TextString'});
	node4.addInput('Value', 'input');

	// Move to initial positions
	node.moveTo({x: 300, y: 80});
	node2.moveTo({x: 20, y: 70});
	node3.moveTo({x:150, y:150});
	node4.moveTo({x:150, y:20});

	// Add to DOM
	node.initUI(container.dom);
	node2.initUI(container.dom);
	node3.initUI(container.dom);
	node4.initUI(container.dom);

	// Connect Nodes
	node.connectTo(node3.inputs[0]);
	node3.connectTo(node2.inputs[1]);
	node4.connectTo(node2.inputs[0]);

	node4.inputs[0].value = 'Some String';


*/


	//
	signals.editorCleared.add( function () {

		container.setDisplay( 'none' );

	} );

	signals.editScript.add( function ( object, script ) {

		currentObject = object;
		currentScript = script;

		container.setDisplay( '' );


	} );

	signals.scriptRemoved.add( function ( script ) {

		if ( currentScript === script ) {

			container.setDisplay( 'none' );

		}

	} );

	return container;

};
