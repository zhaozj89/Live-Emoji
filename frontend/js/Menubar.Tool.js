/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Tool = function ( editor ) {
	var config = editor.config;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Tool' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Reset' );
	option.onClick( function () {
		editor.selected.position.x = 0;
		editor.selected.position.y = 0;

		editor.backgroundSprite.position.x = 0;
		editor.backgroundSprite.position.y = 0;
	} );
	options.add( option );

	// // New
	//
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'New' );
	// option.onClick( function () {
	//
	// 	if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
	//
	// 		editor.clear();
	//
	// 	}
	//
	// } );
	// options.add( option );

	//

	// options.add( new UI.HorizontalRule() );

	// Import

	var form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( fileInput.files[ 0 ] );
		form.reset();

	} );
	form.appendChild( fileInput );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Background Image' );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	// Smart Import

	// var form2 = document.createElement( 'form' );
	// form2.style.display = 'none';
	// document.body.appendChild( form2 );
	//
	// var fileInput2 = document.createElement( 'input' );
	// fileInput2.type = 'file';
	// // fileInput2.multiple = 'multiple';
	// fileInput2.addEventListener( 'change', function ( event ) {
	// 	// var files = fileInput2.files;
	// 	// for(let i=0; i<files.length; ++i) {
	// 	// editor.loader2.loadFile( fileInput2.files[ 0 ] );
	// 	// }
	//
	// 	LoadCharacterJSON( fileInput2.files[0] );
	// 	// editor.loader2.loadFile( fileInput2.files[ 0 ] );
	// 	form2.reset();
	//
	// } );
	// form2.appendChild( fileInput2 );
	//
	// var option2 = new UI.Row();
	// option2.setClass( 'option' );
	// option2.setTextContent( 'Smart Import' );
	// option2.onClick( function () {
	//
	// 	fileInput2.click();
	//
	// } );
	// options.add( option2 );


	// DO NOT load it for testing
	// PreLoadCharacterJSON();

	return container;

};
