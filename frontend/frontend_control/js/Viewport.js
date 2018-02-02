/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );

	container.add( new Viewport.Info( editor ) );

	//

	var renderer = null;

	var camera = editor.camera;
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;

	var objects = [];

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	selectionBox.visible = false;
	sceneHelpers.add( selectionBox );

	// object picking --> add control point

	let selectionPlane = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2, 0, 0 ), new THREE.MeshBasicMaterial( {
		color: 0x00ff00,
		opacity: 0.5,
		transparent: true,
		wireframe: true
	} ) );
	selectionPlane.visible = true;
	sceneHelpers.add( selectionPlane );

	let the_mode = null; // 'add_handles' / 'manipulate_handles'

	editor.signals.skinningChangeMode.add( function ( param ) {
		the_mode = param;
	} )

	let the_mesh = null;
	let SELECTED = null;
	let the_handles_objects = [];

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function getIntersect ( point, object ) {

		mouse.set( ( point.x * 2 ) - 1, -( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObject( object );

	}

	function getIntersects ( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, -( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();

	function getMousePosition ( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function onMouseDown ( event ) {

		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		if( the_mode==='add_handles' ) {
			if( ( editor.selected !== null ) && ( editor.selected instanceof THREE.Mesh ) ) {
				let intersects = getIntersect( onDownPosition, editor.selected );

				if ( intersects.length > 0 ) {
					the_mesh = editor.selected;

					let face = intersects[ 0 ].face;
					let candidate_vertex_indices = [ face.a, face.b, face.c ];
					let min_dist2, min_vertex_index;
					for ( let i = 0; i < candidate_vertex_indices.length; ++i ) {
						let vertex_index = candidate_vertex_indices[ i ];
						let vertex_position = the_mesh.geometry.vertices[ vertex_index ];

						let dist2 = numeric.norm2Squared( numeric.sub( [ onDownPosition.x, onDownPosition.y ], [ vertex_position.x, vertex_position.y ] ) );

						if ( min_dist2 === undefined || dist2 < min_dist2 ) {
							min_dist2 = dist2;
							min_vertex_index = vertex_index;
						}
					}

					let geometry = new THREE.BoxGeometry( 0.04, 0.04, 0.04 );
					let object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xaa33aa } ) );
					object.originalColorHex = object.material.color.getHex();
					object.material.depthTest = false;

					let handle_vertex = the_mesh.geometry.vertices[ min_vertex_index ];

					object.position.x = handle_vertex.x;
					object.position.y = handle_vertex.y;
					object.position.z = -10;

					sceneHelpers.add( object );

					the_handles_objects.push( object );
				}
				else {
					alert( 'cannot raycast this mesh' );
				}
			}
			else
				alert( 'Please select a mesh first!' );
		}
		else if( the_mode==='manipulate_handles' ) {
			let intersects = getIntersects( onDownPosition, the_handles_objects );
			if( intersects.length>0 ) {
				SELECTED = intersects[0].object;

				selectionPlane.position.copy( SELECTED.position );
			}
		}

		render();
	}

	function onMouseUp ( event ) {

	}

	function onMouseMove ( event ) {

	}

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'mouseup', onMouseUp, false );
	container.dom.addEventListener( 'mousemove', onMouseMove, false );


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

		selectionBox.visible = false;

		if ( object !== null && object !== scene && object !== camera ) {

			selectionBox.setFromObject( object );
			selectionBox.visible = true;

		}

		render();

	} );


	signals.geometryChanged.add( function ( object ) {

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( editor.selected === object ) {

			selectionBox.setFromObject( object );

		}

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

		var viewSize = container.dom.offsetHeight / 300;
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

		sceneHelpers.updateMatrixWorld();
		scene.updateMatrixWorld();

		renderer.render( scene, camera );

		if ( renderer instanceof THREE.RaytracingRenderer === false ) {

			renderer.render( sceneHelpers, camera );

		}

	}

	return container;

};
