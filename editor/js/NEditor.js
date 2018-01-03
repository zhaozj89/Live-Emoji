"use strict";

var mouse = {
	currentInput: undefined
};

var NEditor = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'nEditor' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '300px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.8 );
	container.setBackgroundColor( '#222222' );
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


	// jQuery methods go here ...
	$( function() {
		$(menu.dom).draggable();
		$( "#menu" ).menu();
	} );

	// real codes
	var delay;
	var currentMode;
	var currentScript;
	var currentObject;




	// Node 1
	var node = new Node(mouse, {name: 'Node 1'});
	node.addInput(mouse, graphSVG, 'Value1');
	node.addInput(mouse, graphSVG, 'Value2');
	node.addInput(mouse, graphSVG, 'Value3');

	// Node 2
	var node2 = new Node(mouse, {name: 'Node 2', isRoot: true});
	node2.addInput(mouse, graphSVG, 'Text In');
	node2.addInput(mouse, graphSVG, 'Value 5');

	// Node 3
	var node3 = new Node(mouse, {name: 'Something Else'});
	node3.addInput(mouse, graphSVG, 'Color4');
	node3.addInput(mouse, graphSVG, 'Position');
	node3.addInput(mouse, graphSVG, 'Noise Octaves');

	// Node 4
	var node4 = new Node(mouse, {name: 'TextString'});
	node4.addInput(mouse, graphSVG, 'Value', 'input');

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





	//
	signals.editorCleared.add( function () {

		container.setDisplay( 'none' );

	} );

	signals.editNEditor.add( function ( object, script ) {

		currentObject = object;
		currentScript = script;

		container.setDisplay( '' );


	} );

	signals.nEditorRemoved.add( function ( script ) {

		if ( currentScript === script ) {

			container.setDisplay( 'none' );

		}

	} );

	return container;

};
