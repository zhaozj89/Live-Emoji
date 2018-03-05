

class SwapNode extends Node {
	constructor ( type ) {
		super( 'Action: ' + type );
		this.addOutput();
	}

	run( obj, info ) {
		obj.updateEmotion( info );
		editor.signals.sceneGraphChanged.dispatch();
	}

	toJSON() {
		return {
			type: 'swap'
		};
	}

	fromJSON( state ) {

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

		if( that.parentInput!==null ) {
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

	getStrokeInput() {
		return this.strokeInput.selectMenu.getValue();
	}

	setStrokeInput( whichStroke ) {
		this.strokeInput.selectMenu.setValue( whichStroke );
	}

	getSourceStrokeColor () {
		return this.sourceStrokeColor.inp.getValue();
	}

	setSourceStrokeColor(color) {
		this.sourceStrokeColor.inp.setValue( color );
	}

	getTravelStrokeColor () {
		return this.travelStrokeColor.inp.getValue();
	}

	setTravelStrokeColor(color) {
		this.travelStrokeColor.inp.setValue( color );
	}

	getSourceStrokes () {
		return this.sourceStrokes;
	}

	setSourceStrokes(strokes) {
		this.sourceStrokes = strokes;
	}

	getTravelStrokes () {
		return this.travelStrokes;
	}

	setTravelStrokes(strokes) {
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

	fromJSON( state ) {
		this.setStrokeInput(state.strokeInput);
		this.setSourceStrokeColor(state.sourceStrokeColor);
		this.setTravelStrokeColor(state.travelStrokeColor);
		this.setSourceStrokes(state.sourceStrokes);
		this.setTravelStrokes(state.travelStrokes);

		this.updateCanvas();
	}

	updateCanvas(sourceStrokeColor, travelStrokeColor, sourceStrokes, travelStrokes) {

		let ctx = this.brushCanvas.dom.firstChild.getContext( '2d' );
		for(prop in sourceStrokes) {
			let stroke = sourceStrokes[prop];
			ctx.beginPath();
			ctx.strokeStyle = sourceStrokeColor;
			for(let k=0; k<stroke.length; ++k) {
				let point = stroke[i];
				ctx.moveTo( point.x, point.y );
				ctx.lineTo( point.x, point.y );
				ctx.stroke();
			}
			ctx.closePath();
		}

		for(prop in travelStrokes) {
			let stroke = travelStrokes[prop];
			ctx.beginPath();
			ctx.strokeStyle = travelStrokeColor;
			for(let k=0; k<stroke.length; ++k) {
				let point = stroke[i];
				ctx.moveTo( point.x, point.y );
				ctx.lineTo( point.x, point.y );
				ctx.stroke();
			}
			ctx.closePath();
		}
	}

	constructor ( type ) {
		super( null );

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
			'TravelStroke': 'travel_stroke',
		} );
		this.addInput( this.strokeInput );

		this.sourceStrokeColor = new LeafInput( 'Source stroke: ' );
		let sourceColor = this.sourceStrokeColor.addColorInput();
		this.addInput( this.sourceStrokeColor );

		this.travelStrokeColor = new LeafInput( 'Travel stroke: ' );
		let travelColor = this.travelStrokeColor.addColorInput();
		this.addInput( this.travelStrokeColor );

		this.addOutput();

		this.sourceStrokes = {};
		this.travelStrokes = {};

		// this.canvasWidth = 0;
		// this.canvasHeight = 0;

		// add a canvas here
		this.brushCanvas = new BrushCanvas( this.sourceStrokes, this.travelStrokes, this, sourceColor, travelColor );
		document.body.appendChild( this.brushCanvas.dom );

		this.sourceStrokeCounter = 0;
		this.travelStrokeCounter = 0;

		let that = this;
		// $( function (  ) {
		// 	let canvas = that.brushCanvas.dom.firstChild;
		// 	that.canvasWidth = canvas.width;
		// 	that.canvasHeight = canvas.height;
		// } );

		editor.signals.runBackground.add( function ( boo ) {
			if(boo===true)
				that.brushCanvas.dom.style.display = 'none';
			else
				that.brushCanvas.dom.style.display = '';
		} );
	}

	run ( obj, info ) {
		let sourceStrokes = this.sourceStrokes;
		let travelStrokes = this.travelStrokes;

		let msg = {
			sourceStrokes: sourceStrokes,
			travelStrokes: travelStrokes,
			textureName: info
		};

		editor.signals.msgBackgroundTexturePattern.dispatch( msg );
	}
}


var BrushCanvas = function ( sourceStrokes, travelStrokes, that, source, travel ) {
	let container = new UI.Panel();
	container.setId( 'brushCanvas' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '600px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.9 );
	container.dom.style.zIndex = "1";

	let canvas = new UI.Canvas();
	canvas.setId( 'mainCanvas' );
	canvas.setPosition( 'absolute' );
	canvas.dom.style.width = '100%';
	canvas.dom.style.height = '100%';

	container.add( canvas );


	$( function () {
		let ctx = canvas.dom.getContext( '2d' );

		let isDrawing = false;

		resizeCanvasToDisplaySize( canvas.dom );

		$( canvas.dom ).mousedown( function ( event ) {
			isDrawing = true;

			if ( that.strokeInput.selectMenu.getValue()==='SourceStroke' ) {
				let newStroke = [];
				let name = 'SourceStroke' + that.sourceStrokeCounter;
				sourceStrokes[name] = newStroke;
				ctx.strokeStyle = source.getValue();
				that.sourceStrokeCounter++;
			}
			else if ( that.strokeInput.selectMenu.getValue()==='TravelStroke' ) {
				let newStroke = [];
				let name = 'TravelStroke' + that.travelStrokeCounter;
				travelStrokes[name] = newStroke;
				ctx.strokeStyle = travel.getValue();
				that.travelStrokeCounter++;
			}
			else {
				isDrawing = false;
				return;
			}

			ctx.beginPath();
			ctx.moveTo( event.clientX, event.clientY - 32 );
		} );

		$( canvas.dom ).mousemove( function ( event ) {
			if ( isDrawing ) {
				if ( that.strokeInput.selectMenu.getValue()==='SourceStroke' ) {
					let tmp = new Vector2(event.clientX, event.clientY - 32);
					let name = 'SourceStroke' + (that.sourceStrokeCounter-1);
					sourceStrokes[name].push( tmp );
				}
				else if ( that.strokeInput.selectMenu.getValue()==='TravelStroke' ) {
					let tmp = new Vector2(event.clientX, event.clientY - 32);
					let name = 'TravelStroke' + (that.travelStrokeCounter-1);
					travelStrokes[name].push( tmp );
				}

				ctx.lineTo( event.clientX, event.clientY - 32 );
				ctx.stroke();
			}
		} );

		$( canvas.dom ).mouseup( function () {
			isDrawing = false;
			ctx.closePath();
		} );

		function resizeCanvasToDisplaySize ( canv ) {
			const width = canv.clientWidth;
			const height = canv.clientHeight;

			if ( canv.width !== width || canv.height !== height ) {
				canv.width = width;
				canv.height = height;
				return true;
			}
			return false;
		}
	} );


	return container;

};
