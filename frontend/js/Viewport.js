var Viewport = function (editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setId('viewport');
    container.setPosition('absolute');
    container.dom.style.zIndex = '1';
    editor.viewport = container;

    // var camera = editor.camera;
    var scene = editor.scene;

    var renderer = new THREE.WebGLRenderer({antialias: true});
    // renderer.vr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);
    // document.body.appendChild( WEBVR.createButton( renderer ) );
    container.dom.appendChild(renderer.domElement);

    editor.renderer = renderer;

    var objects = [];

    // add background

    // var spriteMap = new THREE.TextureLoader().load( "./asset/stage/background.png" );
    // var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    // editor.backgroundSprite = new THREE.Sprite( spriteMaterial );
    //
    // $( function () {
    // 	let left = editor.DEFAULT_CAMERA.left;
    // 	let right = editor.DEFAULT_CAMERA.right;
    // 	let top = editor.DEFAULT_CAMERA.top;
    // 	let bottom = editor.DEFAULT_CAMERA.bottom;
    //
    // 	let ratio = ( right - left ) / ( bottom - top );
    // 	editor.backgroundSprite.scale.set( 11 * ratio, 11, 1 );
    //
    // 	editor.backgroundSprite.position.z = 10;
    // } );
    //
    // scene.add( editor.backgroundSprite );

    // signals

    signals.editorCleared.add(function () {

        render();

    });


    signals.sceneGraphChanged.add(function () {

        render();

    });

    signals.cameraChanged.add(function () {

        render();

    });

    signals.objectSelected.add(function (object) {

        render();

    });


    signals.geometryChanged.add(function (object) {

        render();

    });

    signals.objectAdded.add(function (object) {

        object.traverse(function (child) {

            objects.push(child);

        });

    });

    signals.objectChanged.add(function (object) {

        if (object instanceof THREE.PerspectiveCamera) {

            object.updateProjectionMatrix();

        }

        if (editor.helpers[object.id] !== undefined) {

            editor.helpers[object.id].update();

        }

        render();

    });

    signals.objectRemoved.add(function (object) {

        object.traverse(function (child) {

            objects.splice(objects.indexOf(child), 1);

        });

    });

    signals.helperAdded.add(function (object) {

        objects.push(object.getObjectByName('picker'));

    });

    signals.helperRemoved.add(function (object) {

        objects.splice(objects.indexOf(object.getObjectByName('picker')), 1);

    });

    signals.materialChanged.add(function (material) {

        render();

    });

    //

    signals.windowResize.add(function () {

        // // TODO: Move this out?
        //
        // var viewSize = container.dom.offsetHeight / 50;
        // var aspectRatio = container.dom.offsetWidth / container.dom.offsetHeight;
        //
        // var left = -aspectRatio * viewSize / 2;
        // var right = aspectRatio * viewSize / 2;
        // var top = viewSize / 2;
        // var bottom = -viewSize / 2;
        //
        // editor.DEFAULT_CAMERA.left = left;
        // editor.DEFAULT_CAMERA.right = right;
        // editor.DEFAULT_CAMERA.top = top;
        // editor.DEFAULT_CAMERA.bottom = bottom;
        // editor.DEFAULT_CAMERA.updateProjectionMatrix();

        // console.log( 'camera left: ' + left );
        // console.log( 'camera right: ' + right );
        // console.log( 'camera top: ' + top );
        // console.log( 'camera bottom: ' + bottom );

        // camera.left = left;
        // camera.right = right;
        // camera.top = top;
        // camera.bottom = bottom;
        // camera.updateProjectionMatrix();

        editor.camera.fov = 70;
        editor.camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        editor.camera.near = 1; //0.1;
        editor.camera.far = 1000; //10;
        editor.camera.position.z = 6;
        editor.camera.updateProjectionMatrix();

        renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);

        render();

    });

    // test
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    console.log(cube.position);
    scene.add(cube);

    var controls = new THREE.OrbitControls(editor.camera, renderer.domElement);
    controls.update();

    var current_selected = null;
    editor.signals.add2Scene.add(function (obj) {
        current_selected = obj;
    });

    function render() {

        controls.update();

        if (current_selected != null) {
            current_selected.lookAt(editor.camera.position);
        }

        scene.updateMatrixWorld();

        renderer.render(scene, editor.camera);

    }

    this.scene = scene;

    render();

    return container;

};
