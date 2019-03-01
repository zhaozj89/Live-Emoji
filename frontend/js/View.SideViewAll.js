var SideViewAll = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sideview' );
	container.setPosition( 'absolute' );
	container.dom.style.zIndex = '4';
	editor.sideview = container;

    var face_view = new Faceview(editor);
    var audience_view = new Audienceview(editor);

    container.add(face_view);
    container.add(audience_view);

    $( function () {
        $( face_view.dom ).draggable();
        $( audience_view.dom ).draggable();
    } );

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.vr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(editor.side_view.dom.offsetWidth, editor.side_view.dom.offsetHeight);
    editor.side_view.dom.appendChild( WEBVR.createButton( renderer, { frameOfReferenceType: 'head-model' } ) );
    editor.side_view.dom.appendChild(renderer.domElement);

    editor.side_view_renderer = renderer;
    editor.side_scene = MakeScene();

	return container;
}