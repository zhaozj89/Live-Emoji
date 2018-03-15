class SwapNode extends Node {
	constructor ( type, editor ) {
		super( 'Action: ' + type );
		this.addOutput();

		this.editor = editor;
	}

	run ( obj, info ) {
		this.editor.emotionMutex = true;
		obj.updateEmotion( info );
		editor.signals.sceneGraphChanged.dispatch();

		let that = this;
		setTimeout( function () {
			that.editor.emotionMutex = false;
		}, 500 );
	}

	toJSON () {
		return {
			type: 'swap'
		};
	}

	fromJSON ( state ) {

	}
}

class ParticleNode extends Node {

	toJSON () {
		return {
			type: 'particle',
			initializationMass: this.initializationMass.getArg(),
			emitterX: this.emitterX.getArg(),
			emitterY: this.emitterY.getArg()
		};
	}

	fromJSON ( state ) {
		this.initializationMass.setArg( state.initializationMass );
		this.emitterX.setArg( state.emitterX );
		this.emitterY.setArg( state.emitterY );
	}

	constructor ( type, editor ) {
		super( 'Action: ' + type );

		this.editor = editor;

		// initialization configuration
		let initializationLabel = new LeafInput( 'Initialization' );
		this.addInput( initializationLabel );

		this.initializationMass = new LeafInput( 'Mass: ' );
		this.initializationMass.addSelectionInput({
			1: 1,
			2: 2,
			5: 5,
			10: 10
		});
		this.addInput( this.initializationMass );

		this.initializationMass.setArg( '1' );

		this.emitterX = new LeafInput( 'Emitter X: ' );
		this.emitterX.addTextInfoInput(editor.protonPixi4Renderer.width/2);
		this.addInput( this.emitterX );

		this.emitterY = new LeafInput( 'Emitter Y: ' );
		this.emitterY.addTextInfoInput(editor.protonPixi4Renderer.height/2);
		this.addInput( this.emitterY );

		this.addOutput();

		this.particleController = new BackgroundAnimationController( editor, this.emitterX, this.emitterY );
	}

	run ( obj, info ) {

		this.particleController.updateEmitter( info, this.initializationMass.getArg() );

		this.particleController.display();
	}
}

class TextMotionNode extends Node {

	toJSON() {
		return {
			type: 'text_motion',
			color: this.textColor.getArg(),
			// size: this.textSize.getArg(),
			elapse: this.textElapse.getArg()
		};
	}

	fromJSON( state ) {
		this.textColor.setArg( state.color );
		// this.textSize.setArg( state.size );
		this.textElapse.setArg( state.elapse );
	}

	constructor ( type, editor ) {
		super(  'Action: ' + type  );

		this.editor = editor;

		this.textColor = new LeafInput( 'Text Color: ' );
		this.textColor.addColorInput();
		this.addInput( this.textColor );

		// this.textSize = new LeafInput( 'Text Size: ' );
		// this.textSize.addSelectionInput({
		// 	'small': 'small',
		// 	'middle': 'middle',
		// 	'big': 'big'
		// });
		// this.addInput( this.textSize );

		this.textElapse = new LeafInput( 'Moving Time: ' );
		this.textElapse.addSelectionInput({
			'100': '100',
			'500': '500',
			'1000': '1000',
			'5000': '5000'
		});
		this.addInput( this.textElapse );

		this.addOutput();

		this.textControl = new TextControl( editor );
	}

	run (obj, info) {
		let textVal = info;
		let textConfig = {
			x:0,
			y:0,
			fontSize: 100,
			fontColor: this.textColor.getArg(),
			ex:500,
			ey:500,
			elapse: Number(this.textElapse.getArg())
		};

		this.textControl.displayText( textVal, textConfig );
	}
}