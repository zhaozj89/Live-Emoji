"use strict";

// simply port from http://blog.mmacklin.com/2012/06/27/2d-fem/#ref3

// parameters
const channel = 4;
const resolution = 0.08;

function CalculateCircumcircle ( _p, _q, _r ) {
  const p = _p.clone();
  const q = _q.clone();
  const r = _r.clone();

	let pq = q.sub(p);
	let qr = r.sub(q);

	console.assert(pq.cross(qr)>=0);

	let a = p.add(q).multiplyScalar(0.5);
	let b = q.add(r).multiplyScalar(0.5);
	let u = new Vector2(-pq.y, pq.x); // PerpCCW

	let d = u.dot(qr);
	let t = b.sub(a).dot(qr) / d;

	let center = a.add(u.multiplyScalar(t));
	let radius = center.sub(p).length();

	return [center, radius];
}

function TriArea(a, b, c) {
	return b.sub(a).cross(c.sub(a)) * 0.5;
}

class Edge {
	constructor(i, j) {
		this.indices = new Int32Array(2);
		this.indices[0] = i;
		this.indices[1] = j;
	}

	at(i) {
		console.assert(i<2);
		return this.indices[i];
	}

	equal(e) {
		return ( (this.at(0)==e.at(0)) && (this.at(1)==e.at(1)) ) || ( (this.at(0)==e.at(1)) && (this.at(1)==e.at(0)) );
	}
}

class Triangle {
	constructor( i, j, k, points ) {
		this.indices = new Int32Array(3);
		this.indices[0] = i;
		this.indices[1] = j;
		this.indices[2] = k;

		let res = CalculateCircumcircle(points[i], points[j], points[k]);
		this.center = res[0];
		this.radius = res[1];
	}
};

class Triangulation {
	constructor( points ) {
    let num_points = points.length;

		this.vertices = new Array();
		this.triangles = new Array();

		let lower = new Vector2(MAX_VAL, MAX_VAL);
    let upper = new Vector2(MIN_VAL, MIN_VAL);

		for( let i=0; i<points.length; ++i ) {
				lower.x = MIN( lower.x, points[i].x );
				lower.y = MIN( lower.y, points[i].y );
				upper.x = MAX( upper.x, points[i].x );
				upper.y = MAX( upper.y, points[i].y );
		}

		let margin = upper.sub(lower).multiplyScalar(1.0);

		lower = lower.sub(margin);
		upper = upper.add(margin);

		let extents = upper.sub(lower);

		this.vertices.push( lower );
		this.vertices.push( lower.add( new Vector2(extents.x, 0).multiplyScalar(2) ) );
		this.vertices.push( lower.add( new Vector2(0, extents.y).multiplyScalar(2) ) );

		this.triangles.push(new Triangle(0, 1, 2, this.vertices));

		for(let i=0; i<num_points; ++i) {
			this.Insert(points[i]);
		}

		// assert valid
		console.assert(this.Valid());
	}

	Insert( _p ) {
    const p = _p.clone();

		let edges = new Array();

		let i = this.vertices.length;
		this.vertices.push( p );

		for(let j=0; j<this.triangles.length;) {
			let t = this.triangles[j];

			if( t.center.sub(p).length() < t.radius ) {
				for( let e=0; e<3; ++e ) {
					let edge = new Edge(t.indices[e], t.indices[(e+1)%3]);

          let idx = edges.findIndex(function (edge) {return this.equal(edge);}, edge);

          if(idx==-1)
            edges.push(edge);
          else
            edges.splice(idx, 1);
				}
				this.triangles.splice(j, 1);
			}
			else {
				++j;
			}
		}

		for(let e=0; e<edges.length; ++e) {
			let t = new Triangle(edges[e].at(0), edges[e].at(1), i, this.vertices);
			this.triangles.push( t );
		}

		// assert valid
		console.assert(this.Valid());
	}

	TriangleQuality(i) {
		const t = this.triangles[i];

		let MINEdgeLength = MAX_VAL;

		for(let e=0; e<3; ++e) {
			let p = this.vertices[t.indices[e]];
			let q = this.vertices[t.indices[(e+1)%3]];

			MINEdgeLength = MIN(MINEdgeLength, p.sub(q).length());
		}

		return t.radius/MINEdgeLength;
	}

	Valid() {
		for(let i=0; i<this.triangles.length; ++i) {
			const t = this.triangles[i];
			for(let j=0; j<this.vertices.length; ++j) {
				if(t.indices[0]==j || t.indices[1]==j || t.indices[2]==j) continue;

				let eps = 1.0e-4;
				let d = ( t.center.sub(this.vertices[j]) ).length();

				if(d < t.radius-eps) return false;
			}
		}
		return true;
	}
};

