class SwapNode extends Node {
	constructor ( type, editor ) {
		super( 'Action' + type );
		this.type = type;

		this.editor = editor;

		this.addOutput();

		this.emotion = new LeafInput( '' );
		this.emotion.addSelectionInput({
			'happy': 'happy',
			'sad': 'sad',
			'surprised': 'surprised',
			'disgusted': 'disgusted',
			'angry': 'angry',
			'fearful': 'fearful',
			'neutral': 'neutral'
		});
		this.addInput( this.emotion );
		this.emotion.setArg( 'neutral' );

		this.moveTo( { x: 300, y: 80 } );
	}

	run ( component ) {
		if( component!=='puppet' ) {
			alert( 'Explode action ONLY allows puppet component input!' );
			return;
		}

		let that = this;
		let puppet = that.editor.selected;
		that.editor.emotionMutex = true;
		puppet.updateEmotion( that.emotion.getArg() );
		that.editor.signals.sceneGraphChanged.dispatch();

		setTimeout( function () {
			that.editor.emotionMutex = false;
		}, 500 );
	}

	toJSON () {
		return {
			type: this.type,
			offset: this.getOffset(),
			emotion: this.emotion.getArg()
		};
	}

	fromJSON ( state ) {
		this.type = state.type;
		this.setOffset( state.offset );
		this.emotion.setArg( state.emotion );
	}
}

class ExplodeNode extends Node {
	constructor ( type, editor ) {
		super( 'Action: ' + type );

		this.type = type;
		this.editor = editor;

		this.image = new LeafInput( 'Image: ' );
		this.image.addSelectionInput({
			'fire': 'fire',
			'heart': 'heart',
			'poop': 'poop',
			'raindrop': 'raindrop',
			'splatter1': 'splatter1',
			'splatter2': 'splatter2',
			'surprised': 'surprised',
			'yellowbubble': 'yellowbubble'
		});
		this.addInput( this.image );
		this.image.setArg( 'yellowbubble' );

		// initialization configuration
		this.mass = new LeafInput( 'Mass: ' );
		this.mass.addSelectionInput({
			1: 1,
			2: 2,
			5: 5,
			10: 10
		});
		this.addInput( this.mass );
		this.mass.setArg( '1' );

		this.emitterX = new LeafInput( 'Emitter X: ' );
		this.emitterX.addTextLabel(editor.protonPixi4Renderer.width/2);
		this.addInput( this.emitterX );

		this.emitterY = new LeafInput( 'Emitter Y: ' );
		this.emitterY.addTextLabel(editor.protonPixi4Renderer.height/2);
		this.addInput( this.emitterY );

		this.addOutput();

		this.particleController = new BackgroundAnimationController( editor, this.emitterX, this.emitterY );

		this.moveTo( { x: 300, y: 80 } );
	}

	run ( component ) {

		if( component!=='background' ) {
			alert( 'Explode action ONLY allows background component input!' );
			return;
		}

		this.particleController.updateEmitter( this.image.getArg(), this.mass.getArg() );
		this.particleController.display();
	}

	toJSON () {
		return {
			type: this.type,
			offset: this.getOffset(),
			image: this.image.getArg(),
			mass: this.mass.getArg(),
			emitterX: this.emitterX.getArg(),
			emitterY: this.emitterY.getArg()
		};
	}

	fromJSON ( state ) {
		this.type = state.type;
		this.setOffset( state.offset );
		this.image.setArg( state.image );
		this.mass.setArg( state.mass );
		this.emitterX.setArg( state.emitterX );
		this.emitterY.setArg( state.emitterY );
	}
}

// class TextMotionNode extends Node {
//
// 	toJSON() {
// 		return {
// 			type: 'text_motion',
// 			color: this.textColor.getArg(),
// 			// size: this.textSize.getArg(),
// 			elapse: this.textElapse.getArg()
// 		};
// 	}
//
// 	fromJSON( state ) {
// 		this.textColor.setArg( state.color );
// 		// this.textSize.setArg( state.size );
// 		this.textElapse.setArg( state.elapse );
// 	}
//
// 	constructor ( type, editor ) {
// 		super(  'Action: ' + type  );
//
// 		this.editor = editor;
//
// 		this.textColor = new LeafInput( 'Text Color: ' );
// 		this.textColor.addColorInput();
// 		this.addInput( this.textColor );
//
// 		// this.textSize = new LeafInput( 'Text Size: ' );
// 		// this.textSize.addSelectionInput({
// 		// 	'small': 'small',
// 		// 	'middle': 'middle',
// 		// 	'big': 'big'
// 		// });
// 		// this.addInput( this.textSize );
//
// 		this.textElapse = new LeafInput( 'Moving Time: ' );
// 		this.textElapse.addSelectionInput({
// 			'100': '100',
// 			'500': '500',
// 			'1000': '1000',
// 			'5000': '5000'
// 		});
// 		this.addInput( this.textElapse );
//
// 		this.addOutput();
//
// 		this.textControl = new TextControl( editor );
// 	}
//
// 	run (obj, info) {
// 		let textVal = info;
// 		let textConfig = {
// 			x:0,
// 			y:0,
// 			fontSize: 100,
// 			fontColor: this.textColor.getArg(),
// 			ex:500,
// 			ey:500,
// 			elapse: Number(this.textElapse.getArg())
// 		};
//
// 		this.textControl.displayText( textVal, textConfig );
// 	}
// }