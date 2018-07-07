Menubar.Layout = function ( editor ) {

	let container = new UI.Panel();
	container.setClass( 'menu' );

	let title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Layout' );
	title.addClass( 'h4' );
	container.add( title );

	let options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Teacher

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Performer' );
	option.onClick( function () {
		editor.teacherLabel.dom.click();
		editor.signals.windowResize.dispatch();
	} );
	options.add( option );

	// Student

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Audience' );
	option.onClick( function () {
		editor.studentLabel.dom.click();
		editor.signals.windowResize.dispatch();
	} );
	options.add( option );

	return container;

};
