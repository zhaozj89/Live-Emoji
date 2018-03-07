class LeafInput {
	constructor ( title ) {
		this.title = title;

		this.type = "LeafInput";

		// need it for node to work
		this.node = null;

		this.arg = null;

		this.domElement = this.createInput( this );
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

	addTextInput () {
		this.text = new UI.Input();
		this.text.setValue( '' );

		let that = this;
		$( that.text.dom ).change( function () {
			that.arg = that.text.getValue();
		} );

		this.domElement.appendChild( this.text.dom );
	}

	addObjectInput () {
		let that = this;
		this.domElement.textContent = 'object: ';
		let selectMenu = new UI.Select();
		selectMenu.setOptions( {
			"character": "character",
			"texture": "texture",
			"text": "text"
		} );
		this.domElement.appendChild( selectMenu.dom );
		$( selectMenu.dom ).change( function () {
			that.arg = selectMenu.getValue();
		} );
	}

	addColorInput () {
		this.inp = new UI.Input( '' );
		this.inp.dom.type = 'color';
		// inp.setId( 'html5colorpicker' );
		this.inp.setValue( '#ff0000' );

		this.domElement.appendChild( this.inp.dom );

		let that = this;
		$( that.inp.dom ).change( function () {
			that.arg = that.inp.getValue();
		} );

		return this.inp;
	}

	addSelectionInput ( options ) {
		this.selectMenu = new UI.Select();
		this.selectMenu.setOptions( options );

		let that = this;
		$( that.selectMenu.dom ).change( function () {
			that.arg = that.selectMenu.getValue();
		} );

		this.domElement.appendChild( that.selectMenu.dom );
	}
}


// each Node contains multiple NodeInput
// @arg contains the argument of this NodeInput
// @node contains the child Node of this NodeInput / Node
// @currentNode contains the current Node
class NodeInput {
	constructor ( currentNode ) {
		this.arg = null;
		this.node = null;

		this.type = "NodeInput";

		this.currentNode = currentNode;

		this.domElement = CreateInput( this );
		this.path = CreatePath( Global_Graph_SVG );
	}

	addNumberInput () {
		let that = this;
		let input = document.createElement( 'input' );
		this.domElement.textContent = 'milliseconds (>0): ';
		input.setAttribute( 'type', 'text' );
		this.domElement.textContent += '';
		this.domElement.appendChild( input );
		$( input ).change( function () {
			that.arg = input.value;
		} );
	}

	addTextInput () {
		this.text = new UI.Input();
		this.text.setValue( '' );

		let that = this;
		$( that.text.dom ).change( function () {
			that.arg = that.text.getValue();
		} );

		this.domElement.appendChild( this.text.dom );
	}

	addCharacterInput () {
		this.arg = '';

		this.domElement.textContent = 'character: ';

		let allEmotions = {
			'happy': 'happy',
			'sad': 'sad',
			'surprised': 'surprised',
			'disgusted': 'disgusted',
			'angry': 'angry',
			'fearful': 'fearful',
			'neutral': 'neutral'
		};

		let that = this;
		this.selectMenu = new UI.Select();
		this.selectMenu.setOptions( allEmotions );

		this.domElement.appendChild( this.selectMenu.dom );
		$( that.selectMenu.dom ).change( function () {
			that.arg = allEmotions[ that.selectMenu.getValue() ];
			// console.log( that.arg );
		} );
	}

	addTextureInput () {
		this.arg = '';

		this.domElement.textContent = 'texture: ';

		let allEmotions = {
			'fire': 'fire',
			'heart': 'heart',
			'poop': 'poop',
			'raindrop': 'raindrop',
			'splatter1': 'splatter1',
			'splatter2': 'splatter2',
			'surprised': 'surprised',
			'yellowbubble': 'yellowbubble'
		};

		let that = this;
		this.selectMenu = new UI.Select();
		this.selectMenu.setOptions( allEmotions );

		this.domElement.appendChild( this.selectMenu.dom );
		$( that.selectMenu.dom ).change( function () {
			that.arg = allEmotions[ that.selectMenu.getValue() ];
		} );
	}

	getAttachedPoint () {
		var offset = NEditorGetFullOffset( this.domElement );
		return {
			x: offset.left + this.domElement.offsetWidth - 2,
			y: offset.top + this.domElement.offsetHeight / 2
		};
	}
}


class Node {
	constructor ( type ) {
		if ( type === null ) return;
		this.type = type;

		this.output = null;
		this.inputs = [];

		this.parentInput = null;

		this.attachedPaths = [];
		this.connected = false;

		this.domElement = CreateTitle( this.type );

		let removeButton = CreateRemoveButton( this );
		this.domElement.appendChild( removeButton );
	}

	addOutput () {
		let outputDom = CreateOutput( this );
		this.domElement.appendChild( outputDom );
		this.output = outputDom;
	}

	getInputForSerializationOnly () {
		for ( let i = 0; i < this.inputs.length; ++i ) {
			if ( this.inputs[ i ].domElement.classList.contains( 'filled' ) === true || this.inputs[ i ].type === 'LeafInput' ) continue;
			else return this.inputs[ i ];
		}
	}

	addInput ( input ) {
		this.inputs.push( input );
		// let br = new UI.Break();
		// this.domElement.appendChild( br.dom );
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


	// currently, one input can ONLY connect to one output (but one output can have multiple inputs)
	// AND, no method is provied for getting parent
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
			if ( this.inputs[ i ].arg !== null ) res.push( this.inputs[ i ].arg );
			else res.push( null );
		}

		return res;
	}

	getArg () {
		return this.inputs[ 0 ].arg;
	}
}
