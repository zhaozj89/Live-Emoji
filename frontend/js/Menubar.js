/**
 * @author mrdoob / http://mrdoob.com/
 */

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );
	container.dom.style.zIndex = "2";

	container.add( new Menubar.View( editor ) );
	container.add( new Menubar.Tool( editor ) );
	container.add( new Menubar.Mode( editor ) );
	// container.add( new Menubar.Edit( editor ) );
	// container.add( new Menubar.Help( editor ) );

	// container.add( new Menubar.Status( editor ) );

	return container;

};
