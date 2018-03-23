/**
 * @author mrdoob / http://mrdoob.com/
 */

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );
	container.dom.style.zIndex = "10";

	container.add( new Menubar.Load( editor ) );
	container.add( new Menubar.View( editor ) );
	container.add( new Menubar.Tool( editor ) );
	container.add( new Menubar.Layout( editor ) );

	return container;

};
