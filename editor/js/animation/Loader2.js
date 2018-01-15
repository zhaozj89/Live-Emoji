
var Loader2 = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	this.loadFile = function ( file ) {

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var reader = new FileReader();
		reader.addEventListener( 'progress', function ( event ) {

			var size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
			console.log( 'Loading', filename, size, progress );

		} );

		switch (extension) {

			case 'json':

				reader.addEventListener( 'load', function ( event ) {
					var loader = JSON.parse( event.target.result );
					console.log(loader);
				});
				reader.readAsText( file );
				break;

			// case 'jpg':
			case 'png':
/*
				var loader = new THREE.ImageLoader();

				// load a image resource
				loader.load(
					// resource URL
					'../test/' + filename,

					// onLoad callback
					function ( image ) {
						// use the image, e.g. draw part of it on a canvas
						console.log( image );
					},

					// onProgress callback currently not supported
					undefined,

					// onError callback
					function () {
						console.error( 'An error happened.' );
					}
				);
*/

				reader.addEventListener( 'load', function ( event ) {

					var loader = new PNGReader( event.target.result );
					loader.parse( function ( err, png ) {
						if (err) throw err;

						let mesh = ZContour( png );

						mesh.rotation.x = THREE.Math.degToRad( -90 );
						mesh.rotation.z = THREE.Math.degToRad( 180 );
						// let mesh = ZContour( png );

/*
						const assignUVs = function ( geometry ) {
							geometry.computeBoundingBox();

							const max = geometry.boundingBox.max;
							const min = geometry.boundingBox.min;

							console.log('min: ' + min.x + ', ' + min.y);

							const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
							const range = new THREE.Vector2(max.x - min.x, max.y - min.y);

							geometry.faceVertexUvs[0] = [];
							const faces = geometry.faces;

							console.log('face number: ' + geometry.faces.length);

							for (let i = 0; i < geometry.faces.length; i++) {
								const v1 = geometry.vertices[faces[i].a];
								const v2 = geometry.vertices[faces[i].b];
								const v3 = geometry.vertices[faces[i].c];

								geometry.faceVertexUvs[0].push([
									new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
									new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
									new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
								]);
							}
							geometry.uvsNeedUpdate = true;
						}


						const w = png.getWidth();
						const h = png.getHeight();

						const rectShape = new THREE.Shape();
						rectShape.moveTo(0, 0);
						rectShape.lineTo(0, h);
						rectShape.lineTo(w, h);
						rectShape.lineTo(w, 0);
						rectShape.lineTo(0, 0);

						const geom = new THREE.ShapeGeometry(rectShape);
						assignUVs(geom);

						// const pixelData = [];
						//
						// for (let y = 0; y < h; ++y) {
						// 	for (let x = 0; x < w; ++x) {
						// 		const a = y < (h / 2) ? 50 : 255;
						// 		const r = x < (w / 2) ? 255 : 100;
						// 		pixelData.push(r, 0, 0, a);
						// 	}
						// }


						const dataTexture = new THREE.DataTexture(
							png.pixels,
							w,
							h,
							THREE.RGBAFormat,
							THREE.UnsignedByteType,
							THREE.UVMapping);
						dataTexture.needsUpdate = true;

						const dataMaterial = new THREE.MeshBasicMaterial({
							transparent: true,
							map: dataTexture
						});
						dataMaterial.needsUpdate = true;

						const mesh = new THREE.Mesh(geom, dataMaterial);
*/

						editor.execute( new AddObjectCommand( mesh ) );

					} );

					// editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;
		}
	}

}


var LoadFileName = function ( name, emotion, filename ) {
	// let img = new Image();
	//
	// img.addEventListener('load', function() {
	// 	console.log( this );
	// }, false);
	//
	// img.src = '../asset/' + name;

	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', '../asset/qin/' + filename, true );
	xhr.responseType = 'arraybuffer';

	xhr.onload = function( event ){
		if( this.status == 404 ) {
			console.log( filename );
		}

		if( this.status == 200 ) {
			var reader = new PNGReader( this.response );
			reader.parse( function( err, png ) {
				if ( err ) throw err;
				// console.log(png);
				let mesh = ZContour( png );

				mesh.rotation.x = THREE.Math.degToRad( -90 );
				mesh.rotation.z = THREE.Math.degToRad( 180 );

				if( emotion==='' ) mesh.name = name;
				else mesh.name = name + '_' + emotion;

				let basicElement = new BasicElement( name, mesh, emotion );
				characterStructure.addElement( basicElement );

				editor.execute( new AddObjectCommand( mesh ) );
			});
		}
	};

	xhr.send();
}



var LoadCharacterJSON = function ( file ) {

	var filename = file.name;
	var extension = filename.split( '.' ).pop().toLowerCase();

	var reader = new FileReader();

	switch (extension) {

		case 'json':

			reader.addEventListener( 'load', function ( event ) {
				var loader = JSON.parse( event.target.result );

				for( let prop in loader ) {
					if( typeof(loader[prop])==='string') LoadFileName( prop, '', loader[prop] );
					if( typeof(loader[prop])==='object' ) {
						for( let prop2 in loader[prop] ) LoadFileName( prop, prop2, loader[prop][prop2] );
					}
				}
			});
			reader.readAsText( file );
			break;

		default:

			alert( 'Unsupported file format (' + extension +  ').' );

			break;
	}
}
