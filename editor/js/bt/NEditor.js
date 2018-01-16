"use strict";

let NEditor = function ( editor ) {

	let signals = editor.signals;

	let container = new UI.Panel();
	container.setId( 'nEditor' );
	container.setPosition( 'absolute' );
	container.setBackgroundColor( '#272822' );
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
	// let Runner = menu.addLi( 'Run' );

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

		// $( Runner ).click ( function () {
		// 	manager.compiler();
		// });
	} );

	// real codes
	// let delay;
	// let currentMode;
	let currentAST;
	let currentObject;

	//
	signals.editorCleared.add( function () {

		container.setDisplay( 'none' );

	} );

	signals.editAST.add( function ( object ) {

		currentObject = object;
		// currentAST = ast;

		container.setDisplay( '' );


	} );

	signals.astRemoved.add( function ( script ) {

		if ( currentScript === script ) {

			container.setDisplay( 'none' );

		}

	} );

	signals.trigger.add( function ( event ) {
		// evaluate ast
		let puppet = editor.selected;

		let ast = manager.getAST();

		// do nothing with ast now

		if( event['type'] === 'keyboard' ) {
			if( event['KEYCODE'] === 32 ) {
				// puppet.position.x++;
				// puppet.position.x += 0.5;
				// puppet.position.y += 0.5;
				puppet.rotation.z++;

				// puppet.position.x -= 0.5;
				// puppet.position.y -= 0.5;
			}
		}

		if( event['type'] === 'face' ) {
			if( event['faceinfo']['emotion'] === EMOTION_TYPE.HAPPY ) {
				puppet.rotation.z++;
			}
		}

		editor.signals.sceneGraphChanged.dispatch();

	} );
	return container;

};
