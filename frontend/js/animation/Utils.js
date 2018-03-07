"use strict";

// macro
const int32 = Math.floor;
const MAX = Math.max;
const MIN = Math.min;

const MAX_VAL = Number.MAX_VALUE;
const MIN_VAL = -Number.MAX_VALUE;

const Vector2 = THREE.Vector2;
const Vector3 = THREE.Vector3;

Vector2.prototype.dot = function ( rhs ) {
	return this.x * rhs.x + this.y * rhs.y;
}

Vector2.prototype.add = function ( rhs ) {
	let res = new Vector2();
	res.x = this.x + rhs.x;
	res.y = this.y + rhs.y;
	return res;
}

Vector2.prototype.sub = function ( rhs ) {
	let res = new Vector2();
	res.x = this.x - rhs.x;
	res.y = this.y - rhs.y;
	return res;
}

Vector2.prototype.multiplyScalar = function ( rhs ) {
	let res = new Vector2();
	res.x = this.x * rhs;
	res.y = this.y * rhs;
	return res;
}

Vector2.prototype.divideScalar = function ( rhs ) {
	console.assert( rhs !== 0 );

	let res = new Vector2();
	res.x = this.x / rhs;
	res.y = this.y / rhs;
	return res;
}

Vector2.prototype.cross = function ( rhs ) {
	return ( this.x * rhs.y - this.y * rhs.x );
}

Vector2.prototype.normalize = function () {
	let dist = Math.sqrt( this.x * this.x + this.y * this.y );
	this.x /= dist;
	this.y /= dist;
	return;
}


Vector2.prototype.length = function () {
	let dist = Math.sqrt( this.x * this.x + this.y * this.y );
	return dist;
}

var CopyVector2Array = function ( arr ) {
	let res = new Array();

	for ( let i = 0; i < arr.length; ++i ) {
		let el_new = arr[ i ].clone();
		res.push( el_new );
	}

	return res;
}

var ArrCopy = function ( arr ) {
	if ( typeof obj !== 'object' ) return;
	return JSON.parse( JSON.stringify( arr ) );
}

var ObjShallowCopy = function ( obj ) {
	if ( typeof obj !== 'object' ) return;
	let newObj = obj instanceof Array ? [] : {};
	for ( let key in obj ) {
		if ( obj.hasOwnProperty( key ) ) {
			newObj[ key ] = obj[ key ];
		}
	}
	return newObj;
}

var ObjDeepCopy = function ( obj ) {
	if ( typeof obj !== 'object' ) return;
	let newObj = obj instanceof Array ? [] : {};
	for ( let key in obj ) {
		if ( obj.hasOwnProperty( key ) ) {
			newObj[ key ] = typeof obj[ key ] === 'object' ? ObjDeepCopy( obj[ key ] ) : obj[ key ];
		}
	}
	return newObj;
}

// TODO, find a better way
function ImageData2Image ( imagedata ) {
	var canvas = document.createElement( 'canvas' );
	var ctx = canvas.getContext( '2d' );
	canvas.width = imagedata.width;
	canvas.height = imagedata.height;
	ctx.putImageData( imagedata, 0, 0 );

	var image = new Image();
	image.src = canvas.toDataURL();
	return image;
}
