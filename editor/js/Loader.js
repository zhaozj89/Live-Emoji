/**
 * @author mrdoob / http://mrdoob.com/
 */

var Loader = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	this.texturePath = '';

	this.loadFile = function ( file ) {

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var reader = new FileReader();
		reader.addEventListener( 'progress', function ( event ) {

			var size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
			console.log( 'Loading', filename, size, progress );

		} );

		switch ( extension ) {

			case '3ds':

				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.TDSLoader();
					var object = loader.parse( event.target.result );

					editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'amf':

				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AMFLoader();
					var amfobject = loader.parse( event.target.result );

					editor.execute( new AddObjectCommand( amfobject ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'awd':

				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AWDLoader();
					var scene = loader.parse( event.target.result );

					editor.execute( new SetSceneCommand( scene ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'babylon':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.BabylonLoader();
					var scene = loader.parse( json );

					editor.execute( new SetSceneCommand( scene ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'babylonmeshdata':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.BabylonLoader();

					var geometry = loader.parseGeometry( json );
					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'ctm':

				reader.addEventListener( 'load', function ( event ) {

					var data = new Uint8Array( event.target.result );

					var stream = new CTM.Stream( data );
					stream.offset = 0;

					var loader = new THREE.CTMLoader();
					loader.createModel( new CTM.File( stream ), function( geometry ) {

						geometry.sourceType = "ctm";
						geometry.sourceFile = file.name;

						var material = new THREE.MeshStandardMaterial();

						var mesh = new THREE.Mesh( geometry, material );
						mesh.name = filename;

						editor.execute( new AddObjectCommand( mesh ) );

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'dae':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var loader = new THREE.ColladaLoader();
					var collada = loader.parse( contents );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( collada.scene ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'fbx':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var loader = new THREE.FBXLoader();
					var object = loader.parse( contents );

					editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'glb':
			case 'gltf':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var loader = new THREE.GLTFLoader();
					loader.parse( contents, '', function ( result ) {

						result.scene.name = filename;
						editor.execute( new AddObjectCommand( result.scene ) );

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'js':
			case 'json':

			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					// 2.0

					if ( contents.indexOf( 'postMessage' ) !== - 1 ) {

						var blob = new Blob( [ contents ], { type: 'text/javascript' } );
						var url = URL.createObjectURL( blob );

						var worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data, file, filename );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					var data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data, file, filename );

				}, false );
				reader.readAsText( file );

				break;


			case 'kmz':

				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.KMZLoader();
					var collada = loader.parse( event.target.result );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( collada.scene ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'md2':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.MD2Loader().parse( contents );
					var material = new THREE.MeshStandardMaterial( {
						morphTargets: true,
						morphNormals: true
					} );

					var mesh = new THREE.Mesh( geometry, material );
					mesh.mixer = new THREE.AnimationMixer( mesh );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'obj':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var object = new THREE.OBJLoader().parse( contents );
					object.name = filename;

					editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'playcanvas':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.PlayCanvasLoader();
					var object = loader.parse( json );

					editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'ply':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.PLYLoader().parse( contents );
					geometry.sourceType = "ply";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'stl':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.STLLoader().parse( contents );
					geometry.sourceType = "stl";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );

				if ( reader.readAsBinaryString !== undefined ) {

					reader.readAsBinaryString( file );

				} else {

					reader.readAsArrayBuffer( file );

				}

				break;

			/*
			case 'utf8':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.UTF8Loader().parse( contents );
					var material = new THREE.MeshLambertMaterial();

					var mesh = new THREE.Mesh( geometry, material );

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsBinaryString( file );

				break;
			*/

			case 'vtk':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.VTKLoader().parse( contents );
					geometry.sourceType = "vtk";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'wrl':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var result = new THREE.VRMLLoader().parse( contents );

					editor.execute( new SetSceneCommand( result ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'zip':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var zip = new JSZip( contents );

					// BLOCKS

					if ( zip.files[ 'model.obj' ] && zip.files[ 'materials.mtl' ] ) {

						var materials = new THREE.MTLLoader().parse( zip.file( 'materials.mtl' ).asText() );
						var object = new THREE.OBJLoader().setMaterials( materials ).parse( zip.file( 'model.obj' ).asText() );
						editor.execute( new AddObjectCommand( object ) );

					}

				}, false );
				reader.readAsBinaryString( file );

				break;

			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;

		}

	};

	function handleJSON( data, file, filename ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.formatVersion !== undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		switch ( data.metadata.type.toLowerCase() ) {

			case 'buffergeometry':

				var loader = new THREE.BufferGeometryLoader();
				var result = loader.parse( data );

				var mesh = new THREE.Mesh( result );

				editor.execute( new AddObjectCommand( mesh ) );

				break;

			case 'geometry':

				var loader = new THREE.JSONLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				var geometry = result.geometry;
				var material;

				if ( result.materials !== undefined ) {

					if ( result.materials.length > 1 ) {

						material = new THREE.MultiMaterial( result.materials );

					} else {

						material = result.materials[ 0 ];

					}

				} else {

					material = new THREE.MeshStandardMaterial();

				}

				geometry.sourceType = "ascii";
				geometry.sourceFile = file.name;

				var mesh;

				if ( geometry.animation && geometry.animation.hierarchy ) {

					mesh = new THREE.SkinnedMesh( geometry, material );

				} else {

					mesh = new THREE.Mesh( geometry, material );

				}

				mesh.name = filename;

				editor.execute( new AddObjectCommand( mesh ) );

				break;

			case 'object':

				var loader = new THREE.ObjectLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				if ( result instanceof THREE.Scene ) {

					editor.execute( new SetSceneCommand( result ) );

				} else {

					editor.execute( new AddObjectCommand( result ) );

				}

				break;

			case 'app':

				editor.fromJSON( data );

				break;

		}

	}

};


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
	xhr.open( 'GET', '../asset/qin_v3/' + filename, true );
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

				// mesh.rotation.x = THREE.Math.degToRad( -90 );
				// mesh.rotation.z = THREE.Math.degToRad( 180 );

				if( emotion==='' ) mesh.name = name;
				else mesh.name = emotion;

				let basicElement = new BasicElement( name, mesh, emotion );
				characterStructure.addElement( basicElement );

				// editor.execute( new AddObjectCommand( mesh ) );
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
					if( prop === 'name' ) {
						characterStructure.character_mesh.name = loader[prop];
						continue;
					}

					if( typeof(loader[prop])==='string' ) {
						LoadFileName( prop, '', loader[prop] );
						continue;
					}

					if( typeof(loader[prop])==='object' ) {
						for( let prop2 in loader[prop] ) LoadFileName( prop, prop2, loader[prop][prop2] );
						continue;
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

