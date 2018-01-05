"use strict";

let NEditor = function ( editor ) {

	let signals = editor.signals;

	let container = new UI.Panel();
	container.setId( 'nEditor' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '300px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.8 );
	container.setBackgroundColor( '#222222' );
	container.setDisplay( 'none' );

	let renderer;

	signals.rendererChanged.add( function ( newRenderer ) {

		renderer = newRenderer;

	} );

	let graphSVG = ( function () {
		let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'position', 'absolute' );
		svg.setAttribute( 'z-index', 1 );
		svg.setAttribute( 'width', '100%' );
		svg.setAttribute( 'height', '100%' );
		svg.setAttribute( 'id', 'node-graph' );
		svg.ns = svg.namespaceURI;
		return svg;
	} )();

	let graphPanel = new UI.Element( graphSVG );
	container.add(graphPanel);

	graphSVG.onmousemove = function(event) {
		if (NEDITOR_MOUSE_INFO.currentInput){
			let path = NEDITOR_MOUSE_INFO.currentInput.path;
			let inputPt = NEDITOR_MOUSE_INFO.currentInput.getAttachedPoint();
			let outputPt = {x: event.pageX, y: event.pageY-32};
			let val = NEditorCreatePath(inputPt, outputPt);
			path.setAttributeNS(null, 'd', val); // namespace, name, value
		}
	};

	graphSVG.onclick = function(event){
		if (NEDITOR_MOUSE_INFO.currentInput){
			NEDITOR_MOUSE_INFO.currentInput.path.removeAttribute('d');

			if (NEDITOR_MOUSE_INFO.currentInput.node)
				NEDITOR_MOUSE_INFO.currentInput.node.detachInput(NEDITOR_MOUSE_INFO.currentInput);

			NEDITOR_MOUSE_INFO.currentInput = undefined;
		}
	};

	// menu
	let menu = new UI.UList();
	menu.setId( 'menu' );
	menu.addLi( 'Modules', 'ui-state-disabled' );

	let Triggers = menu.addLi( 'Trigger' );
	let Composites = menu.addLi( 'Composites' );
	let Decorators = menu.addLi( 'Decorators' );
	let Conditions = menu.addLi( 'Conditions' );
	let Actions = menu.addLi( 'Actions' );
	let Runner = menu.addLi( 'Run' );

	/////////////////////////////////////////////////////////////////
	let menuTriggers = new UI.UList();
	let buttonKeyboard = menuTriggers.addLi( 'Keyboard' );
	let buttonEmotion = menuTriggers.addLi( 'Emotion' );

	let menuEmotion = new UI.UList();
	let buttonHappy = menuEmotion.addLi( 'Happy' );
	let buttonAngry = menuEmotion.addLi( 'Angry' );

	Triggers.appendChild( menuTriggers.dom );
	buttonEmotion.appendChild( menuEmotion.dom );



	/////////////////////////////////////////////////////////////////
	let menuComposites = new UI.UList();
	let buttonSelector = menuComposites.addLi( 'Selector (OR)' );
	let buttonSequence = menuComposites.addLi( 'Sequence (AND)' );

	Composites.appendChild( menuComposites.dom );


	/////////////////////////////////////////////////////////////////

	menu.dom.style.position = 'absolute';
	menu.dom.style.left = '80px';
	menu.dom.style.top = '300px';
	container.add( menu );

	let manager = new NodeManager( graphSVG, container.dom );


	// jQuery methods go here ...
	$( function() {
		$( menu.dom ).draggable();
		$( "#menu" ).menu();

		$( buttonKeyboard ).click(function () {
			manager.addNode({'type': NEDITOR_NODE_TYPE.KEYBOARD_TRIGGER});
		});

		$( buttonHappy ).click(function () {
			manager.addNode({'name': 'Happy', 'type': NEDITOR_NODE_TYPE.EMOTION_TRIGGER});
		});

		$( buttonAngry ).click(function () {
			manager.addNode({'name': 'Angry', 'type': NEDITOR_NODE_TYPE.EMOTION_TRIGGER});
		});

		$( buttonSelector ).click( function() {
			manager.addNode( {'type': NEDITOR_NODE_TYPE.SELECTOR} );
		} );

		$( buttonSequence ).click( function() {
			manager.addNode( {'type': NEDITOR_NODE_TYPE.SEQUENCE} );
		} );

		$( Runner ).click ( function () {
			manager.infer();
		});
	} );

	// real codes
	let delay;
	let currentMode;
	let currentScript;
	let currentObject;


	// basic pattern
	// listen to a change event, excute the engine to transform visual logic to scirpt,
	// and add the script

	var InferanceEngine = function () {
		// if cannot reason, give up
		// otherwise, reason and add
	}

/*
	// Node 1
	let node = new Node(mouse, {name: 'Node 1'});
	node.addInput(mouse, graphSVG, 'Value1');
	node.addInput(mouse, graphSVG, 'Value2');
	node.addInput(mouse, graphSVG, 'Value3');

	// Node 2
	let node2 = new Node(mouse, {name: 'Node 2', isRoot: true});
	node2.addInput(mouse, graphSVG, 'Text In');
	node2.addInput(mouse, graphSVG, 'Value 5');

	// Node 3
	let node3 = new Node(mouse, {name: 'Something Else'});
	node3.addInput(mouse, graphSVG, 'Color4');
	node3.addInput(mouse, graphSVG, 'Position');
	node3.addInput(mouse, graphSVG, 'Noise Octaves');

	// Node 4
	let node4 = new Node(mouse, {name: 'TextString'});
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

*/



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
