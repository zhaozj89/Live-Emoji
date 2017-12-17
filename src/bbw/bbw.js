"use strict";

/*
When debugging:

numeric.prettyPrint( x );

// To print only non-zeros of a dense matrix B:
for( var row = 0; row < B.length; ++row ) for( var col = 0; col < B[0].length; ++col ) if( Math.abs( B[row][col] ) > 1e-5 ) console.log( "( " + row + ", " + col + " ): " + B[row][col] );
// This can be written succinctly as:
console.log( numeric.transpose( numeric.ccsGather( numeric.ccsSparse( B ) ) ) );
*/

// Patch numeric to add a sparse matrix transpose routine.
numeric.ccsTranspose = function( A )
{
    var rows_cols_vals = numeric.ccsGather( A );
    // Swap the rows and cols.
    return numeric.ccsScatter( [ rows_cols_vals[1], rows_cols_vals[0], rows_cols_vals[2] ] );
}
// Patch numeric to add a sparse matrix diagonal routine.
numeric.ccsDiag = function( diag )
{
    var ij = [];
    for( var i = 0; i < diag.length; ++i ) ij.push( i );
    return numeric.ccsScatter( [ ij, ij, diag ] );
}
// Patch numeric to add a sparse matrix identity.
numeric.ccsIdentity = function( N )
{
    return numeric.ccsDiag( numeric.rep( [N], 1. ) );
}
// Patch numeric to add a sparse matrix column sum.
// NOTE: There is no sparse matrix row sum, because it would have to first compute the transpose each time.
numeric.ccsSumColumn = function( A, col )
{
    var sum = 0.;
    for( var k = A[0][col]; k < A[0][col+1]; ++k ) sum += A[2][k];
    return sum;
}

// From: http://stackoverflow.com/questions/15313418/javascript-assert
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

/*
Given 'vertices', an array of N 2D points pi = [xi, yi] (equivalently, an N-by-2 array),
and 'faces', an array of F triplets of integer indices into vertices,
where the triplet faces[f][0], faces[f][1], faces[f][2]
are the indices of the three vertices that make up triangle f,
return two N-by-N sparse matrices, [ Laplacian, Mass ].
*/
function laplacian_and_mass_matrices( faces, vertices )
{
    /// 1 Create an N-by-N matrix A, where N is the number of vertices, that is initially zero.
    /// 2 Iterate over all edges (i,j), setting a 1 at the corresponding (i,j) and (j,i) location in A.
    /// 3 Create an N-by-N diagonal Mass matrix, where the i-th diagonal is the sum of the i-th row of A.
    /// 4 The Laplacian matrix is inverse( Mass )*(Mass - A). In other words,
    ///   it is (Mass-A) followed by dividing each row by its diagonal element.
    
    /// Add your code here.
    //1
	
	var A = []
	for(var i = 0; i<vertices.length ; i++){
		A[i]=[];
		for(var j = 0; j<vertices.length ; j++){
			A[i][j] = 0;
		}
	}
	//2
	for(var f = 0 ; f<faces.length; f++){
		var v1 = faces[f][0];
		var v2 = faces[f][1];
		var v3 = faces[f][2];
		
		A[v1][v2] = 1;
		A[v2][v1] = 1;
		A[v2][v3] = 1;
		A[v3][v2] = 1;
		A[v1][v3] = 1;
		A[v3][v1] = 1;
	}	
	//3
	var M = []
	for(var i = 0; i<vertices.length ; i++){
		M[i] = [];
		for(var j = 0; j<vertices.length ; j++){
			M[i][j] = 0;
		}
	}
	
	
	var temp = [];
	for(var i = 0; i<vertices.length ; i++){
		var sum = 0;
		for(var j = 0; j<vertices.length ; j++){
				sum = numeric.add(sum, A[i][j]);
				temp[i] = sum ;
		}
	}
	
	M = numeric.diag(temp);
	
	//4
	var L = [];
	for(var i = 0; i<vertices.length ; i++){
		L[i] = [];
		for(var j = 0; j<vertices.length ; j++){
			L[i][j] = 0;
		}
	}
	
	L = numeric.ccsFull(numeric.ccsDot(numeric.ccsSparse(numeric.inv(M)),numeric.ccsSparse(numeric.sub(M,A))));
	return [ L , M ]; 

}

