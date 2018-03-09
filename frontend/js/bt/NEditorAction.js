var ALL_BACKGROUND_ANIMATION_CONFIGS = {
	explosion: {
		"alpha": {
			"start": 0.8,
			"end": 0.1
		},
		"scale": {
			"start": 1,
			"end": 0.3
		},
		"color": {
			"start": "fb1010",
			"end": "f5b830"
		},
		"speed": {
			"start": 200,
			"end": 100
		},
		"startRotation": {
			"min": 0,
			"max": 360
		},
		"rotationSpeed": {
			"min": 0,
			"max": 0
		},
		"lifetime": {
			"min": 0.5,
			"max": 0.5
		},
		"frequency": 0.008,
		"emitterLifetime": 0.31,
		"maxParticles": 1000,
		"pos": {
			"x": 0,
			"y": 0
		},
		"addAtBack": false,
		"spawnType": "circle",
		"spawnCircle": {
			"x": 0,
			"y": 0,
			"r": 10
		}
	},
	flame: {
		"alpha": {
			"start": 0.62,
			"end": 0
		},
		"scale": {
			"start": 0.25,
			"end": 0.75
		},
		"color": {
			"start": "fff191",
			"end": "ff622c"
		},
		"speed": {
			"start": 500,
			"end": 500
		},
		"startRotation": {
			"min": 265,
			"max": 275
		},
		"rotationSpeed": {
			"min": 50,
			"max": 50
		},
		"lifetime": {
			"min": 0.1,
			"max": 0.75
		},
		"blendMode": "normal",
		"frequency": 0.001,
		"emitterLifetime": 0.31,
		"maxParticles": 1000,
		"pos": {
			"x": 0,
			"y": 0
		},
		"addAtBack": false,
		"spawnType": "circle",
		"spawnCircle": {
			"x": 0,
			"y": 0,
			"r": 10
		}
	},
	rain: {
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
		"emitterLifetime": 0.31,
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
	},
	bubble: {
		"alpha": {
			"start": 1,
			"end": 0.22
		},
		"scale": {
			"start": 0.25,
			"end": 0.75,
			"minimumScaleMultiplier":0.5
		},
		"color": {
			"start": "ffffff",
			"end": "ffffff"
		},
		"speed": {
			"start": 200,
			"end": 50
		},
		"startRotation": {
			"min": 0,
			"max": 360
		},
		"rotationSpeed": {
			"min": 0,
			"max": 10
		},
		"lifetime": {
			"min": 4,
			"max": 4
		},
		"blendMode": "normal",
		"frequency": 0.016,
		"emitterLifetime": 0.31,
		"maxParticles": 500,
		"pos": {
			"x": 0,
			"y": 0
		},
		"addAtBack": false,
		"spawnType": "point"
	},
	snow: {
		"alpha": {
			"start": 0.73,
			"end": 0.46
		},
		"scale": {
			"start": 0.15,
			"end": 0.2,
			"minimumScaleMultiplier":0.5
		},
		"color": {
			"start": "ffffff",
			"end": "ffffff"
		},
		"speed": {
			"start": 200,
			"end": 200
		},
		"startRotation": {
			"min": 50,
			"max": 70
		},
		"rotationSpeed": {
			"min": 0,
			"max": 200
		},
		"lifetime": {
			"min": 4,
			"max": 4
		},
		"blendMode": "normal",
		"ease": [
			{
				"s": 0,
				"cp": 0.379,
				"e": 0.548
			},
			{
				"s": 0.548,
				"cp": 0.717,
				"e": 0.676
			},
			{
				"s": 0.676,
				"cp": 0.635,
				"e": 1
			}
		],
		"frequency": 0.004,
		"emitterLifetime": 0.31,
		"maxParticles": 1000,
		"pos": {
			"x": 0,
			"y": 0
		},
		"addAtBack": false,
		"spawnType": "rect",
		"spawnRect": {
			"x": -500,
			"y": -300,
			"w": 900,
			"h": 20
		}
	},
	spark: {
		"alpha": {
			"start": 1,
			"end": 0.31
		},
		"scale": {
			"start": 0.5,
			"end": 1
		},
		"color": {
			"start": "ffffff",
			"end": "9ff3ff"
		},
		"speed": {
			"start": 1000,
			"end": 200
		},
		"startRotation": {
			"min": 225,
			"max": 320
		},
		"rotationSpeed": {
			"min": 0,
			"max": 20
		},
		"lifetime": {
			"min": 0.25,
			"max": 0.5
		},
		"blendMode": "normal",
		"frequency": 0.001,
		"emitterLifetime": 0.31,
		"maxParticles": 1000,
		"pos": {
			"x": 0,
			"y": 0
		},
		"addAtBack": false,
		"spawnType": "circle",
		"spawnCircle": {
			"x": 0,
			"y": 0,
			"r": 0
		}
	}
};

class SwapNode extends Node {
	constructor ( type, editor ) {
		super( 'Action: ' + type );
		this.addOutput();

		this.editor = editor;
	}

	run ( obj, info ) {
		obj.updateEmotion( info );
		editor.signals.sceneGraphChanged.dispatch();

		let that = this;
		setTimeout( function () {
			that.editor.updateEmotion( 6 ); // neutral
			that.editor.signals.sceneGraphChanged.dispatch();
		}, 1000 );
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

	getMotionEffect () {
		return this.motionEffects.selectMenu.getValue();
	}

	setMotionEffect ( whichMotionEffect ) {
		this.motionEffects.selectMenu.setValue( whichMotionEffect );
	}

	toJSON () {
		return {
			type: 'particle',
			motionEffect: this.getMotionEffect()
		};
	}

	fromJSON ( state ) {
		this.setMotionEffect( state.motionEffect );
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

		let configs = {};
		for(let prop in ALL_BACKGROUND_ANIMATION_CONFIGS) {
			configs[prop] = prop;
		}

		this.motionEffects.addSelectionInput( configs );
		this.addInput( this.motionEffects );

		this.setMotionEffect( 'explosion' );

		this.addOutput();

		this.aPixi4ParticleExample = new Pixi4ParticleExample( editor );
	}

	run ( obj, info ) {

		let asset_name = info ;

		let config = ALL_BACKGROUND_ANIMATION_CONFIGS[this.getMotionEffect()];

		this.aPixi4ParticleExample.stop();
		this.aPixi4ParticleExample.updateConfig( asset_name, config );
		this.aPixi4ParticleExample.display();
	}
}