"use strict";

// macro
const int32 = Math.floor;
const MAX = Math.max;
const MIN = Math.min;

const MAX_VAL = Number.MAX_VALUE;
const MIN_VAL = -Number.MAX_VALUE;

const Vector2 = THREE.Vector2;
const Vector3 = THREE.Vector3;

Vector2.prototype.dot = function (rhs) {
  return this.x*rhs.x + this.y*rhs.y;
}

Vector2.prototype.add = function (rhs) {
	let res = new Vector2();
	res.x = this.x + rhs.x;
	res.y = this.y + rhs.y;
	return res;
}

Vector2.prototype.sub = function (rhs) {
	let res = new Vector2();
	res.x = this.x - rhs.x;
	res.y = this.y - rhs.y;
	return res;
}

Vector2.prototype.multiplyScalar = function (rhs) {
	let res = new Vector2();
	res.x = this.x * rhs;
	res.y = this.y * rhs;
	return res;
}

Vector2.prototype.divideScalar = function (rhs) {
	console.assert(rhs!==0);

	let res = new Vector2();
	res.x = this.x / rhs;
	res.y = this.y / rhs;
	return res;
}

Vector2.prototype.cross = function (rhs) {
  return (this.x*rhs.y - this.y*rhs.x);
}

var CopyVector2Array = function (arr) {
  let res = new Array();

  for(let i=0; i<arr.length; ++i) {
    let el_new = arr[i].clone();
    res.push(el_new);
  }

  return res;
}


// Array.prototype.resize = function ( size, defval ) {
//     while (this.length > size) { this.pop(); }
//     while (this.length < size) { this.push(defval); }
// }

// console.assert = function() {};

var ArrCopy = function ( arr ) {
  if (typeof obj !== 'object') return;
  return JSON.parse( JSON.stringify(arr) );
}

var ObjShallowCopy = function(obj) {
    if (typeof obj !== 'object') return;
    let newObj = obj instanceof Array ? [] : {};
    for (let key in obj) {
        // if (obj.hasOwnProperty(key))
        {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

var ObjDeepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    let newObj = obj instanceof Array ? [] : {};
    for (let key in obj) {
        // if (obj.hasOwnProperty(key))
        {
            newObj[key] = typeof obj[key] === 'object' ? ObjDeepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}

class ZVector2 {
  constructor(_x, _y) {
    if(_x instanceof ZVector2) {
      let res = _x.clone();
      return res;
    }
    else {
      this.x = _x;
      this.y = _y;
    }
  }

  clone() {
    let res = new ZVector2(this.x, this.y);
    return res;
  }
};


// functions
function SampleClamp (png, x, y) {
  const width = png.getWidth();
  const height = png.getHeight();

  const ix = MIN( MAX( 0, x ), width-1 );
  const iy = MIN( MAX( 0, y ), height-1 );

  const pixel = png.getPixel( ix, iy );

  return (pixel[0]+pixel[1]+pixel[2])/3;
}

function Neighbours ( png, cx, cy, margin ) {
	const width = png.getWidth();
	const height = png.getHeight();

	const xmin = int32( MAX( 0, cx-margin ) );
	const xmax = int32( MIN( cx+margin, width-1 ) );
	const ymin = int32( MAX( 0, cy-margin ) );
	const ymax = int32( MIN( cy-margin, height-1 ) );

	let count = 0;

	for ( let y=ymin; y<=ymax; ++y ) {
		for ( let x=xmin; x<xmax; ++x ) {
			let pixel = png.getPixel(x, y);
			if( (pixel[0] + pixel[1] + pixel[2])/3 !== 0 ) ++count;
		}
	}

	return count;
}

function EdgeDetect ( png, cx, cy ) {
	const width = png.getWidth();
	const height = png.getHeight();

	if( Boolean(SampleClamp(png, cx+1, cy)!==0) !== Boolean(SampleClamp(png, cx-1, cy)!==0))
		return true;

	if( Boolean(SampleClamp(png, cx, cy+1)!==0) !== Boolean(SampleClamp(png, cx, cy-1)!==0))
		return true;

	return false;
}
