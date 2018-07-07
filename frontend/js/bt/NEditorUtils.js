"use strict";

function NEditorCreatePath ( a, b ) {
	let diff = {
		x: b.x - a.x,
		y: b.y - a.y
	};

	let pathStr = [
		'M' + a.x + ',' + a.y + ' C',
		a.x + diff.x / 3 * 2 + ',' + a.y + ' ',
		a.x + diff.x / 3 + ',' + b.y + ' ',
		b.x + ',' + b.y
	].join( '' );

	return pathStr;
}

var NEditorGetFullOffset = function ( el ) {
	function innerRecursive ( el ) {
		let offset = {
			top: el.offsetTop,
			left: el.offsetLeft
		};

		if ( el.offsetParent ) {
			var parentOff = innerRecursive( el.offsetParent );
			offset.top += parentOff.top;
			offset.left += parentOff.left;
		}

		return offset;
	};

	let offset = innerRecursive( el );
	offset.top -= 84;
	offset.left -= 300;
	return offset;
}
