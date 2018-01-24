var CreateTitle = function ( name ) {
	let dom = document.createElement( 'div' );
	dom.classList.add( 'x-node' );
	dom.setAttribute( 'title', name );
	return dom;
}

var CreateOutput = function ( that ) {
	let dom = document.createElement( 'span' );
	dom.classList.add( 'x-output' );
	dom.textContent = '';

	dom.onclick = function( event ){
		if ( NEDITOR_MOUSE_INFO.currentInput && !that.ownsInput(NEDITOR_MOUSE_INFO.currentInput) ) {
			that.connectFrom(NEDITOR_MOUSE_INFO.currentInput);
			NEDITOR_MOUSE_INFO.currentInput = undefined;
		}
		event.stopPropagation();
	};

	return dom;
}

var CreatePlaceholder = function () {
	let dom = document.createElement( 'div' );
	dom.setAttribute( 'style', 'width: 100%' );
	dom.setAttribute( 'style', 'height: 50px' );
	return dom;
}

var CreateInput = function ( that ) {
	let dom = document.createElement('div');
	dom.textContent = that.type + ':  ';
	dom.title = that.type;
	dom.classList.add('x-connection');
	dom.classList.add('empty');

	dom.onclick = function(event){
		if (NEDITOR_MOUSE_INFO.currentInput) {
			if (NEDITOR_MOUSE_INFO.currentInput.path.hasAttribute('d'))
				NEDITOR_MOUSE_INFO.currentInput.path.removeAttribute('d');
			if (NEDITOR_MOUSE_INFO.currentInput.node) {
				NEDITOR_MOUSE_INFO.currentInput.node.detachInput(NEDITOR_MOUSE_INFO.currentInput);
				NEDITOR_MOUSE_INFO.currentInput.node = undefined;
			}
		}

		NEDITOR_MOUSE_INFO.currentInput = that;
		if (that.node){
			that.node.detachInput(that);
			that.domElement.classList.remove('filled');
			that.domElement.classList.add('empty');
		}

		event.stopPropagation();
	};

	return dom;
}

var CreatePath = function ( canvas ) {
	let path = document.createElementNS(canvas.ns, 'path');
	path.setAttributeNS(null, 'stroke', '#8e8e8e');
	path.setAttributeNS(null, 'stroke-width', '2');
	path.setAttributeNS(null, 'fill', 'none');
	canvas.appendChild(path);
	return path;
}

// var CreateTextArg = function ( title ) {
// 	let dom = document.createElement('div');
// 	dom.textContent = title;
//
// 	dom.onclick = function (event) {
// 		event.stopPropagation();
// 	};
//
// 	return dom;
// }

