class SwapNode extends Node {
	constructor ( type ) {
		super( 'Action: ' + type );
		this.addOutput();
	}

	run ( obj, info ) {
		obj.updateEmotion( info );
		editor.signals.sceneGraphChanged.dispatch();
	}

	toJSON () {
		return {
			type: 'swap'
		};
	}

	fromJSON ( state ) {

	}
}

var CreateRemoveButton2 = function ( that ) {
	let dom = document.createElement( 'button' );
	dom.classList.add( 'delete' );
	dom.textContent = 'X';

	$( dom ).on( 'click', function () {

		for ( let i = 0; i < that.inputs.length; ++i ) {
			if ( that.inputs[ i ].node !== null )
				that.inputs[ i ].node.detachInput( that.inputs[ i ] );
		}

		if ( that.parentInput !== null ) {
			that.parentInput.domElement.classList.remove( 'filled' );
			that.parentInput.domElement.classList.add( 'empty' );
			that.parentInput.currentNode.inputs = [];

			that.detachInput( that.parentInput );

		}

		that.domElement.remove();
		that.brushCanvas.dom.remove();
	} );
	return dom;
};

class ParticleNode extends Node {

	getStrokeInput () {
		return this.strokeInput.selectMenu.getValue();
	}

	setStrokeInput ( whichStroke ) {
		this.strokeInput.selectMenu.setValue( whichStroke );
	}

	getSourceStrokeColor () {
		return this.sourceStrokeColor.inp.getValue();
	}

	setSourceStrokeColor ( color ) {
		this.sourceStrokeColor.inp.setValue( color );
	}

	getTravelStrokeColor () {
		return this.travelStrokeColor.inp.getValue();
	}

	setTravelStrokeColor ( color ) {
		this.travelStrokeColor.inp.setValue( color );
	}

	getSourceStrokes () {
		return this.sourceStrokes;
	}

	setSourceStrokes ( strokes ) {
		this.sourceStrokes = strokes;
	}

	getTravelStrokes () {
		return this.travelStrokes;
	}

	setTravelStrokes ( strokes ) {
		this.travelStrokes = strokes;
	}

	toJSON () {
		return {
			type: 'particle',
			strokeInput: this.getStrokeInput(),
			sourceStrokeColor: this.getSourceStrokeColor(),
			travelStrokeColor: this.getTravelStrokeColor(),
			sourceStrokes: this.getSourceStrokes(),
			travelStrokes: this.getTravelStrokes()
		};
	}

	fromJSON ( state ) {
		this.setStrokeInput( state.strokeInput );
		this.setSourceStrokeColor( state.sourceStrokeColor );
		this.setTravelStrokeColor( state.travelStrokeColor );
		this.setSourceStrokes( state.sourceStrokes );
		this.setTravelStrokes( state.travelStrokes );

		this.updateCanvas(state.sourceStrokeColor, state.travelStrokeColor, state.sourceStrokes, state.travelStrokes);
	}

	updateCanvas ( sourceStrokeColor, travelStrokeColor, sourceStrokes, travelStrokes ) {

		let ctx = editor.brushCanvas.getContext( '2d' );
		for ( prop in sourceStrokes ) {
			let stroke = sourceStrokes[ prop ];
			ctx.beginPath();
			ctx.strokeStyle = sourceStrokeColor;
			for ( let k = 0; k < stroke.length; ++k ) {
				let point = stroke[ i ];
				ctx.moveTo( point.x, point.y );
				ctx.lineTo( point.x, point.y );
				ctx.stroke();
			}
			ctx.closePath();
		}

		for ( prop in travelStrokes ) {
			let stroke = travelStrokes[ prop ];
			ctx.beginPath();
			ctx.strokeStyle = travelStrokeColor;
			for ( let k = 0; k < stroke.length; ++k ) {
				let point = stroke[ i ];
				ctx.moveTo( point.x, point.y );
				ctx.lineTo( point.x, point.y );
				ctx.stroke();
			}
			ctx.closePath();
		}
	}

	constructor ( type, editor ) {
		super( null );

		this.editor = editor;

		this.type = 'Action: ' + type;

		this.output = null;
		this.inputs = [];

		this.parentInput = null;

		this.attachedPaths = [];
		this.connected = false;

		this.domElement = CreateTitle( this.type );

		let removeButton = CreateRemoveButton2( this );
		this.domElement.appendChild( removeButton );


		// add select menu
		this.strokeInput = new LeafInput( 'Select stroke: ' );
		this.strokeInput.addSelectionInput( {
			'SourceStroke': 'source_stroke',
			'TravelStroke': 'travel_stroke'
		} );
		this.addInput( this.strokeInput );

		let sourceColor = new LeafInput( 'Source stroke: ' );
		this.sourceStrokeColor = sourceColor.addColorInput();
		this.addInput( sourceColor );

		let travelColor = new LeafInput( 'Travel stroke: ' );
		this.travelStrokeColor = travelColor.addColorInput();
		this.addInput( travelColor );

		this.addOutput();

		this.sourceStrokes = {};
		this.travelStrokes = {};

		this.sourceStrokeCounter = 0;
		this.travelStrokeCounter = 0;

		this.editor.currentParticleNode = this;
	}

	run ( obj, info ) {
		let sourceStrokes = this.sourceStrokes;
		let travelStrokes = this.travelStrokes;

		let msg = {
			sourceStrokes: sourceStrokes,
			travelStrokes: travelStrokes,
			textureName: info
		};

		editor.signals.msgTextureInfo.dispatch( msg );
		editor.signals.displayP5Canvas.dispatch( true );
	}
}