var CreateTitle = function ( name ) {
	let dom = document.createElement( 'div' );
	dom.classList.add( 'x-node' );
	dom.setAttribute( 'title', name );
	return dom;
};

var CreateRemoveButton = function ( that ) {
	let dom = document.createElement( 'button' );
	dom.classList.add( 'delete' );
	dom.textContent = 'X';

	$( dom ).on( 'click', function () {

		for ( let i = 0; i < that.inputs.length; ++i ) {
			if ( that.inputs[ i ].node !== null )
				that.inputs[ i ].node.detachInput( that.inputs[ i ] );
		}

		if( that.parentInput!==null ) {
			that.parentInput.domElement.classList.remove( 'filled' );
			that.parentInput.domElement.classList.add( 'empty' );
			that.parentInput.currentNode.inputs = [];

			that.detachInput( that.parentInput );

		}

		that.domElement.remove();
	} );
	return dom;
};

var CreateOutput = function ( that ) {
	let dom = document.createElement( 'span' );
	dom.classList.add( 'x-output' );
	dom.textContent = '';

	dom.onclick = function ( event ) {
		if ( NEDITOR_MOUSE_INFO.currentInput && !that.ownsInput( NEDITOR_MOUSE_INFO.currentInput ) ) {
			that.connectFrom( NEDITOR_MOUSE_INFO.currentInput );
			that.parentInput = NEDITOR_MOUSE_INFO.currentInput;
			NEDITOR_MOUSE_INFO.currentInput = undefined;
		}
		event.stopPropagation();
	};

	return dom;
};

var CreateInput = function ( that ) {
	let dom = document.createElement( 'div' );
	dom.classList.add( 'x-connection' );
	dom.classList.add( 'empty' );

	dom.onclick = function ( event ) {
		if ( NEDITOR_MOUSE_INFO.currentInput ) {
			if ( NEDITOR_MOUSE_INFO.currentInput.path.hasAttribute( 'd' ) )
				NEDITOR_MOUSE_INFO.currentInput.path.removeAttribute( 'd' );
			if ( NEDITOR_MOUSE_INFO.currentInput.node ) {
				NEDITOR_MOUSE_INFO.currentInput.node.detachInput( NEDITOR_MOUSE_INFO.currentInput );
				NEDITOR_MOUSE_INFO.currentInput.node = undefined;
			}
		}

		NEDITOR_MOUSE_INFO.currentInput = that;
		if ( that.node ) {
			that.node.detachInput( that );
			that.domElement.classList.remove( 'filled' );
			that.domElement.classList.add( 'empty' );
		}

		event.stopPropagation();
	};

	$( dom ).on( 'keydown', function ( evt ) {
		evt.stopPropagation();
	} );

	return dom;
};

var CreatePath = function ( canvas ) {
	let path = document.createElementNS( canvas.ns, 'path' );
	path.setAttributeNS( null, 'stroke', '#8e8e8e' );
	path.setAttributeNS( null, 'stroke-width', '2' );
	path.setAttributeNS( null, 'fill', 'none' );
	canvas.appendChild( path );
	return path;
};
