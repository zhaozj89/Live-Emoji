/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	// var buttons = new UI.Panel();
	// container.add( buttons );
	//
	// var showGrid = new UI.THREE.Boolean( true, 'show grid' ).onChange( update );
	// buttons.add( showGrid );
	//
	// function update() {
	//
	// 	signals.showGridChanged.dispatch( showGrid.getValue() );
	//
	// }


	var button = new UI.Button( 'Behavior Editor' );
	button.setTop( '6px' );
	button.setLeft( '5px' );

	button.onClick( function () {
		var object = editor.selected;
		if( object!==null ) signals.editAST.dispatch( object );
	} );

	container.add( button );

	return container;

};
