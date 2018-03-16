class LeafInput {
	constructor ( title ) {
		this.title = title;

		this.type = "LeafInput";

		// need it for node to work
		this.node = null;

		this.inputType = null;

		this.domElement = this.createInput( this );
	}

	setArg ( val ) {
		switch ( this.inputType ) {
			case 'text': {
				this.text.setValue( val );
				break;
			}
			case 'select': {
				this.selectMenu.setValue( val );
				break;
			}
			case 'color': {
				this.color.setValue( val );
			}
		}
	}

	getArg () {
		switch ( this.inputType ) {
			case 'text': {
				return this.text.getValue();
			}
			case 'select': {
				return this.selectMenu.getValue();
			}
			case 'color': {
				return this.color.getValue();
			}
		}
	}

	createInput ( that ) {
		this.box = new UI.Div();
		this.box.setTextContent( that.title );
		this.box.addClass( 'x-leaf' );

		$( this.box.dom ).on( 'click', function ( evt ) {
			evt.stopPropagation();
		} );

		$( this.box.dom ).on( 'keydown', function ( evt ) {
			evt.stopPropagation();
		} );

		return this.box.dom;
	}

	addTextLabel ( val ) {
		this.inputType = 'text';

		this.text = new UI.Text();
		this.text.setValue( val );
		this.domElement.appendChild( this.text.dom );
	}

	addColorInput () {
		this.inputType = 'color';

		this.color = new UI.Input( '' );
		this.color.dom.type = 'color';
		this.color.setValue( '#ff0000' );
		this.domElement.appendChild( this.color.dom );
	}

	addTextInput () {
		this.inputType = 'text';

		this.text = new UI.Input();
		this.text.setValue( '' );
		this.domElement.appendChild( this.text.dom );
	}

	addSelectionInput ( options ) {
		this.inputType = 'select';

		this.selectMenu = new UI.Select();
		this.selectMenu.setOptions( options );
		this.domElement.appendChild( this.selectMenu.dom );
	}
}

class NodeInput {
	constructor ( currentNode ) {
		this.node = null;

		this.type = "NodeInput";

		this.currentNode = currentNode;

		this.domElement = CreateInput( this );
		this.path = CreatePath( Global_Graph_SVG );

		this.inputType = null;
	}

	setArg ( val ) {
		switch ( this.inputType ) {
			case 'text': {
				this.text.setValue( val );
				break;
			}
			case 'select': {
				this.selectMenu.setValue( val );
				break;
			}
		}
	}

	getArg () {
		switch ( this.inputType ) {
			case 'text': {
				return this.text.getValue();
			}
			case 'select': {
				return this.selectMenu.getValue();
			}
		}
	}

	addTextLabel ( val ) {
		this.inputType = 'text';

		this.text = new UI.Text();
		this.text.setValue( val );
		this.domElement.appendChild( this.text.dom );
	}

	addTextInput () {
		this.inputType = 'text';

		this.text = new UI.Input();
		this.text.setValue( '' );
		this.domElement.appendChild( this.text.dom );
	}

	addSelectionInput ( options ) {
		this.inputType = 'select';

		this.selectMenu = new UI.Select();
		this.selectMenu.setOptions( options );
		this.domElement.appendChild( this.selectMenu.dom );
	}

	getAttachedPoint () {
		let offset = NEditorGetFullOffset( this.domElement );
		return {
			x: offset.left + this.domElement.offsetWidth - 2,
			y: offset.top + this.domElement.offsetHeight / 2
		};
	}
}

class Node {
	constructor ( title ) {
		if ( title === null ) return;
		this.title = title;

		this.output = null;
		this.inputs = [];

		this.parentInput = null;

		this.attachedPaths = [];
		this.connected = false;

		this.domElement = CreateTitle( this.title );

		let removeButton = CreateRemoveButton( this );
		this.domElement.appendChild( removeButton );
	}

	addDOM ( dom ) {
		this.domElement.appendChild( dom );
	}

	addOutput () {
		let outputDom = CreateOutput( this );
		this.domElement.appendChild( outputDom );
		this.output = outputDom;
	}

