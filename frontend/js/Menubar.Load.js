Menubar.Load = function ( editor ) {

	let container = new UI.Panel();
	container.setClass( 'menu' );

	let title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Load' );
	title.addClass( 'h4' );
	container.add( title );

	let options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Load Boy' );
	option.onClick( function () {
		PreLoadCharacterJSON( editor, 'boy' );
	} );
	options.add( option );

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Load Girl' );
	option.onClick( function () {
		PreLoadCharacterJSON( editor, 'girl' );
	} );
	options.add( option );

	return container;

};
