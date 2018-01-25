/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	//

	var sceneTab = new UI.Text( 'Scene' ).onClick( onClick );
	var cameraTab = new UI.Text( 'Camera' ).onClick( onClick );
	var historyTab = new UI.Text( 'History' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( cameraTab, historyTab, sceneTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		new Sidebar.Properties( editor )
	);
	container.add( scene );

	var camera = new UI.Span().add(
		new Sidebar.Camera( editor )
	);
	container.add( camera );

	var history = new UI.Span().add(
		new Sidebar.History( editor ),
		new Sidebar.Settings( editor )
	);
	container.add( history );

	//

	function select( section ) {

		sceneTab.setClass( '' );
		cameraTab.setClass( '' );
		historyTab.setClass( '' );

		scene.setDisplay( 'none' );
		camera.setDisplay( 'none' );
		history.setDisplay( 'none' );

		switch ( section ) {
			case 'Scene':
				sceneTab.setClass( 'selected' );
				scene.setDisplay( '' );
				break;
			case 'Camera':
				cameraTab.setClass( 'selected' );
				camera.setDisplay( '' );
				break;
			case 'History':
				historyTab.setClass( 'selected' );
				history.setDisplay( '' );
				break;
		}

	}

	select( 'Camera' );

	return container;

};
