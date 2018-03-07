function MarchingSquares ( grid, width, height, start ) {
	var s = start || ContourStart( grid, width, height ), // starting point
		c = [],    // contour polygon
		x = s[ 0 ],  // current x position
		y = s[ 1 ],  // current y position
		dx = 0,    // next x direction
		dy = 0,    // next y direction
		pdx = NaN, // previous x direction
		pdy = NaN, // previous y direction
		i = 0;

	do {
		// determine marching squares index
		i = 0;
		if ( grid( x - 1, y - 1 ) ) i += 1;
		if ( grid( x, y - 1 ) ) i += 2;
		if ( grid( x - 1, y ) ) i += 4;
		if ( grid( x, y ) ) i += 8;

		// determine next direction
		if ( i === 6 ) {
			dx = pdy === -1 ? -1 : 1;
			dy = 0;
		} else if ( i === 9 ) {
			dx = 0;
			dy = pdx === 1 ? -1 : 1;
		} else {
			dx = ContourDx[ i ];
			dy = ContourDy[ i ];
		}

		// update contour polygon
		if ( dx != pdx && dy != pdy ) {
			c.push( [ x, y ] );
			pdx = dx;
			pdy = dy;
		}

		x += dx;
		y += dy;
	} while ( s[ 0 ] != x || s[ 1 ] != y );

	return c;
};

// lookup tables for marching directions
var ContourDx = [ 1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN ],
	ContourDy = [ 0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN ];

function ContourStart ( grid, width, height ) {
	var x = 0,
		y = 0;

	for ( let y = 0; y < height; ++y ) {
		for ( let x = 0; x < width; ++x ) {
			if ( grid( x, y ) ) return [ x, y ];
		}
	}
}

var ZContour = function ( png ) {

	const width = png.getWidth();
	const height = png.getHeight();

	var grid_function = function ( x, y ) {
		let pixel = png.getPixel( x, y );
		return ( pixel[ 0 ] + pixel[ 1 ] + pixel[ 2 ] ) > 0;
	}

	let points_out = MarchingSquares( grid_function, width, height );

	let contour = new Array();
	for ( let i = 0; i < points_out.length; ++i ) {
		points_out[ i ][ 0 ] = points_out[ i ][ 0 ] / width;
		points_out[ i ][ 1 ] = points_out[ i ][ 1 ] / height;
		contour.push( { x: points_out[ i ][ 0 ], y: points_out[ i ][ 1 ], id: i } );
		// console.log(contour[i][0]/width + ' ' + contour[i][1]/height);
	}

	let swctx = new poly2tri.SweepContext( contour );
	swctx.triangulate();

	let tris_swctx = swctx.getTriangles();

	let tris_out = new Array();
	tris_swctx.forEach( function ( t ) {
		t.getPoints().forEach( function ( p ) {
			tris_out.push( p.id );
		} );
	} );

	let geometry = new THREE.Geometry();

	for ( let i = 0; i < points_out.length; ++i )
		geometry.vertices.push( new Vector3( 10 * points_out[ i ][ 0 ], 10 * points_out[ i ][ 1 ], 0 ) );


	for ( let i = 0; i < tris_out.length; i += 3 ) {
		geometry.faces.push( new THREE.Face3( tris_out[ i ], tris_out[ i + 1 ], tris_out[ i + 2 ] ) );
		geometry.faceVertexUvs[ 0 ].push( [
			new Vector2( points_out[ tris_out[ i ] ][ 0 ], 1 - points_out[ tris_out[ i ] ][ 1 ] ),
			new Vector2( points_out[ tris_out[ i + 1 ] ][ 0 ], 1 - points_out[ tris_out[ i + 1 ] ][ 1 ] ),
			new Vector2( points_out[ tris_out[ i + 2 ] ][ 0 ], 1 - points_out[ tris_out[ i + 2 ] ][ 1 ] )
		] );
	}

	geometry.uvsNeedUpdate = true;

	let texture = new THREE.Texture(
		ImageData2Image( new ImageData( Uint8ClampedArray.from( png.pixels ), width, height ) )
	);

	texture.needsUpdate = true;

	let material = new THREE.MeshBasicMaterial( {
		transparent: true,
		map: texture,
		side: THREE.BackSide
	} );
	material.needsUpdate = true;


	// geometry.computeFaceNormals();
	// geometry.computeVertexNormals();

	// let material = new THREE.MeshNormalMaterial();
	let mesh = new THREE.Mesh( geometry, material );

	return mesh;
};
