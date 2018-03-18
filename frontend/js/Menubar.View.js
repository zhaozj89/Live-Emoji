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

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Emotion Editor' );
	option.onClick( function () {

		var object = editor.selected;
		signals.editEmotionCMD.dispatch( object );
	} );
	options.add( option );

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Camera' );
	option.onClick( function () {

	} );
	options.add( option );

	//

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Student' );
	option.onClick( function () {

	} );
	options.add( option );

	//

    var isStudents = new UI.Checkbox( false );
    options.add( isStudents );

    var isStudentsInfo = new UI.Text( 'Student Side' );
    isStudentsInfo.setClass( 'option' );
    options.add( isStudentsInfo );

    isStudents.onChange(function (  ) {
        if( isStudents.getValue()===true )
            editor.isStudentsSide = true;
        else
            editor.isStudentsSide = false;
    });

	return container;

};
