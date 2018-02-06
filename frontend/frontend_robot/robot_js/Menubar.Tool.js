Menubar.Tool = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Tool' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Set current mesh

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Set Mesh' );
	option.onClick( function () {

		editor.signals.skinningChangeMode.dispatch( 'set_mesh' );

	} );
	options.add( option );

	// Add handles

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Add Handles' );
	// editor.signals.skinningChangeMode.dispatch( 'add_handles' );
	option.onClick( function () {

		editor.signals.skinningChangeMode.dispatch( 'add_handles' );

	} );
	options.add( option );

	// Manipulate handles

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Manipulate Handles' );
	option.onClick( function () {

		editor.signals.skinningChangeMode.dispatch( 'manipulate_handles' );

	} );
	options.add( option );

	return container;

};
