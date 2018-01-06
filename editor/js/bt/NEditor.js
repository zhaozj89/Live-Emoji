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

	var header = new UI.Panel();
	header.setPadding( '10px' );
	container.add( header );

	var title = new UI.Text().setColor( '#fff' );
	header.add( title );

	var buttonSVG = ( function () {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'width', 32 );
		svg.setAttribute( 'height', 32 );
		var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		path.setAttribute( 'd', 'M 12,12 L 22,22 M 22,12 12,22' );
		path.setAttribute( 'stroke', '#fff' );
		svg.appendChild( path );
		return svg;
	} )();

	var close = new UI.Element( buttonSVG );
	close.setPosition( 'absolute' );
	close.setTop( '3px' );
	close.setRight( '1px' );
	close.setCursor( 'pointer' );
	close.onClick( function () {

		container.setDisplay( 'none' );

	} );
	header.add( close );












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
			let outputPt = {x: event.pageX, y: event.pageY-68};
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
	// let Decorators = menu.addLi( 'Decorators' );
	// let Conditions = menu.addLi( 'Conditions' );
	let Actions = menu.addLi( 'Actions' );
	let Runner = menu.addLi( 'Run' );

	/////////////////////////////////////////////////////////////////
	let menuTriggers = new UI.UList();
	let buttonKeyboard = menuTriggers.addLi( 'Keyboard' );
	let buttonEmotion = menuTriggers.addLi( 'Emotion' );
	Triggers.appendChild( menuTriggers.dom );

	/////////////////////////////////////////////////////////////////
	let menuComposites = new UI.UList();
	let buttonSelector = menuComposites.addLi( 'Selector (OR)' );
	let buttonSequence = menuComposites.addLi( 'Sequence (AND)' );
	Composites.appendChild( menuComposites.dom );

	/////////////////////////////////////////////////////////////////
	let menuActions = new UI.UList();
	let buttonTranslation = menuActions.addLi( 'Translation' );
	let buttonRotation = menuActions.addLi( 'Rotation' );
	Actions.appendChild( menuActions.dom );

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
			manager.addNode({'type': NODE_TYPE.TRIGGER, 'value': 'keyboard'});
		});

		$( buttonEmotion ).click(function () {
			manager.addNode({'type': NODE_TYPE.TRIGGER, 'value': 'emotion'});
		});

		$( buttonSelector ).click( function() {
			manager.addNode( {'type': NODE_TYPE.COMPOSITE, 'value': 'selector'} );
		} );

		$( buttonSequence ).click( function() {
			manager.addNode( {'type': NODE_TYPE.COMPOSITE, 'value': 'sequence'} );
		} );

		$( buttonTranslation ).click( function() {
			manager.addNode( {'type': NODE_TYPE.ACTION, 'value': 'translation'} );
		} );

		$( buttonRotation ).click( function() {
			manager.addNode( {'type': NODE_TYPE.ACTION, 'value': 'rotation'} );
		} );

		$( Runner ).click ( function () {
			manager.compiler();
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
