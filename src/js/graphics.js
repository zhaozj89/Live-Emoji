import * as BBW from './bbw';

export let createGraphics = function () {
    let the_mesh, the_faces, the_undeformed_vertices, the_handles = [], the_transforms = [], the_weights = null;
    let the_texture, the_mesh_container, the_handle_objects = [];

    let container, stats;
    let camera, scene, raycaster, renderer;
    let plane;

    let mouse = new THREE.Vector2(), INTERSECTED, SELECTED;

    let canvas_width = document.getElementById("middle").offsetWidth;
    let canvas_height = document.getElementById("middle").offsetHeight;

    let canvas_left = document.getElementById("middle").offsetLeft;
    let canvas_top = document.getElementById("middle").offsetTop;

    console.log('canvas left: ' + canvas_left);
    console.log('canvas top: ' + canvas_top);
    console.log('canvas width: ' + canvas_width);
    console.log('canvas height: ' + canvas_height);

    init_3D(canvas_width, canvas_height);
    init_Widgets();
    needs_redisplay();

    function init_3D() {
        container = document.createElement( 'div' );
        document.getElementById("middle").appendChild( container );

        let lrtb = compute_orthographic_left_right_top_bottom( canvas_width, canvas_height );
        camera = new THREE.OrthographicCamera( lrtb[0], lrtb[1], lrtb[2], lrtb[3], 1, 10000 );
        camera.position.z = 1000;


        scene = new THREE.Scene();

        the_texture = new THREE.Texture();

        plane = new THREE.Mesh( new THREE.PlaneGeometry( 5000, 5000, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0x060606, opacity: 0.1, transparent: true, wireframe: false } ) );
        plane.visible = true;


        scene.add( plane );

        raycaster = new THREE.Raycaster();

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor( 0xffffff );
        renderer.setSize( canvas_width, canvas_height );
        renderer.sortObjects = false;

        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';
        container.appendChild( stats.domElement );

        renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
        renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
        renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
        window.addEventListener( 'resize', onWindowResize, false );
    }

    function init_Widgets()
    {
        $("#texture_map_URL").change( function() {
            load_texture( $(this).val() );
        } );
        $("#obj_URL").change( function() {
            load_OBJ( $(this).val() );
        } );

        $('input[name=mouse_mode]').change( function() {
            /// Recompute weights when we enter manipulate mode.
            if( $('input[name=mouse_mode]:checked').val() === 'mouse_manipulate_handles' )
            {
                compute_bbw_weights();
                needs_redisplay();
            }
        } );

        $('#visualize_weights').change( function() {
            needs_redisplay();

            if( the_mesh === undefined ) return;

            let val = $('#visualize_weights :selected').val();
            if( val === 'off' )
            {
                the_mesh_container.remove( the_mesh );
                the_mesh = new THREE.Mesh( the_mesh.geometry.clone(), create_default_material() );
                the_mesh_container.add( the_mesh );
                return;
            }

            let handle_index = parseInt( val );
            // If we're still in add mode, we may not yet have weights.
            if( the_weights === null || handle_index >= the_weights[0].length )
            {
                console.error( "Can't visualize the weights because they haven't been computed yet." );
                return;
            }

            // If we're here, then we should be good.
            the_mesh_container.remove( the_mesh );
            the_mesh = new THREE.Mesh( the_mesh.geometry.clone(), create_weights_material( handle_index ) );
            the_mesh_container.add( the_mesh );
        } );

        $('#clear_handles').click( function() {
            reset_handles();
        } );
        $('#reset_transforms').click( function() {
            reset_transforms();
        } );

        $('#save_weights').click( function() {
            let globals = save_weights();
            let blob = new Blob([ JSON.stringify( globals ) ], {type: "application/json"});
            saveAs( blob, "skinning_weights.json" );
        } );
        $('#load_weights').change( function( evt ) {
            let files = evt.target.files;
            if( files.length === 0 )
            {
                console.error( "Load weights: No file loaded." );
                return;
            }
            else if( files.length > 1 )
            {
                console.error( "Load weights can't load more than one file at a time." );
                return;
            }

            let file = files[0];
            let reader = new FileReader();
            reader.onload = function( loaded_event ) {
                let globals = JSON.parse( loaded_event.target.result );
                load_weights( globals );
            };
            reader.readAsText( file );
        } );

        // Set up small-link URL's to "change" their respective "for" tags.
        $(".small-link.URL").on( 'click', function( evt ) { $( '#' + $(this).attr('for') ).val( $(this).attr('href') ).change(); } );

        // By default, use the grid texture.
        $("#texture_map_URL_grid").click();
        // By default, use the circle OBJ.
        $("#obj_URL_circle").click();
    }

    function needs_redisplay() {
        requestAnimationFrame( function() {
            renderer.render( scene, camera );
            stats.update();
        } );
    }

    function save_weights()
    {
        let globals = {};
        globals.texture_URL = $('#texture_map_URL').val();
        globals.obj_URL = $('#obj_URL').val();
        globals.handles = the_handles;
        globals.transforms = the_transforms;
        globals.weights = the_weights;
        return globals;
    }

    function load_weights( globals )
    {
        $('#texture_map_URL').val( globals.texture_URL ).change();

        // Don't call change(), because we want to call it manually so we can use
        // the success callback.
        $('#obj_URL').val( globals.obj_URL );
        load_OBJ( globals.obj_URL, function() {
            // After loading the OBJ, setup the handles, transforms, and weights.
            setup_handles( globals.handles );
            // UPDATE: We can't just set the_transforms, because the GUI handles wouldn't match.
            // the_transforms = globals.transforms;
            set_transforms( globals.transforms );
            the_weights = globals.weights;

            // Apply the transforms.
            apply_linear_blend_skinning();

            // Switch to manipulate mode.
            $( "#mouse_manipulate_handles" ).prop( "checked", true );
        } );
    }

    function load_texture( URL )
    {
        /// texture
        let manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
        let loader = new THREE.ImageLoader( manager );
        loader.load( URL, function ( image ) {
            needs_redisplay();

            the_texture.image = image;
            the_texture.needsUpdate = true;
        } );
    }

    function load_OBJ( URL, success_callback )
    {
        // model
        let manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {console.log( item, loaded, total );}

        let loader = new THREE.OBJLoader( manager );
        loader.load( URL, function ( object ) {
            // console.log(URL);
            // needs_redisplay();
            // Upon success, remove the current model and reset the handles.
            reset_handles();

            if( the_mesh_container !== undefined ) scene.remove( the_mesh_container );

            the_mesh_container = object;
            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    the_mesh = child;

                    // console.log('geometry: ' + child.geometry);

                    child.material = create_default_material();

                    // Scale to 200 pixels.
                    // TODO Q: Should this instead be in the camera parameters?
                    // A1: No, because it would be hard to specify onscreen elements in pixels.
                    child.geometry.computeBoundingSphere();
                    let scale = 200./child.geometry.boundingSphere.radius;
                    child.geometry.applyMatrix( (new THREE.Matrix4()).makeScale( scale, scale, scale ) );

                    save_faces_and_undeformed_vertices();
                }
            } );

            scene.add( object );

            $('#mouse_add_handles').change();

            if( success_callback !== undefined ) success_callback();
        } );
    }

    function create_default_material()
    {
        let material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        material.map = the_texture;
        material.side = THREE.DoubleSide;
        return material;
    }

    function create_weights_material( handle_index )
    {
        let material = new THREE.ShaderMaterial( {
            attributes: {
                weight: { type: 'f', value: numeric.transpose( the_weights )[ handle_index ] }
            },
            vertexShader: document.getElementById('vertShaderWeights').text,
            fragmentShader: document.getElementById('fragShaderWeights').text
        } );
        return material;
    }

    function save_faces_and_undeformed_vertices()
    {
        the_faces = [];
        for( let i = 0; i < the_mesh.geometry.faces.length; ++i ) {
            the_faces.push([
                the_mesh.geometry.faces[i].a,
                the_mesh.geometry.faces[i].b,
                the_mesh.geometry.faces[i].c
            ]);
        }

        the_undeformed_vertices = [];
        for( let i = 0; i < the_mesh.geometry.vertices.length; ++i ) {
            the_undeformed_vertices.push([
                the_mesh.geometry.vertices[i].x,
                the_mesh.geometry.vertices[i].y,
                the_mesh.geometry.vertices[i].z
            ]);
        }
    }

    function add_handle( vertex_index )
    {
        /// 1 Add the index to the list of handle indices.
        /// 2 Add a new identity transform matrix to the list of transforms.
        /// 2 Create three.js object for it.

        /// If the vertex_index is already in the list of handles, abort.
        if( the_handles.indexOf( vertex_index ) !== -1 ) {
            console.error( "add_handle(): Refusing to add a vertex index that is already a handle." );
            return;
        }

        /// 1
        the_handles.push( vertex_index );
        /// 2
        the_transforms.push( numeric.identity(3) );

        /// 3
        let geometry = new THREE.BoxGeometry( 20, 20, 20 );
        let object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xaa33aa } ) );
        object.originalColorHex = object.material.color.getHex();

        let handle_vertex = the_undeformed_vertices[ vertex_index ];
        // Store the handle index (it's the one we just added)
        object.handle_index = the_handles.length-1;

        object.position.x = handle_vertex[0];
        object.position.y = handle_vertex[1];
        object.position.z = 1;

        // Store the original position.
        object.original_position = object.position.clone();

        scene.add( object );

        the_handle_objects.push( object );

        $("#visualize_weights").append( '<option value="' + (the_handles.length-1) + '">' + (the_handles.length-1) + '</option>' );
    }

    function reset_transforms()
    {
        needs_redisplay();

        for( let i = 0; i < the_transforms.length; ++i )
        {
            the_transforms[i] = numeric.identity(3);

            let handle_object = the_handle_objects[i];
            handle_object.position.copy( handle_object.original_position );

            handle_object.rotation.z = 0.;
            handle_object.scale.x = 1.;
            handle_object.scale.y = 1.;
        }
        apply_linear_blend_skinning();
    }
    function reset_handles()
    {
        needs_redisplay();

        reset_vertices_to_undeformed();

        the_handles = [];
        the_transforms = [];
        the_weights = null;

        // Remove the GUI object.
        for( let i = 0; i < the_handle_objects.length; ++i ) scene.remove( the_handle_objects[ i ] );
        the_handle_objects = [];

        INTERSECTED = SELECTED = null;

        let visualization_options = $("#visualize_weights option").not(":first-child");
        visualization_options.remove();
    }
    function setup_handles( handles )
    {
        // We don't need to call needs_redisplay() because we call reset_handles() which does.

        // If we are setting up what we already have, do nothing.
        if( handles.length == the_handles.length && numeric.all( numeric.eq( the_handles, handles ) ) )
        {
            console.error( "setup_handles() called with the handles that are already set." );
            return false;
        }

        // If the handles contain invalid indices, abort.
        for( let i = 0; i < handles.length; ++i )
        {
            if( handles[i] < 0 || handles[i] >= the_mesh.geometry.vertices.length )
            {
                console.error( "setup_handles() received invalid vertex index: " + handles[i] );
                return;
            }
        }

        /// Initialize the list of handles and transforms.
        reset_handles();

        /// Add the handles
        for( let i = 0; i < handles.length; ++i ) add_handle( handles[i] );

        /// Compute bbw weights.
        // UPDATE: Wait to do this.
        // compute_bbw_weights();

        return true;
    }
    function compute_bbw_weights()
    {
        if( the_handles.length === 0 ) return;

        let mode = $("#weights_mode :selected").val();
        the_weights = BBW.bbw( the_faces, the_undeformed_vertices, the_handles, mode );
        apply_linear_blend_skinning();
    }
    function update_handle_transform( handle_index )
    {
        let handle_object = the_handle_objects[ handle_index ];

        // The transformation is T*R*S, where T is translation, R is rotation, S is scale.
        let T = numeric.identity(3);
        let R = numeric.identity(3);
        let S = numeric.identity(3);
        // But we want rotation and scaling to be centered at the handle_object's position,
        // so we need two more translations.
        let Center = numeric.identity(3);
        let CenterInv = numeric.identity(3);

        let translation = handle_object.position.clone().sub( handle_object.original_position );
        T[0][2] = translation.x;
        T[1][2] = translation.y;

        Center[0][2] = -handle_object.original_position.x;
        Center[1][2] = -handle_object.original_position.y;
        CenterInv[0][2] = handle_object.original_position.x;
        CenterInv[1][2] = handle_object.original_position.y;

        let cos_theta = Math.cos( handle_object.rotation.z );
        let sin_theta = Math.sin( handle_object.rotation.z );
        R[0][0] = R[1][1] = cos_theta;
        R[0][1] = -sin_theta;
        R[1][0] = sin_theta;

        S[0][0] = handle_object.scale.x;
        S[1][1] = handle_object.scale.y;

        the_transforms[ handle_index ] = numeric.dot( T, numeric.dot( CenterInv, numeric.dot( R, numeric.dot( S, Center ) ) ) );

        apply_linear_blend_skinning();
    }
    function set_transforms( transforms )
    {
        if( the_transforms.length !== transforms.length )
        {
            console.error( "set_transforms() called with the wrong number of transforms." );
            return;
        }

        for( let i = 0; i < transforms.length; ++i )
        {
            set_transform( i, transforms[i] );
        }
    }
    function set_transform( transform_index, transform )
    {
        if( transform_index < 0 || transform_index >= the_transforms.length )
        {
            console.error( "set_transform() called with an invalid transform index." );
            return;
        }

        the_transforms[transform_index] = transform;

        /// Now we need to reverse update_handle_transform( handle_index ).
        /// The relationship between the handle object and the transform matrix is:
        ///    transform_matrix = numeric.dot( T, numeric.dot( CenterInv, numeric.dot( R, numeric.dot( S, Center ) ) ) );
        /// where Center is the transformation that take's the handle's original position to the origin.
        let handle_object = the_handle_objects[ transform_index ];

        let Center = numeric.identity(3);
        let CenterInv = numeric.identity(3);

        Center[0][2] = -handle_object.original_position.x;
        Center[1][2] = -handle_object.original_position.y;
        CenterInv[0][2] = handle_object.original_position.x;
        CenterInv[1][2] = handle_object.original_position.y;

        // Right-multiply CenterInv to remove it.
        // T*CenterInv*R*S
        let TCenterInvRS = numeric.dot( transform, CenterInv );

        // The upper 2x2 matrix has only scale and rotation.
        // The first column's two elements squared should sum to 1. Whatever they sum to is sx^2.
        // The same with the second column gives us sy^2.
        let sx = Math.sqrt( TCenterInvRS[0][0]*TCenterInvRS[0][0] + TCenterInvRS[1][0]*TCenterInvRS[1][0] );
        let sy = Math.sqrt( TCenterInvRS[0][1]*TCenterInvRS[0][1] + TCenterInvRS[1][1]*TCenterInvRS[1][1] );

        let Sinv = numeric.identity(3);
        Sinv[0][0] = 1./sx;
        Sinv[1][1] = 1./sy;

        let TCenterInvR = numeric.dot( TCenterInvRS, Sinv );

        // The upper-left of the 2x2 is the rotation matrix R.
        let R = numeric.identity(3);
        R[0][0] = TCenterInvR[0][0];
        R[0][1] = TCenterInvR[0][1];
        R[1][0] = TCenterInvR[1][0];
        R[1][1] = TCenterInvR[1][1];


        // The inverse of the rotation matrix is its transpose.
        let T = numeric.dot( numeric.dot( TCenterInvR, numeric.transpose( R ) ), Center );

        // Scale
        handle_object.scale.x = sx;
        handle_object.scale.y = sy;
        // Use cosine and sine to obtain the angle.
        handle_object.rotation.z = Math.atan2( R[1][0], R[0][0] );
        // Translation
        handle_object.position.copy( handle_object.original_position ).add( new THREE.Vector3( T[0][2], T[1][2], 0. ) );

        // Debugging. Call update_handle_transform() and see if the matrix changed.
        // UPDATE: It doesn't change. Test passed.
        // update_handle_transform( transform_index );
        // console.log( numeric.sub( the_transforms[ transform_index ], transform ) );
    }
    function apply_linear_blend_skinning()
    {
        // Do nothing without weights.
        if( the_weights === null ) return;

        let deformed_vertices = BBW.linear_blend_skin_2D( the_undeformed_vertices, the_weights, the_transforms );

        // Update the mesh.
        for( let i = 0; i < the_mesh.geometry.vertices.length; ++i )
        {
            the_mesh.geometry.vertices[i].x = deformed_vertices[i][0];
            the_mesh.geometry.vertices[i].y = deformed_vertices[i][1];
        }

        the_mesh.geometry.verticesNeedUpdate = true;
    }
    function reset_vertices_to_undeformed()
    {
        // Nothing to reset.
        if( !the_undeformed_vertices || the_undeformed_vertices.length == 0 ) return;

        // Update the mesh.
        for( let i = 0; i < the_mesh.geometry.vertices.length; ++i )
        {
            the_mesh.geometry.vertices[i].x = the_undeformed_vertices[i][0];
            the_mesh.geometry.vertices[i].y = the_undeformed_vertices[i][1];
        }

        the_mesh.geometry.verticesNeedUpdate = true;
    }

    function compute_orthographic_left_right_top_bottom( width, height )
    {
        return [ -width/2, width/2, height/2, -height/2 ];
    }

    function onWindowResize() {
        needs_redisplay();

        let lrtb = compute_orthographic_left_right_top_bottom( canvas_width, canvas_height );
        camera.left = lrtb[0];
        camera.right = lrtb[1];
        camera.top = lrtb[2];
        camera.bottom = lrtb[3];
        camera.updateProjectionMatrix();

        renderer.setSize( canvas_width, canvas_height );
    }

    function onDocumentMouseMove( event ) {
        needs_redisplay();

        event.preventDefault();

        // Do nothing if we're not manipulating handles.
        if( $('input[name=mouse_mode]:checked').val() !== 'mouse_manipulate_handles' ) return;

        set_mouse( event );

        raycaster.setFromCamera( mouse, camera );

        // let vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );

        // let raycaster = projector.pickingRay( vector, camera );

        // raycaster.set(camera.position, vector.sub(camera.position).normalize());

        if ( SELECTED ) {

            let intersects = raycaster.intersectObject( plane );

            // Rotation
            if( event.shiftKey )
            {
                let dx = plane.position.x - intersects[ 0 ].point.x;
                let dr = 2*dx/canvas_width * 2.*Math.PI;
                SELECTED.rotation.z = dr;
            }
            // Scale
            else if( event.altKey )
            {
                let dx = plane.position.x - intersects[ 0 ].point.x;
                let ds = Math.exp( -4*dx/canvas_width );
                SELECTED.scale.x = ds;
                SELECTED.scale.y = ds;
            }
            // Translation
            else
            {
                SELECTED.position.copy( intersects[ 0 ].point );
            }

            // Update the handle transformation.
            update_handle_transform( SELECTED.handle_index );


            // Keep the plane centered at the last mouse location so the mouse never leaves it
            // and we can continue to intersect with it.
            // UPDATE: Don't. It makes things easier.
            // plane.position.copy( SELECTED.position );
            return;

        }


        let intersects = raycaster.intersectObjects( the_handle_objects );

        if ( intersects.length > 0 ) {

            if ( INTERSECTED !== intersects[ 0 ].object ) {

                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.originalColorHex );

                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.material.color.setHex( 0xff0000 );
            }

            container.style.cursor = 'pointer';

        } else {

            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.originalColorHex );

            INTERSECTED = null;

            container.style.cursor = 'auto';

        }

    }

    function onDocumentMouseDown( event ) {
        needs_redisplay();

        event.preventDefault();

        set_mouse( event );

        raycaster.setFromCamera( mouse, camera );

        // let vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        // let raycaster = projector.pickingRay( vector, camera );
        //
        // If we're not manipulating handles.
        let mouse_mode = $('input[name=mouse_mode]:checked').val();

        if( mouse_mode === 'mouse_add_handles' )
        {
            if( raycaster.intersectObjects( the_handle_objects ).length > 0 )
            {
                console.error( "Refusing to add a handle under an existing one." );
                return;
            }

            let intersects = raycaster.intersectObject( the_mesh );
            if( intersects.length > 0 )
            {
                let pt = intersects[0].point;
                let face = intersects[0].face;
                let candidate_vertex_indices = [ face.a, face.b, face.c ];
                let min_dist2, min_vertex_index;
                for( let i = 0; i < candidate_vertex_indices.length; ++i )
                {
                    let vertex_index = candidate_vertex_indices[i];
                    let vertex_position = the_mesh.geometry.vertices[ vertex_index ];
                    let dist2 = numeric.norm2Squared( numeric.sub( [ mouse.x, mouse.y ], [ vertex_position.x, vertex_position.y ] ) );

                    if( min_dist2 === undefined || dist2 < min_dist2 )
                    {
                        min_dist2 = dist2;
                        min_vertex_index = vertex_index;
                    }
                }
                add_handle( min_vertex_index );
            }
        }
        else if( mouse_mode === 'mouse_manipulate_handles' )
        {
            let intersects = raycaster.intersectObjects( the_handle_objects );

            if ( intersects.length > 0 ) {

                SELECTED = intersects[ 0 ].object;
                plane.position.copy( SELECTED.position );

                container.style.cursor = 'move';
            }
        }
    }

    function onDocumentMouseUp( event ) {
        needs_redisplay();

        event.preventDefault();

        if ( INTERSECTED ) {

            // plane.position.copy( INTERSECTED.position );

            SELECTED = null;

        }

        container.style.cursor = 'auto';

    }

    function set_mouse( event ) {
        mouse.x = ( (event.clientX-canvas_left) / canvas_width ) * 2 - 1;
        mouse.y = - ( (event.clientY-canvas_top) / canvas_height ) * 2 + 1;
    }
}