	getInputsForSerializationOnly () {
		for ( let i = 0; i < this.inputs.length; ++i ) {
			if ( this.inputs[ i ].domElement.classList.contains( 'filled' ) === true || this.inputs[ i ].type === 'LeafInput' ) continue;
			else return this.inputs[ i ];
		}
	}

	addInput ( input ) {
		this.inputs.push( input );
		this.domElement.appendChild( input.domElement );
	}

	removeInput () {
		if ( this.inputs.length === 0 ) return;
		let input = this.inputs[ this.inputs.length - 1 ];
		this.inputs.splice( this.inputs.length - 1, 1 );
		input.domElement.parentElement.removeChild( input.domElement );
		return;
	}

	getOutputPoint () {
		var offset = NEditorGetFullOffset( this.output );
		return {
			x: offset.left + this.output.offsetWidth / 2,
			y: offset.top + this.output.offsetHeight / 2
		};
	}

	detachInput ( input ) {
		var index = -1;
		for ( let i = 0; i < this.attachedPaths.length; ++i ) {
			if ( this.attachedPaths[ i ].input === input )
				index = i;
		}

		if ( index >= 0 ) {
			this.attachedPaths[ index ].path.removeAttribute( 'd' );
			this.attachedPaths[ index ].input.node = undefined;
			this.attachedPaths.splice( index, 1 );
		}

		if ( this.attachedPaths.length <= 0 )
			this.domElement.classList.remove( 'connected' );
	}

	ownsInput ( input ) {
		for ( let i = 0; i < this.inputs.length; ++i ) {
			if ( this.inputs[ i ] === input )
				return true;
		}
		return false;
	}

	updatePosition () {
		for ( let j = 0; j < this.inputs.length; ++j ) {
			if ( this.inputs[ j ].node === null ) continue;

			let inputPt = this.inputs[ j ].getAttachedPoint();
			let outputPt = this.inputs[ j ].node.getOutputPoint();
			this.inputs[ j ].path.setAttributeNS( null, 'd', NEditorCreatePath( inputPt, outputPt ) );
		}

		if ( this.output === null ) return;
		var outputPt = this.getOutputPoint();

		for ( let i = 0; i < this.attachedPaths.length; ++i ) {
			let inputPt = this.attachedPaths[ i ].input.getAttachedPoint();
			this.attachedPaths[ i ].path.setAttributeNS( null, 'd', NEditorCreatePath( inputPt, outputPt ) );
		}
	}

	connectFrom ( input ) {

		input.node = this;
		this.connected = true;

		this.domElement.classList.add( 'connected' );
		input.domElement.classList.remove( 'empty' );
		input.domElement.classList.add( 'filled' );

		this.attachedPaths.push( {
			input: input,
			path: input.path
		} );

		let inputPt = input.getAttachedPoint();
		let outputPt = this.getOutputPoint();

		input.path.setAttributeNS( null, 'd', NEditorCreatePath( inputPt, outputPt ) );
	}

	moveTo ( point ) {
		this.domElement.style.top = point.y + 'px';
		this.domElement.style.left = point.x + 'px';
		this.updatePosition();
	}

	initUI () {
		var that = this;

		$( this.domElement ).draggable( {
			containment: 'window',
			cancel: '.x-connection, .x-output, .x-input, .x-leaf',
			drag: function ( e, ui ) {
				that.updatePosition();
			}
		} );

		this.domElement.style.position = 'absolute';
		Global_NEditor_Container.appendChild( this.domElement );
		this.updatePosition();
	}

	getChildren () {
		let res = [];
		for ( let k = 0; k < this.inputs.length; ++k ) {
			if ( this.inputs[ k ].node !== null ) res.push( this.inputs[ k ].node );
		}
		return res;
	}

	getArgs () {
		let res = [];
		for ( let i = 0; i < this.inputs.length; ++i ) {
			let arg = this.inputs[ i ].getArg();
			if ( arg !== null ) res.push( arg );
			else res.push( null );
		}

		return res;
	}

	getArg () {
		return this.inputs[ 0 ].getArg();
	}

	getOffset () {
		return {
			top: this.domElement.style.top,
			left: this.domElement.style.left
		}
	}

	setOffset ( val ) {
		this.domElement.style.top = val.top;
		this.domElement.style.left = val.left;
	}
}
