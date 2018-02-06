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

	let selectionPlane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10, 0, 0 ), new THREE.MeshBasicMaterial( {
		color: 0x00ff00,
		opacity: 0.5,
		transparent: true,
		wireframe: true
	} ) );
	selectionPlane.visible = true;
	sceneHelpers.add( selectionPlane );

	let the_mode = null; // 'add_handles' / 'manipulate_handles'

	let skinning = new Skinning();

	editor.signals.skinningChangeMode.add( function ( mode ) {
		the_mode = mode;

		if( the_mode==='set_mesh' ) {
			if( ( editor.selected !== null ) && ( editor.selected instanceof THREE.Mesh ) ) {
				skinning.the_mesh = editor.selected;
				save_faces_and_undeformed_vertices();
				alert( 'Current mesh is: ' + skinning.the_mesh.name );
			}
			else
				alert( 'Please select a mesh first!' );
		}
		else if( the_mode==='manipulate_handles' ) {
			compute_bbw_weights();
		}
	} );


	let SELECTED = null;
	let INTERSECTED = null;

	let raycaster = new THREE.Raycaster();
	let mouse = new THREE.Vector2();

	// BBW
	function apply_linear_blend_skinning () {
		if ( skinning.the_weights === null ) return;

		let deformed_vertices = linear_blend_skin_2D( skinning.the_undeformed_vertices, skinning.the_weights, skinning.the_transforms );

		for ( let i = 0; i < skinning.the_mesh.geometry.vertices.length; ++i ) {
			skinning.the_mesh.geometry.vertices[ i ].x = deformed_vertices[ i ][ 0 ];
			skinning.the_mesh.geometry.vertices[ i ].y = deformed_vertices[ i ][ 1 ];
		}

		skinning.the_mesh.geometry.verticesNeedUpdate = true;
	}

	function compute_bbw_weights () {
		if ( skinning.the_handles.length === 0 ) return;

		skinning.the_weights = bbw( skinning.the_faces, skinning.the_undeformed_vertices, skinning.the_handles, 'bounded' );
		apply_linear_blend_skinning();

		alert( 'Finish calculating weights!' );
	}

	function save_faces_and_undeformed_vertices () {
		skinning.the_faces = [];
		for ( let i = 0; i < skinning.the_mesh.geometry.faces.length; ++i ) {
			skinning.the_faces.push( [
				skinning.the_mesh.geometry.faces[ i ].a,
				skinning.the_mesh.geometry.faces[ i ].b,
				skinning.the_mesh.geometry.faces[ i ].c
			] );
		}

		skinning.the_undeformed_vertices = [];
		for ( let i = 0; i < skinning.the_mesh.geometry.vertices.length; ++i ) {
			skinning.the_undeformed_vertices.push( [
				skinning.the_mesh.geometry.vertices[ i ].x,
				skinning.the_mesh.geometry.vertices[ i ].y,
				skinning.the_mesh.geometry.vertices[ i ].z
			] );
		}
	}

	// events

	function addHandle ( idx ) {
		if ( skinning.the_handles.indexOf( idx ) !== -1 ) {
			alert( "addHandle(): refuse to add a vertex index that is already a handle!" );
			return;
		}

		skinning.the_handles.push( idx );

		skinning.the_transforms.push( numeric.identity( 3 ) );

		let geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
		let object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xaa33aa } ) );
		object.originalColorHex = object.material.color.getHex();
		object.material.depthTest = false;

		let handle_vertex = skinning.the_mesh.geometry.vertices[ idx ];

		object.handle_index = skinning.the_handles.length - 1;

		object.position.x = handle_vertex.x;
		object.position.y = handle_vertex.y;
		object.position.z = -10;

		object.original_position = object.position.clone();

		sceneHelpers.add( object );

		skinning.the_handle_objects.push( object );
	}

	function updateHandleTransform ( handle_index ) {
		let handle_object = skinning.the_handle_objects[ handle_index ];

		// DO NOT CONSIDER R, S currently
		let T = numeric.identity( 3 );
		let R = numeric.identity( 3 );
		let S = numeric.identity( 3 );

		let Center = numeric.identity( 3 );
		let CenterInv = numeric.identity( 3 );

		let translation = handle_object.position.clone().sub( handle_object.original_position );
		T[ 0 ][ 2 ] = translation.x;
		T[ 1 ][ 2 ] = translation.y;

		Center[ 0 ][ 2 ] = -handle_object.original_position.x;
		Center[ 1 ][ 2 ] = -handle_object.original_position.y;
		CenterInv[ 0 ][ 2 ] = handle_object.original_position.x;
		CenterInv[ 1 ][ 2 ] = handle_object.original_position.y;

		skinning.the_transforms[ handle_index ] = numeric.dot( T, numeric.dot( CenterInv, numeric.dot( R, numeric.dot( S, Center ) ) ) );

		apply_linear_blend_skinning();
	}

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
					skinning.the_mesh = editor.selected;

					let face = intersects[ 0 ].face;
					let candidate_vertex_indices = [ face.a, face.b, face.c ];
					let min_dist2, min_vertex_index;
					for ( let i = 0; i < candidate_vertex_indices.length; ++i ) {
						let vertex_index = candidate_vertex_indices[ i ];
						let vertex_position = skinning.the_mesh.geometry.vertices[ vertex_index ];

						let dist2 = numeric.norm2Squared( numeric.sub( [ onDownPosition.x, onDownPosition.y ], [ vertex_position.x, vertex_position.y ] ) );

						if ( min_dist2 === undefined || dist2 < min_dist2 ) {
							min_dist2 = dist2;
							min_vertex_index = vertex_index;
						}
					}
					addHandle( min_vertex_index );
				}
				else {
					alert( 'cannot raycast this mesh' );
				}
			}
			else
				alert( 'Please select a mesh first!' );
		}
		else if( the_mode==='manipulate_handles' ) {
			let intersects = getIntersects( onDownPosition, skinning.the_handle_objects );
			if( intersects.length>0 ) {
				SELECTED = intersects[0].object;

				selectionPlane.position.copy( SELECTED.position );
			}
		}

		render();
	}

	function onMouseUp ( event ) {

		event.preventDefault();

		if( INTERSECTED ) SELECTED = null;

		render();

	}

	function onMouseMove ( event ) {
		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		if( SELECTED ) {
			let intersects = getIntersect( onDownPosition, editor.selected );

			SELECTED.position.copy( intersects[ 0 ].point );

			updateHandleTransform( SELECTED.handle_index );

			return;
		}
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

	editor.signals.animateRender.add( function () {
		render();
	} );

	return container;

};