/*
Given 'faces' and 'vertices' as would be passed to laplacian_and_mass_matrices(),
an array of H integer indices into 'vertices' representing the handle vertices,
and a string 'mode' which will be one of 'bounded' or 'unbounded',
return an #vertices-by-#handles weight matrix W, where W[i][j] is the influence weight
of the j-th handle on the i-th vertex.
Each row of W must sum to 1.
If mode === 'bounded', apply inequality constraints so that the weights are
all between 0 and 1.
*/
function bbw( faces, vertices, handles, mode )
{

    /// 1 Create the laplacian L and mass M matrices.
    /// 2 The bilaplacian B is L.T * M * L.
    /// 3 Create the constraint matrix. There will be an equality constraint for
    ///   every handle vertex, and 2 inequality constraints for the remaining vertices.
    /// 4 Solve once for each handle, setting each handles constraint value to 1 in turn.
    /// 5 Normalize each vertex's weights so that they sum to 1.
    
    /// Add your code here.
    
	console.log("in bbw");
	var temp = laplacian_and_mass_matrices( faces, vertices );
	var	L = temp[0];
	var M = temp[1];
	console.log("vertices" + vertices.length);
	console.log("handles" + handles.length);
	var non_handles_length = vertices.length - handles.length ; 
	console.log("nonhandles" + non_handles_length); 
	
	//Dmat
	var B = numeric.ccsFull(numeric.ccsDot(numeric.ccsDot(numeric.ccsSparse(numeric.transpose(L)), numeric.ccsSparse(M)), numeric.ccsSparse(L)));
	console.log("after dmat " + B.length);

	//aeq
	console.log("vertices[183]" +vertices[183]);
	var aeq = [];
	for(var i = 0; i < handles.length; i++){
		aeq[i] = [];
		for( var j = 0; j< vertices.length ; j++){
				aeq[i][j] = 0;
				if(vertices[handles[i]] == vertices[j]){
					console.log("in if aeq" + j);
					aeq[i][j] = 1;
				}	
		}	
	}
	console.log("in bbw after aeq for");
	console.log("in bbw after aeq length" +aeq);
	
	//non handles
	var index = 0;
	var non_handles = [];
	
	for(var i = 0; i < vertices.length; i++){
		var flag = true;
		for( var j = 0; j< handles.length ; j++){
				if(vertices[i] == vertices[handles[j]])
					flag = false;
		}
		if(flag == true){
			non_handles[index] = i;
			index++;
		}
	}
	console.log("handles" + handles);
	console.log("in bbw after nonhandles" + non_handles);
	
	//age
	var age = [];
	var previous_index = 0;
	for(var i = 0; i < 2*non_handles.length; i++){
		age[i] = [];
		if((i%2)!=0){
			for( var j = 0; j< vertices.length ; j++){
				age[i][j] = 0;
				age[i][previous_index] = -1;
			}
		}
		else{
			for( var j = 0; j< vertices.length ; j++){
				age[i][j] = 0;
				if(vertices[non_handles[i]] == vertices[j]){
					age[i][j] = 1;
					previous_index = j;
				}	
			}
		}
		
	}
	console.log("in bbw after age length " + age);
	
	//bge
	
	var previous_index_bge = 0;
	var bge = [];
	for(var i = 0; i < 2*non_handles.length; i++){
		if(i%2 == 0)
			bge[i] = 0;
		else
			bge[i]= -1;
		
	}
	
	console.log("in bbw after bge");
	
	//constraint
	var constraint = [[]];
	var index_age = 0;
	var constraint  = aeq;
	var cons = aeq.length+age.length;
	for( var i = aeq.length; i < cons; i++){
		console.log("in bbw constraint for");
		constraint[i] = age[index_age];
		index_age++;
	}
	console.log("in bbw before constraint length" + constraint);
	
	//Amat;
	var constraint_transpose = numeric.transpose(constraint);
	console.log("constraint_transpose"+ constraint_transpose.length) ;
	console.log("in bbw after amat");
	
	//beq
	var beq =[];
	for(var i = 0; i< handles.length;i++)
		beq[i] = 0;
	console.log("in bbw after beq");	

	//bge+beq ( bvec)
	var index_bvec = 0;
	var bvec = beq;
	var bvec_size = beq.length + bge.length 
	for(var i = bvec.length; i< bvec_size; i++){
		bvec[i] = bge[index_bvec];
		index_bvec++;
	}
	console.log("in bbw after bvec");

	//dvec
	var dvec = numeric.rep([vertices.length], 0);
	
	//meq
	var meq = handles.length;
	
	//vertices by handles
	var vertices_by_handles_transpose = [];
	for(var i = 0; i<handles.length ; i++){
		vertices_by_handles_transpose[i] = [];
		for(var j = 0 ; j < vertices.length ; j++){
			vertices_by_handles_transpose[i][j] = 0;
		}
	}
	console.log("vertices_by_handles_transpose" + numeric.transpose(vertices_by_handles_transpose).length);


	//for each handle
	if(mode == "bounded"){
		for(var i = 0; i< handles.length; i++){
			bvec[i] = 1;
			var result = numeric.solveQP(B, dvec ,constraint_transpose, bvec,meq );
			var sol = result.solution;
			console.log("result solution" + ((sol)));
			vertices_by_handles_transpose[i] = sol;
			bvec[i] = 0;
			console.log("after solve" + result.message);
		}
	}else{
		for(var i = 0; i< handles.length; i++){
			beq[i] = 1;
			var aeq_transpose = numeric.transpose(aeq);
			var result = numeric.solveQP(B, dvec ,aeq_transpose, beq,meq );
			var sol = result.solution;
			console.log("result solution" + ((sol)));
			vertices_by_handles_transpose[i] = sol;
			beq[i] = 0;
			console.log("after solve" + result.message);
		}	
	}
	console.log("vertices by transpose"+ vertices_by_handles_transpose);	
	console.log("vertices_by_handles_transpose" + (vertices_by_handles_transpose).length);
	var vertices_by_handles = numeric.transpose(vertices_by_handles_transpose);
	console.log("vertices by handles" + vertices_by_handles);
	
	//normalising
	
	for(var i = 0; i<vertices_by_handles.length ; i++){
		var sum = 0;
		for(var j = 0 ; j<handles.length; j++){
			console.log(" before sum" + j);
			sum = numeric.add(sum, vertices_by_handles[i][j]);
			
			console.log(" after sum" + sum);
		}
		vertices_by_handles[i] = numeric.div(vertices_by_handles[i], sum);
	}
    return vertices_by_handles; 
}

/*
Given an array of 2D 'vertices',
an array of #vertices-by-#transforms 'weights',
and an array of 3x3 matrices 'transforms',
returns the linear blend skinning deformation of each vertex.
*/
function linear_blend_skin_2D( vertices, weights, transforms )
{
    /// Add your code here.
    var result = []; 
    for (var i = 0; i < vertices.length; i++) {
        result[i] = [];
        for (var j = 0; j < 2; j++) {
            result[i][j] = 0;
        }
    }
    for (var i = 0; i < vertices.length; i++) {
        var sum = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];  
        for (var j = 0; j < transforms.length; j++) {
            sum = numeric.add(sum, numeric.mul(weights[i][j], transforms[j]));
        }
        result[i] = numeric.dot(sum, [vertices[i][0], vertices[i][1], 1.0]);
    }
    return result;
}

