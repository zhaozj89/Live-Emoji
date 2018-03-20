/**
 * @author mrdoob / http://mrdoob.com/
 */

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );
	container.dom.style.zIndex = "5";

	container.add( new Menubar.View( editor ) );
	container.add( new Menubar.Tool( editor ) );

	return container;

};
