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

		// that.aPixi4ParticleExample.destroy();
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
		return this.sourceStrokeColor.getValue();
	}

	setSourceStrokeColor ( color ) {
		this.sourceStrokeColor.setValue( color );
	}

	getTravelStrokeColor () {
		return this.travelStrokeColor.getValue();
	}

	setTravelStrokeColor ( color ) {
		this.travelStrokeColor.setValue( color );
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
		this.motionEffects = new LeafInput( 'Motion Effects: ' );
		this.motionEffects.addSelectionInput( {
			'SourceStroke': 'source_stroke',
			'TravelStroke': 'travel_stroke'
		} );
		this.addInput( this.motionEffects );

		this.addOutput();

		this.aPixi4ParticleExample = new Pixi4ParticleExample();
	}

	run ( obj, info ) {

		let imagePath = "./asset/background/small/" + info + "_small.png";

		let config = {
			"alpha": {
				"start": 0.5,
				"end": 0.5
			},
			"scale": {
				"start": 1,
				"end": 1
			},
			"color": {
				"start": "ffffff",
				"end": "ffffff"
			},
			"speed": {
				"start": 3000,
				"end": 3000
			},
			"startRotation": {
				"min": 65,
				"max": 65
			},
			"rotationSpeed": {
				"min": 0,
				"max": 0
			},
			"lifetime": {
				"min": 0.81,
				"max": 0.81
			},
			"blendMode": "normal",
			"frequency": 0.004,
			"emitterLifetime": 0,
			"maxParticles": 1000,
			"pos": {
				"x": 0,
				"y": 0
			},
			"addAtBack": false,
			"spawnType": "rect",
			"spawnRect": {
				"x": -600,
				"y": -460,
				"w": 900,
				"h": 20
			}
		};

		this.aPixi4ParticleExample.loadAsset( imagePath, config );
		this.aPixi4ParticleExample.display();

		let that = this;
		setTimeout( function () {
			that.aPixi4ParticleExample.destroy();

			// that.editor..updateEmotion( emotion );
			// editor.signals.sceneGraphChanged.dispatch();
		}, 3000 );
	}
}