//
function TriangulateVariational ( points, bpoints, iterations ) {

  let num_points = points.length;
  let num_bpoints = bpoints.length;

	let points_out = new Array();
	let tris_out = new Array();

	let mesh;
	let mypoints;
	let myweights;

	mypoints = CopyVector2Array(points);
	for (let k=0; k<iterations; ++k) {
		 mesh = new Triangulation(mypoints);

		 mypoints = new Array(mesh.vertices.length-3);
		 myweights = new Array(mesh.vertices.length-3);

     if(mypoints.length<=0) return null;

		 mypoints.fill( new Vector2(0,0) );
		 myweights.fill( 0 );

		 for(let i=0; i<num_bpoints; ++i) {
			 let closest = 0;
			 let closestDistSq = MAX_VAL;

			 const b = new Vector2(bpoints[i].x, bpoints[i].y);
			 for(let j=0; j<num_points; ++j) {
				 let dSq = mesh.vertices[j+3].sub(b);
				 dSq = dSq.dot(dSq);

				 if(dSq<closestDistSq) {
					 closest = j;
					 closestDistSq = dSq;
				 }
			 }
			 mypoints[closest] = mypoints[closest].sub(b);
			 myweights[closest] = myweights[closest]-1;
		 }

		 for(let i=0; i<mesh.triangles.length; ++i) {
			 const t = mesh.triangles[i];

			 if(t.indices[0]<3 || t.indices[1]<3 || t.indices[2]<3) continue;

			 let a = mesh.vertices[t.indices[0]];
			 let b = mesh.vertices[t.indices[1]];
			 let c = mesh.vertices[t.indices[2]];

			 let w = TriArea(a, b, c);

			 for(let v=0; v<3; ++v) {
				 let s=t.indices[v]-3;
				 if(myweights[s]>=0) {
					 mypoints[s] = mypoints[s].add(t.center.multiplyScalar(w));
					 myweights[s] += w;
				 }
			 }
		 }

     for(let i=0; i<mypoints.length; ++i) {
			 mypoints[i] = mypoints[i].divideScalar(myweights[i]);
		 }
	}

	mesh = new Triangulation(mypoints);

  let mesh_vertices_backup = CopyVector2Array(mesh.vertices);
	mypoints = mesh_vertices_backup.splice(3, mesh.vertices.length-3);

	for(let i=0; i<mesh.triangles.length;) {
		let q = mesh.TriangleQuality(i);

		if(q>3.0) mesh.triangles.splice(i, 1);
		else ++i;
	}

	for(let i=0; i<mypoints.length; ++i) {
		points_out.push(new Vector2(mypoints[i].x, mypoints[i].y));
	}

	for(let i=0; i<mesh.triangles.length; ++i) {
		const t = mesh.triangles[i];

		if(t.indices[0]<3 || t.indices[1]<3 || t.indices[2]<3) continue;

		let a = mesh.vertices[t.indices[0]];
		let b = mesh.vertices[t.indices[1]];
		let c = mesh.vertices[t.indices[2]];

		tris_out.push(t.indices[0]-3);
		tris_out.push(t.indices[1]-3);
		tris_out.push(t.indices[2]-3);
	}

	return [points_out, tris_out];
}

// input: png object
// output: mesh object
var ZMesher = function ( png ) {

	// storage
	let points = new Array();
	let bpoints = new Array();

	const width = png.getWidth();
	const height = png.getHeight();

	const inc = int32( resolution * width );
	const margin = int32 (MAX( (inc-1)/2, 1 ) );

	// distribute points interior to the object or near it's boundary
	for ( let y=0; y<height; y+=inc ) {
		for ( let x=0; x<width; x+=inc ) {
			let n = Neighbours( png, x, y, margin );
			if( n>0 )
				points.push( new Vector2( x/width, y/height ) );
		}
	}

	// distribute points on the boundary
	for ( let y=0; y<height; ++y ) {
		for ( let x=0; x<width; ++x ) {
			if( EdgeDetect( png, x, y ) )
				bpoints.push( new Vector2( x/width, y/height ) );
		}
	}

	let res = TriangulateVariational(points, bpoints, 1);

  if(res==null) return null;

	let points_out = res[0];
	let tris_out = res[1];

  // discard triangles whose centroid is not inside the shape
  for(let i=0; i<tris_out.length;) {
    const p = points_out[tris_out[i]].clone();
    const q = points_out[tris_out[i+1]].clone();
    const r = points_out[tris_out[i+2]].clone();

    const c = p.add(q).add(r).divideScalar(3);

    const x = int32( c.x * width );
    const y = int32( c.y * height );

    if( SampleClamp(png, x, y)===0 )
      tris_out.splice(i, 3);
    else
      i += 3;
  }


	let geometry = new THREE.Geometry();

	for(let i=0; i<points_out.length; ++i)
		geometry.vertices.push(new Vector3( points_out[i].x, points_out[i].y, 0 ));


	for(let i=0; i<tris_out.length; i+=3){
    geometry.faces.push( new THREE.Face3(tris_out[i], tris_out[i+1], tris_out[i+2]) );
    geometry.faceVertexUvs[0].push([
      new Vector2(points_out[tris_out[i]].x, points_out[tris_out[i]].y),
      new Vector2(points_out[tris_out[i+1]].x, points_out[tris_out[i+1]].y),
      new Vector2(points_out[tris_out[i+2]].x, points_out[tris_out[i+2]].y)
    ]);
  }

  geometry.uvsNeedUpdate = true;

  const dataTexture = new THREE.DataTexture(
    png.pixels,
    width,
    height,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
    THREE.UVMapping);
  dataTexture.needsUpdate = true;

  const dataMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    map: dataTexture
  });
  dataMaterial.needsUpdate = true;

	// geometry.computeFaceNormals();
	// geometry.computeVertexNormals();

	// let material = new THREE.MeshNormalMaterial();
	let mesh = new THREE.Mesh( geometry, dataMaterial );

	return mesh;

	/*
	let faceIndices = THREE.ShapeUtils.triangulateShape ( points, [] );


	let geometry = new THREE.Geometry();

	for(let i=0; i<points.length; ++i)
		geometry.vertices.push(new Vector3( points[i].x, points[i].y, 0 ));


	for(let i=0; i<faceIndices.length; ++i)
		geometry.faces.push( new THREE.Face3(faceIndices[i][0], faceIndices[i][1], faceIndices[i][2]));

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	let material = new THREE.MeshNormalMaterial();
	let mesh = new THREE.Mesh( geometry, material );

	return mesh;
	*/
}
