/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.View = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'View' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Group

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Behavior Tree' );
	option.onClick( function () {

		var object = editor.selected;
		// if( object!==null ) signals.editAST.dispatch( object );

		signals.editAST.dispatch( object );
	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Plane

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Plane' );
	option.onClick( function () {

		var geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1 );
		var material = new THREE.MeshStandardMaterial();
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Plane';

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Box

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Box' );
	option.onClick( function () {

		var geometry = new THREE.BoxBufferGeometry( 1, 1, 1, 1, 1, 1 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Box';

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Circle

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Circle' );
	option.onClick( function () {

		var geometry = new THREE.CircleBufferGeometry( 1, 8, 0, Math.PI * 2 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Circle';

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Cylinder

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Cylinder' );
	option.onClick( function () {

		var geometry = new THREE.CylinderBufferGeometry( 1, 1, 1, 8, 1, false, 0, Math.PI * 2 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Cylinder';

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Sphere

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere' );
	option.onClick( function () {

		var geometry = new THREE.SphereBufferGeometry( 1, 8, 6, 0, Math.PI * 2, 0, Math.PI );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Sphere';

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	return container;

};