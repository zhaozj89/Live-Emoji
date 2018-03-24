/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.View = function ( editor ) {

	let signals = editor.signals;

	let container = new UI.Panel();
	container.setClass( 'menu' );

	let title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'View' );
	title.addClass( 'h4' );
	container.add( title );

	let options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Emotion Editor' );
	option.onClick( function () {
		signals.editEmotionCMD.dispatch();
	} );
	options.add( option );

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Performer View' );
	option.onClick( function () {
		editor.camera_view.setDisplay( '' );
	} );
	options.add( option );

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Audience View' );
	option.onClick( function () {
		editor.student_view.setDisplay( '' );
	} );
	options.add( option );

	return container;

};
