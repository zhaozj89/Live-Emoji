"use strict";

var LoadEmotionCMDJSONFile = function ( editor, filename ) {

	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if ( this.readyState == 4 && this.status == 200 ) {
			let jsonFile = JSON.parse( this.responseText );

			editor.emotionCMDManager.fromJSON( jsonFile );

			editor.emotionCMDManager.cleanSVG();

			for ( let prop in editor.emotionCMDManager.allSerializedCMDs ) {

				let info = editor.emotionCMDManager.allCMDs[ prop ].getInfo();

				let msg = {
					'info': info,
					'nodeString': editor.emotionCMDManager.allSerializedCMDs[ prop ]
				};

				editor.signals.saveEmotionCMD.dispatch( msg );
			}
		}
	};

	xhr.open( 'GET', './asset/' + filename, true );
	xhr.send();
}

var NEditor = function ( editor ) {

	let signals = editor.signals;

	let container = new UI.Panel();
	container.setId( 'nEditor' );
	container.setPosition( 'absolute' );
	container.setBackgroundColor( 'rgba(20,20,20,0.5)' );
	container.setDisplay( 'none' );

	container.dom.style.zIndex = "5";

	editor.node_editor = container;

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

		if( editor.emotionCMDManager.currentNodeSession!==null && editor.emotionCMDManager.currentNodeSession.triggerNode!==null ) {
			if( editor.currentEditedKey===editor.emotionCMDManager.currentNodeSession.triggerNode.key.getArg() ) {
				editor.emotionCMDManager.save();
				container.setDisplay( 'none' );
				return;
			}
		}

		if (confirm('Save the emotion command?')) {
			editor.emotionCMDManager.save();
		} else {
			// Do nothing!
		}

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

			///////////////////////////////////////////////////////////
			let outputPt = { x: event.pageX - 300, y: event.pageY - 84 };
			let val = NEditorCreatePath( inputPt, outputPt );
			path.setAttributeNS( null, 'd', val ); // namespace, name, value
			path.setAttribute( 'stroke-width', '5' );
			path.setAttribute( 'stroke', 'coral' );
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
	menu.setBackgroundColor( 'rgba(100, 100, 100, 0.8)' );
	menu.dom.style.borderRadius = '10px';
	menu.setWidth( '500px' );
	menu.setId( 'menu' );
	menu.addClass( 'nav' );
	menu.addClass( 'nav-pills' );

	menu.setPosition( 'absolute' );
	menu.setTop( '0px' );
	menu.setLeft( '200px' );
	container.add( menu );

	let Trigger = menu.addLi( 'Root+' );
	Trigger.classList.add( 'nav-item' );
	Trigger.style.margin = '20px';
	Trigger.style.fontSize = '20px';

	let Composite = menu.addLi( 'Sequence+' );
	Composite.classList.add( 'nav-item' );
	Composite.style.margin = '20px';
	Composite.style.fontSize = '20px';

	let Actions = menu.addLi( 'Action', 'nav-item dropdown', 'nav-link dropdown-toggle' );
	Actions.firstChild.setAttribute( 'data-toggle', 'dropdown' );
	Actions.style.margin = '12px';
	Actions.style.fontSize = '20px';

	let Tools = menu.addLi( 'Edit', 'nav-item dropdown', 'nav-link dropdown-toggle active' );
	Tools.firstChild.setAttribute( 'data-toggle', 'dropdown' );
	Tools.style.margin = '12px';
	Tools.style.fontSize = '20px';

	let menuActions = new UI.UList();
	menuActions.addClass( 'dropdown-menu' );
	let buttonVibration = menuActions.addLi( 'Vibration' );
	buttonVibration.classList.add( 'dropdown-item' );
	let buttonDanmaku = menuActions.addLi( 'Danmaku [Text]' );
	buttonDanmaku.classList.add( 'dropdown-item' );
	let buttonSwap = menuActions.addLi( 'Swap [Puppet]' );
	buttonSwap.classList.add( 'dropdown-item' );
	let buttonExplode = menuActions.addLi( 'Particle [Background]' );
	buttonExplode.classList.add( 'dropdown-item' );
	Actions.appendChild( menuActions.dom );

	let menuTools = new UI.UList();
	menuTools.addClass( 'dropdown-menu' );
	let cmdNew = menuTools.addLi( 'New' );
	cmdNew.classList.add( 'dropdown-item' );
	let cmdSave = menuTools.addLi( 'Save' );
	cmdSave.classList.add( 'dropdown-item' );
	let cmdClean = menuTools.addLi( 'Clean' );
	cmdClean.classList.add( 'dropdown-item' );
	let cmdImport = menuTools.addLi( 'Import' );
	cmdImport.classList.add( 'dropdown-item' );
	let cmdExport = menuTools.addLi( 'Export' );
	cmdExport.classList.add( 'dropdown-item' );
	Tools.appendChild( menuTools.dom );

	Global_Graph_SVG = graphSVG;
	Global_NEditor_Container = container.dom;

	let emotionCMDManager = editor.emotionCMDManager;

	signals.editEmotionCMD.add( function () {
		if ( editor.emotionCMDManager.currentNodeSession === null ) emotionCMDManager.newCMD();
	} );

	let startBehaviorTree = true;

	$( function () {
		$( Trigger ).click( function () {
			if ( emotionCMDManager.currentNodeSession.triggerNode !== null ) {
				alert( 'Currently ONLY one trigger node is allowed!' );
				return;
			}
			emotionCMDManager.addNode( 'trigger' );
		} );

		$( Composite ).click( function () {
			emotionCMDManager.addNode( 'sequence' );
		} );


		$( buttonSwap ).click( function () {
			emotionCMDManager.addNode( 'swap' );
		} );

		$( buttonExplode ).click( function () {
			emotionCMDManager.addNode( 'particle' );
		} );

		$( buttonDanmaku ).click( function () {
			emotionCMDManager.addNode( 'danmaku' );
		} );

		$( buttonVibration ).click( function () {
			emotionCMDManager.addNode( 'viberation' );
		} );

		$( cmdNew ).click( function () {
			editor.emotionCMDManager.newCMD();
		} );

		$( cmdSave ).click( function () {
			editor.emotionCMDManager.save();
		} );

		$( cmdClean ).click( function () {
			editor.emotionCMDManager.cleanSVG();
			editor.emotionCMDManager.newCMD();
		} );

		let form = document.createElement( 'form' );
		form.style.display = 'none';
		document.body.appendChild( form );

		//

		let fileInput = document.createElement( 'input' );
		fileInput.type = 'file';
		fileInput.addEventListener( 'change', function ( event ) {

			let file = fileInput.files[ 0 ];

			let reader = new FileReader();

			reader.addEventListener( 'load', function ( event ) {
				let contents = event.target.result;

				let jsonFile = JSON.parse( contents );

				editor.emotionCMDManager.fromJSON( jsonFile );

				editor.emotionCMDManager.cleanSVG();

				for ( let prop in editor.emotionCMDManager.allSerializedCMDs ) {

					let info = editor.emotionCMDManager.allCMDs[ prop ].getInfo();

					let msg = {
						'info': info,
						'nodeString': editor.emotionCMDManager.allSerializedCMDs[ prop ]
					};

					editor.signals.saveEmotionCMD.dispatch( msg );
				}
			});
			reader.readAsText( file );
			form.reset();

		} );
		form.appendChild( fileInput );

		//

		$( cmdImport ).click( function () {

			fileInput.click();
		} );

		$( cmdExport ).click( function () {
			let text_file = JSON.stringify( editor.emotionCMDManager );

			function download ( text, name, type ) {
				let a = document.createElement( "a" );
				let file = new Blob( [ text ], { type: type } );
				a.href = URL.createObjectURL( file );
				a.download = name;
				a.click();
			}

			download( text_file, 'test.json', 'text/plain' );
		} );

	} );

	signals.editorCleared.add( function () {
		container.setDisplay( 'none' );
	} );

	signals.editEmotionCMD.add( function () {
		container.setDisplay( '' );
	} );

	// Keyboard trigger

	signals.keyboardTriggering.add( function ( event ) {

		if ( startBehaviorTree === false ) return;

		if ( event[ 'type' ] === 'keyboard' ) {
			let already_run = false;
			if ( editor.emotionCMDManager.currentNodeSession !== null && editor.emotionCMDManager.currentNodeSession.triggerNode !== null ) {
				if ( editor.emotionCMDManager.currentNodeSession.getInfo().key === event[ 'keycode' ] )
					already_run = true;
				editor.emotionCMDManager.currentNodeSession.run( event[ 'keycode' ] );

				//

				let info = {
					type: 'emotionCMD',
					cmd: JSON.stringify( editor.emotionCMDManager.currentNodeSession ),
					key: event[ 'keycode' ]
				};

				editor.signals.teacherSendInfo2Students.dispatch( info );

				//

			}

			if ( already_run === false ) {
				for ( let prop in editor.emotionCMDManager.allCMDs ) {
					if ( event[ 'keycode' ] === prop ) {
						editor.emotionCMDManager.allCMDs[ prop ].run( prop );

						//

						let info = {
							type: 'emotionCMD',
							cmd: JSON.stringify( editor.emotionCMDManager.allCMDs[ prop ] ),
							key: prop
						};

						editor.signals.teacherSendInfo2Students.dispatch( info );

						//
					}
				}
			}
		}
	} );


	// Tracking

	signals.followFace.add( function ( event ) {
		let puppet = editor.selected;

		if ( puppet !== null ) {
			if ( editor.facePositionMutex === false ) {
				puppet.position.x = event.x;
				puppet.position.y = event.y;

				editor.signals.sceneGraphChanged.dispatch();

				let info = {
					type: 'followFace',
					x: event.x,
					y: event.y
				};

				editor.signals.teacherSendInfo2Students.dispatch( info );
			}
		}
	} );

	signals.followLeftEye.add( function ( state ) {
		let puppet = editor.selected;

		if ( puppet !== null ) {

			puppet.updateLeftEye( state );
			editor.signals.sceneGraphChanged.dispatch();

			let info = {
				type: 'followLeftEye',
				state: state
			};

			editor.signals.teacherSendInfo2Students.dispatch( info );
		}
	} );

	signals.followRightEye.add( function ( state ) {
		let puppet = editor.selected;

		if ( puppet !== null ) {

			puppet.updateRightEye( state );
			editor.signals.sceneGraphChanged.dispatch();

			let info = {
				type: 'followRightEye',
				state: state
			};

			editor.signals.teacherSendInfo2Students.dispatch( info );
		}
	} );

	signals.followMouth.add( function ( state ) {
		let puppet = editor.selected;

		if ( puppet !== null ) {

			puppet.updateMouth( state );
			editor.signals.sceneGraphChanged.dispatch();

			let info = {
				type: 'followMouth',
				state: state
			};

			editor.signals.teacherSendInfo2Students.dispatch( info );
		}
	} );

	return container;

};
