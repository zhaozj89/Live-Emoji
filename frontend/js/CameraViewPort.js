var CameraViewport = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'camera_viewport' );
	container.setPosition( 'absolute' );
	container.dom.style.zIndex = '4';

	editor.camera_viewport = container;

	return container;
}