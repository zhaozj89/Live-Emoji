/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );
	container.dom.style.zIndex = '1';

	editor.viewport = container;

	//

	var renderer = null;

	var camera = editor.camera;
	var scene = editor.scene;

	var objects = [];

	// add background

	var spriteMap = new THREE.TextureLoader().load( "./asset/stage/background.png" );
	var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
	editor.backgroundSprite = new THREE.Sprite( spriteMaterial );

	$( function () {
		let left = editor.DEFAULT_CAMERA.left;
		let right = editor.DEFAULT_CAMERA.right;
		let top = editor.DEFAULT_CAMERA.top;
		let bottom = editor.DEFAULT_CAMERA.bottom;

		let ratio = ( right - left ) / ( bottom - top );
		editor.backgroundSprite.scale.set( 11 * ratio, 11, 1 );

		editor.backgroundSprite.position.z = 10;
	} );

	scene.add( editor.backgroundSprite );

	// signals

	signals.editorCleared.add( function () {

		render();

	} );

	signals.rendererChanged.add( function ( newRenderer ) {

		if ( renderer !== null ) {

			container.dom.removeChild( renderer.domElement );

		}

		renderer = newRenderer;

		renderer.autoClear = false;
		renderer.autoUpdateScene = false;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		container.dom.appendChild( renderer.domElement );

		render();

	} );

	signals.sceneGraphChanged.add( function () {

		render();

	} );

	signals.cameraChanged.add( function () {

		render();

	} );

	signals.objectSelected.add( function ( object ) {

		render();

	} );


	signals.geometryChanged.add( function ( object ) {

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( object instanceof THREE.PerspectiveCamera ) {

			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {

			editor.helpers[ object.id ].update();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );

	signals.helperAdded.add( function ( object ) {

		objects.push( object.getObjectByName( 'picker' ) );

	} );

	signals.helperRemoved.add( function ( object ) {

		objects.splice( objects.indexOf( object.getObjectByName( 'picker' ) ), 1 );

	} );

	signals.materialChanged.add( function ( material ) {

		render();

	} );

	// fog

	signals.sceneBackgroundChanged.add( function ( backgroundColor ) {

		scene.background.setHex( backgroundColor );

		render();

	} );

	var currentFogType = null;

	signals.sceneFogChanged.add( function ( fogType, fogColor, fogNear, fogFar, fogDensity ) {

		if ( currentFogType !== fogType ) {

			switch ( fogType ) {

				case 'None':
					scene.fog = null;
					break;
				case 'Fog':
					scene.fog = new THREE.Fog();
					break;
				case 'FogExp2':
					scene.fog = new THREE.FogExp2();
					break;

			}

			currentFogType = fogType;

		}

		if ( scene.fog instanceof THREE.Fog ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.near = fogNear;
			scene.fog.far = fogFar;

		} else if ( scene.fog instanceof THREE.FogExp2 ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.density = fogDensity;

		}

		render();

	} );

	//

	signals.windowResize.add( function () {

		// TODO: Move this out?

		var viewSize = container.dom.offsetHeight / 50;
		var aspectRatio = container.dom.offsetWidth / container.dom.offsetHeight;

		var left = -aspectRatio * viewSize / 2;
		var right = aspectRatio * viewSize / 2;
		var top = viewSize / 2;
		var bottom = -viewSize / 2;

		editor.DEFAULT_CAMERA.left = left;
		editor.DEFAULT_CAMERA.right = right;
		editor.DEFAULT_CAMERA.top = top;
		editor.DEFAULT_CAMERA.bottom = bottom;
		editor.DEFAULT_CAMERA.updateProjectionMatrix();

		// console.log( 'camera left: ' + left );
		// console.log( 'camera right: ' + right );
		// console.log( 'camera top: ' + top );
		// console.log( 'camera bottom: ' + bottom );

		camera.left = left;
		camera.right = right;
		camera.top = top;
		camera.bottom = bottom;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );

	//

	function render () {

		scene.updateMatrixWorld();

		renderer.render( scene, camera );

	}

	return container;

};
