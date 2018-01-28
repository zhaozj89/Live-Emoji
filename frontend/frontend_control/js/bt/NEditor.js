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
	let Objects = menu.addLi( 'Object' );
	let Composites = menu.addLi( 'Composites' );
	let Actions = menu.addLi( 'Actions' );
	let Runner = menu.addLi( 'Start' );

	/////////////////////////////////////////////////////////////////
	let menuTriggers = new UI.UList();
	let buttonKeyboard = menuTriggers.addLi( 'Keyboard' );
	let buttonTick = menuTriggers.addLi( 'Tick' );
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

	let nodeManager = new NodeManager( graphSVG, container.dom, signals );

	let startBehaviorTree = false;

	// jQuery methods go here ...
	$( function() {
		$( menu.dom ).draggable();
		$( "#menu" ).menu();

		$( buttonKeyboard ).click(function () {
			nodeManager.addNode( 'key_trigger' );
		});

		$( buttonTick ).click(function () {
			nodeManager.addNode( 'tick_trigger' );
		});

		$( buttonEmotion ).click(function () {
			nodeManager.addNode( 'emotion_trigger' );
		});

		$( buttonSelector ).click( function() {
			nodeManager.addNode( 'selector' );
		} );

		$( buttonSequence ).click( function() {
			nodeManager.addNode( 'sequence' );
		} );

		$( buttonTranslation ).click( function() {
			nodeManager.addNode( 'translation' );
		} );

		$( buttonRotation ).click( function() {
			nodeManager.addNode( 'rotation' );
		} );

		$( Objects ).click( function () {
			if( currentCharacter===null ) alert( 'Please select an object first!' );
			else nodeManager.addNode( 'object', currentCharacter );
		} );

		$( Runner ).click( function () {
			// currentAST = nodeManager.getAST();
			// console.log( currentAST );

			if( startBehaviorTree )
				Runner.children[0].textContent = 'Start';
			else
				Runner.children[0].textContent = ' Stop';

			startBehaviorTree = !startBehaviorTree;
		} );
	} );

	let currentCharacter;
	let currentAST = null;


	class ASTInstance {
		constructor() {}

		runAction( child, object ) {
			switch ( child['type'] ) {
				case 'translation': {
					// object.position.x
					break;
				}
				case 'rotation': {
					break;
				}
				default: {
					alert( 'Error in Behavior Tree!' );
					return;
				}
			}
		}

		runAST( child_0 ) {
			for( let i0=0; i0<child_0.children.length; ++i0 ) {

				let child_1 = child_0.children[i0];

				if( child_1['type']!=='object' ) {
					alert( 'Error in Behavior Tree!' );
					return;
				}
				else {
					let object = child_1['args'];

					for( let i1=0; i1<child_1.children.length; ++i1 ) {

						let child_2 = child_1.children[i1];


						switch ( child_2['type'] ) {
							case 'sequence': {
								for( let i2=0; i2<child_2.children.length; ++i2 ) {
									let child_3 = child_2.children[i2];
									this.runAction( child_3, object );
								}
							}

							case 'selector': {
								for( let i2=0; i2<child_2.children.length; ++i2 ) {
									let child_3 = child_2.children[i2];
									if( this.runAction( child_3, object )===true ) return;
								}
							}

							default: {
								alert( 'Error in Behavior Tree!' );
								return;
							}
						}
					}
				}
			}
		}
	}

	//
	signals.editorCleared.add( function () {
		container.setDisplay( 'none' );
	} );

	signals.editAST.add( function ( character ) {
		currentCharacter = character;
		container.setDisplay( '' );
	} );

	signals.trigger.add( function ( event ) {

		if( startBehaviorTree===false ) return;

		// evaluate ast
		let puppet = currentCharacter || editor.selected || null;

		if( puppet!==null && currentAST!==null ) return;


		// if( event['type']==='tick' ) {
		// 	for( let i=0; i<currentAST['tick_triggers'].length; ++i ) {
		// 		let ast = currentAST['tick_triggers'][i];
		//
		//
		// 	}
		// }

		if( event['type'] === 'keyboard' ) {
			nodeManager.runKeyTrigger( event['keycode'] );
		}


		// editor.signals.sceneGraphChanged.dispatch();

	} );



	// Tracking

	signals.followFace.add( function ( event ) {
		let puppet = currentCharacter || editor.selected || null;

		if( puppet!==null ) {
			puppet.position.x = event.x;
			puppet.position.y = event.y;

			editor.signals.sceneGraphChanged.dispatch();
		}

	} );

	signals.followEmotion.add( function ( emotion ) {
		let puppet = currentCharacter || editor.selected || null;

		if( puppet!==null ) {
			switch( emotion ) {
				case EMOTION_TYPE.HAPPY:
					emotion = 'happy';
					break;
				case EMOTION_TYPE.SAD:
					emotion = 'sad';
					break;
				case EMOTION_TYPE.ANGRY:
					emotion = 'angry';
					break;
				case EMOTION_TYPE.FEARFUL:
					emotion = 'fearful';
					break;
				case EMOTION_TYPE.SURPRISED:
					emotion = 'surprised';
					break;
				case EMOTION_TYPE.DISGUSTED:
					emotion = 'disgusted';
					break;
				case EMOTION_TYPE.NEUTRAL:
					emotion = 'neutral';
					break;
			}

			puppet.updateEmotion( emotion );
			editor.signals.sceneGraphChanged.dispatch();
		}

	} );


	return container;

};
