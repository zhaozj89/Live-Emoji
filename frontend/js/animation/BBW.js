// "use strict";
//
// function laplacian_and_mass_matrices ( faces, vertices ) {
// 	/// 1 Create an N-by-N matrix A, where N is the number of vertices, that is initially zero.
// 	/// 2 Iterate over all edges (i,j), setting a 1 at the corresponding (i,j) and (j,i) location in A.
// 	/// 3 Create an N-by-N diagonal Mass matrix, where the i-th diagonal is the sum of the i-th row of A.
// 	/// 4 The Laplacian matrix is inverse( Mass )*(Mass - A). In other words,
// 	///   it is (Mass-A) followed by dividing each row by its diagonal element.
//
// 	/// Add your code here.
// 	//1
// 	let A = [];
// 	for ( let i = 0; i < vertices.length; ++i ) {
// 		A[ i ] = [];
// 		for ( let j = 0; j < vertices.length; ++j ) {
// 			A[ i ][ j ] = 0;
// 		}
// 	}
//
// 	//2
// 	for ( let f = 0; f < faces.length; ++f ) {
// 		let v1 = faces[ f ][ 0 ];
// 		let v2 = faces[ f ][ 1 ];
// 		let v3 = faces[ f ][ 2 ];
//
// 		A[ v1 ][ v2 ] = 1;
// 		A[ v2 ][ v1 ] = 1;
// 		A[ v2 ][ v3 ] = 1;
// 		A[ v3 ][ v2 ] = 1;
// 		A[ v1 ][ v3 ] = 1;
// 		A[ v3 ][ v1 ] = 1;
// 	}
//
// 	//3
// 	// let M = [];
// 	// for ( let i = 0; i < vertices.length; ++i ) {
// 	// 	M[ i ] = [];
// 	// 	for ( let j = 0; j < vertices.length; ++j ) {
// 	// 		M[ i ][ j ] = 0;
// 	// 	}
// 	// }
//
//
// 	let temp = [];
// 	for ( let i = 0; i < vertices.length; ++i ) {
// 		let sum = 0;
// 		for ( let j = 0; j < vertices.length; ++j ) {
// 			sum = numeric.add( sum, A[ i ][ j ] );
// 			temp[ i ] = sum;
// 		}
// 	}
//
// 	let M = numeric.diag( temp );
//
// 	//4
// 	// let L = [];
// 	// for ( let i = 0; i < vertices.length; ++i ) {
// 	// 	L[ i ] = [];
// 	// 	for ( let j = 0; j < vertices.length; ++j ) {
// 	// 		L[ i ][ j ] = 0;
// 	// 	}
// 	// }
//
// 	let L = numeric.ccsFull( numeric.ccsDot( numeric.ccsSparse( numeric.inv( M ) ), numeric.ccsSparse( numeric.sub( M, A ) ) ) );
// 	return [ L, M ];
//
// }
//
// function bbw ( faces, vertices, handles, mode ) {
//
// 	// Dmat
// 	let B;
// 	{
// 		let res = laplacian_and_mass_matrices( faces, vertices );
// 		let L = res[ 0 ];
// 		let M = res[ 1 ];
//
// 		B = numeric.ccsFull( numeric.ccsDot( numeric.ccsDot( numeric.ccsSparse( numeric.transpose( L ) ), numeric.ccsSparse( M ) ), numeric.ccsSparse( L ) ) );
// 	}
//
// 	// aeq
// 	let aeq = [];
// 	{
// 		for ( let i = 0; i < handles.length; ++i ) {
// 			aeq[ i ] = [];
// 			for ( let j = 0; j < vertices.length; ++j ) {
// 				aeq[ i ][ j ] = 0;
// 				if ( vertices[ handles[ i ] ] === vertices[ j ] ) {
// 					aeq[ i ][ j ] = 1;
// 				}
// 			}
// 		}
// 	}
//
// 	// non handles
// 	let non_handles = [];
// 	{
// 		let index = 0;
// 		for ( let i = 0; i < vertices.length; ++i ) {
// 			let flag = true;
// 			for ( let j = 0; j < handles.length; ++j ) {
// 				if ( vertices[ i ] === vertices[ handles[ j ] ] ) flag = false;
// 			}
// 			if ( flag === true ) {
// 				non_handles[ index ] = i;
// 				++index;
// 			}
// 		}
// 	}
//
// 	// age
// 	let age = [];
// 	{
// 		let previous_index = 0;
// 		for ( let i = 0; i < 2 * non_handles.length; ++i ) {
// 			age[ i ] = [];
// 			if ( ( i % 2 ) != 0 ) {
// 				for ( let j = 0; j < vertices.length; ++j ) {
// 					age[ i ][ j ] = 0;
// 					age[ i ][ previous_index ] = -1;
// 				}
// 			}
// 			else {
// 				for ( let j = 0; j < vertices.length; ++j ) {
// 					age[ i ][ j ] = 0;
// 					if ( vertices[ non_handles[ i ] ] === vertices[ j ] ) {
// 						age[ i ][ j ] = 1;
// 						previous_index = j;
// 					}
// 				}
// 			}
// 		}
// 	}
//
//
// 	// bge
// 	let bge = [];
// 	{
// 		for ( let i = 0; i < 2 * non_handles.length; ++i ) {
// 			if ( i % 2 == 0 ) bge[ i ] = 0;
// 			else bge[ i ] = -1;
// 		}
// 	}
//
// 	// Amat
// 	let constraint_transpose;
// 	{
// 		let index_age = 0;
// 		let constraint = numeric.clone( aeq );
// 		for ( let i = aeq.length; i < aeq.length + age.length; ++i ) {
// 			constraint[ i ] = age[ index_age ];
// 			++index_age;
// 		}
// 		constraint_transpose = numeric.transpose( constraint );
// 	}
//
// 	// beq
// 	let beq = [];
// 	for ( let i = 0; i < handles.length; ++i )
// 		beq[ i ] = 0;
//
// 	// bvec: bge+beq
// 	let bvec = numeric.clone( beq );
// 	{
// 		let index_bvec = 0;
// 		for ( let i = bvec.length; i < beq.length + bge.length; ++i ) {
// 			bvec[ i ] = bge[ index_bvec ];
// 			++index_bvec;
// 		}
// 	}
//
// 	// dvec
// 	let dvec = numeric.rep( [ vertices.length ], 0 );
//
// 	// meq
// 	let meq = handles.length;
//
// 	// vertices by handles
// 	let vertices_by_handles_transpose = [];
// 	for ( let i = 0; i < handles.length; ++i ) {
// 		vertices_by_handles_transpose[ i ] = [];
// 		for ( let j = 0; j < vertices.length; ++j ) {
// 			vertices_by_handles_transpose[ i ][ j ] = 0;
// 		}
// 	}
//
// 	// for each handle
// 	if ( mode === "bounded" ) {
// 		for ( let i = 0; i < handles.length; ++i ) {
// 			bvec[ i ] = 1;
// 			let res = numeric.solveQP( B, dvec, constraint_transpose, bvec, meq );
// 			vertices_by_handles_transpose[ i ] = res.solution;
// 			bvec[ i ] = 0;
// 		}
// 	}
// 	else {
// 		for ( let i = 0; i < handles.length; ++i ) {
// 			beq[ i ] = 1;
// 			let aeq_transpose = numeric.transpose( aeq );
// 			let res = numeric.solveQP( B, dvec, aeq_transpose, beq, meq );
// 			vertices_by_handles_transpose[ i ] = res.solution;
// 			beq[ i ] = 0;
// 		}
// 	}
// 	let vertices_by_handles = numeric.transpose( vertices_by_handles_transpose );
//
// 	//normalization
// 	for ( let i = 0; i < vertices_by_handles.length; ++i ) {
// 		let sum = 0;
// 		for ( let j = 0; j < handles.length; ++j ) {
// 			sum = numeric.add( sum, vertices_by_handles[ i ][ j ] );
// 		}
// 		vertices_by_handles[ i ] = numeric.div( vertices_by_handles[ i ], sum );
// 	}
// 	return vertices_by_handles;
// }
//
// function linear_blend_skin_2D ( vertices, weights, transforms ) {
// 	let res = [];
// 	for ( let i = 0; i < vertices.length; ++i ) {
// 		let sum = [ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ];
// 		for ( let j = 0; j < transforms.length; ++j ) {
// 			sum = numeric.add( sum, numeric.mul( weights[ i ][ j ], transforms[ j ] ) );
// 		}
// 		res[ i ] = numeric.dot( sum, [ vertices[ i ][ 0 ], vertices[ i ][ 1 ], 1.0 ] );
// 	}
// 	return res;
// }
//
