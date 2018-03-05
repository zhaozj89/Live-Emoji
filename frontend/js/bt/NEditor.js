"use strict";

var Global_Graph_SVG = null;
var Global_NEditor_Container = null;

class CMDManager {
	constructor () {
		this.ALL_DOM_IN_SVG = [];

		this.currentNodeSession = null;
	}

	newCMD () {
		this.cleanSVG ();

		let nodeSession = new NodeSession();
		this.currentNodeSession = nodeSession;
	}

	cleanSVG () {
		for(let i=0; i<this.ALL_DOM_IN_SVG.length; ++i) {
			this.ALL_DOM_IN_SVG[i].remove();
		}
		$(this.graphSVG).empty();
	}

	addNode( type ) {
		this.currentNodeSession.addNode( type );
	}

	toJSON () {
		return this.currentNodeSession.toJSON();
	}

	fromJSON ( state ) {
		this.currentNodeSession.fromJSON( state );
	}
}

var NEditor = function ( editor ) {

	let signals = editor.signals;

	let container = new UI.Panel();
	container.setId( 'nEditor' );
	container.setPosition( 'absolute' );
	container.setBackgroundColor( '#272822' );
	container.setDisplay( 'none' );

	container.dom.style.zIndex = "5";

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

	let graphSVG = ( function () {
		let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'position', 'absolute' );
		svg.setAttribute( 'z-index', 5 );
		svg.setAttribute( 'width', '100%' );
		svg.setAttribute( 'height', '100%' );
		svg.setAttribute( 'id', 'node-graph' );
		svg.ns = svg.namespaceURI;
		return svg;
	} )();

	let graphPanel = new UI.Element( graphSVG );
	container.add( graphPanel );

	graphSVG.onmousemove = function ( event ) {
		if ( NEDITOR_MOUSE_INFO.currentInput ) {
			let path = NEDITOR_MOUSE_INFO.currentInput.path;
			let inputPt = NEDITOR_MOUSE_INFO.currentInput.getAttachedPoint();
			let outputPt = { x: event.pageX, y: event.pageY - 68 };
			let val = NEditorCreatePath( inputPt, outputPt );
			path.setAttributeNS( null, 'd', val ); // namespace, name, value
		}
	};

	graphSVG.onclick = function ( event ) {
		if ( NEDITOR_MOUSE_INFO.currentInput ) {
			NEDITOR_MOUSE_INFO.currentInput.path.removeAttribute( 'd' );

			if ( NEDITOR_MOUSE_INFO.currentInput.node )
				NEDITOR_MOUSE_INFO.currentInput.node.detachInput( NEDITOR_MOUSE_INFO.currentInput );

			NEDITOR_MOUSE_INFO.currentInput = undefined;
		}
	};





	// menu
	let menu = new UI.UList();
	menu.setId( 'menu' );
	menu.addLi( 'Modules', 'ui-state-disabled' );

	let Trigger = menu.addLi( 'Trigger' );
	let Objects = menu.addLi( 'Object' );
	let Composite = menu.addLi( 'Composite' );
	let Actions = menu.addLi( 'Action' );
	let Runner = menu.addLi( 'Start' );

	let Newer = menu.addLi( 'New Command' );
	let Cleaner = menu.addLi( 'Clean All Nodes' );
	let Test = menu.addLi( 'Test' );

	let menuObjects = new UI.UList();
	let characterObject = menuObjects.addLi( 'Character' );
	let textureObject = menuObjects.addLi( 'Texture' );
	let textObject = menuObjects.addLi( 'Text' );
	Objects.appendChild( menuObjects.dom );

	let menuActions = new UI.UList();
	let buttonSwap = menuActions.addLi( 'Swap' );
	let buttonParticle = menuActions.addLi( 'Texture Motion' );
	Actions.appendChild( menuActions.dom );

	menu.dom.style.position = 'absolute';
	menu.dom.style.left = '80px';
	menu.dom.style.top = '300px';
	container.add( menu );

	Global_Graph_SVG = graphSVG;
	Global_NEditor_Container = container.dom;

	let cmdManager = new CMDManager();

	let startBehaviorTree = false;

	$( function () {

		$( menu.dom ).draggable();
		$( "#menu" ).menu();

		$( Newer ).click(function (  ) {
			cmdManager.newCMD();
		});

		$( Cleaner ).click(function (  ) {
			cmdManager.cleanSVG();
		});

		$(Test).click(function (  ) {
			let res = JSON.stringify( cmdManager.toJSON() );
			console.log(res);

			cmdManager.fromJSON( JSON.parse(res) );
		});

		$( Trigger ).click( function () {
			cmdManager.addNode( 'trigger' );
		} );

		$( characterObject ).click( function () {
			cmdManager.addNode( 'character' );
		} );

		$( textureObject ).click( function () {
			cmdManager.addNode( 'texture' );
		} );

		$( textObject ).click( function () {
			cmdManager.addNode( 'text' );
		} );
		
		
		$( Composite ).click( function () {
			cmdManager.addNode( 'sequence' );
		} );
		

		$( buttonSwap ).click( function () {
			cmdManager.addNode( 'swap' );
		} );

		$( buttonParticle ).click( function (  ) {
			cmdManager.addNode( 'particle' );
		} );
		
		$( Runner ).click( function () {
			if ( startBehaviorTree )
				Runner.children[ 0 ].textContent = 'Start';
			else
				Runner.children[ 0 ].textContent = ' Stop';

			startBehaviorTree = !startBehaviorTree;

			signals.runBackground.dispatch( startBehaviorTree );


		} );
	} );

	let currentCharacter;
	// let currentAST = null;

	//
	signals.editorCleared.add( function () {
		container.setDisplay( 'none' );
	} );

	signals.editAST.add( function ( character ) {
		currentCharacter = character;
		container.setDisplay( '' );
	} );

	// signals.trigger.add( function ( event ) {
	//
	// 	if ( startBehaviorTree === false ) return;
	//
	// 	// evaluate ast
	// 	let puppet = currentCharacter || editor.selected || null;
	//
	// 	if ( puppet !== null && currentAST !== null ) return;
	//
	// 	if ( event[ 'type' ] === 'keyboard' ) {
	// 		nodeSession.runKeyTrigger( event[ 'keycode' ], editor.signals.sceneGraphChanged );
	// 	}
	//
	// } );


	// Tracking

	signals.followFace.add( function ( event ) {
		let puppet = currentCharacter || editor.selected || null;

		if ( puppet !== null ) {
			puppet.position.x = event.x;
			puppet.position.y = event.y;

			editor.signals.sceneGraphChanged.dispatch();
		}

	} );

	signals.followEmotion.add( function ( emotion ) {
		let puppet = currentCharacter || editor.selected || null;

		if ( puppet !== null ) {
			switch ( emotion ) {
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

	signals.followLeftEye.add( function ( state ) {
		let puppet = currentCharacter || editor.selected || null;

		if ( puppet !== null ) {

			puppet.updateLeftEye( state );
			editor.signals.sceneGraphChanged.dispatch();
		}
	} );

	signals.followRightEye.add( function ( state ) {
		let puppet = currentCharacter || editor.selected || null;

		if ( puppet !== null ) {

			puppet.updateRightEye( state );
			editor.signals.sceneGraphChanged.dispatch();
		}
	} );

	signals.followMouth.add( function ( state ) {
		let puppet = currentCharacter || editor.selected || null;

		if ( puppet !== null ) {

			puppet.updateMouth( state );
			editor.signals.sceneGraphChanged.dispatch();
		}
	} );

	return container;

};
