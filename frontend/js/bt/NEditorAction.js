class SwapNode extends Node {
	constructor ( type, editor ) {
		super( 'Action: ' + type );
		this.type = type;

		this.editor = editor;

		this.addOutput();

		this.emotion = new LeafInput( '' );
		this.emotion.addSelectionInput( {
			'happy': 'happy',
			'sad': 'sad',
			'surprised': 'surprised',
			'disgusted': 'disgusted',
			'angry': 'angry',
			'fearful': 'fearful',
			'neutral': 'neutral'
		} );
		this.addInput( this.emotion );
		this.emotion.setArg( 'neutral' );

		this.moveTo( { x: 300, y: 80 } );
	}

	run ( component ) {
		if ( component !== 'puppet' ) {
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

class ParticleNode extends Node {
	constructor ( type, editor ) {
		super( 'Action: ' + type );

		this.type = type;
		this.editor = editor;

		this.image = new LeafInput( 'Image: ' );
		this.image.addSelectionInput( {
			'fire': 'fire',
			'heart': 'heart',
			'poop': 'poop',
			'raindrop': 'raindrop',
			'splatter1': 'splatter1',
			'splatter2': 'splatter2',
			'surprised': 'surprised',
			'yellowbubble': 'yellowbubble'
		} );
		this.addInput( this.image );
		this.image.setArg( 'yellowbubble' );

		// initialization configuration
		this.mass = new LeafInput( 'Mass: ' );
		this.mass.addSelectionInput( {
			1: 1,
			2: 2,
			5: 5,
			10: 10
		} );
		this.addInput( this.mass );
		this.mass.setArg( '1' );

		this.emitterX = new LeafInput( 'Emitter X: ' );
		this.emitterX.addTextLabel( editor.protonPixi4Renderer.width / 2 );
		this.addInput( this.emitterX );

		this.emitterY = new LeafInput( 'Emitter Y: ' );
		this.emitterY.addTextLabel( editor.protonPixi4Renderer.height / 2 );
		this.addInput( this.emitterY );

		this.addOutput();

		this.particleController = new BackgroundAnimationController( editor, this.emitterX, this.emitterY );

		this.moveTo( { x: 300, y: 80 } );
	}

	run ( component ) {

		if ( component !== 'background' ) {
			alert( 'Explode action ONLY allows background component input!' );
			return;
		}

		this.particleController.updateEmitter(
			this.image.getArg(),
			this.mass.getArg(),
			this.emitterX.getArg(),
			this.emitterY.getArg() );
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


class DanmakuNode extends Node {
	constructor ( type, editor ) {
		super( 'Action: ' + type );

		this.type = type;
		this.editor = editor;

		this.text = new LeafInput( 'Text: ' );
		this.text.addTextInput();
		this.addInput( this.text );

		this.color = new LeafInput( 'Color: ' );
		this.color.addColorInput();
		this.addInput( this.color );

		this.size = new LeafInput( 'Size: ' );
		this.size.addSelectionInput( {
			'50': 'small',
			'100': 'middle',
			'200': 'big'
		} );
		this.addInput( this.size );
		this.size.setArg( '100' );

		this.elasp = new LeafInput( 'Moving Time: ' );
		this.elasp.addSelectionInput( {
			'100': '100',
			'500': '500',
			'1000': '1000',
			'5000': '5000'
		} );
		this.addInput( this.elasp );
		this.elasp.setArg( '1000' );

		this.manner = new LeafInput( 'Manner' );
		this.manner.addSelectionInput( {
			'l2r': 'Left to right',
			'r2l': 'Right to left'
		} );
		this.addInput( this.manner );
		this.manner.setArg( 'r2l' );

		this.addOutput();

		this.danmakuController = new DanmakuController( editor );

		this.moveTo( { x: 300, y: 80 } );
	}

	getManner( val ) {
		switch( val ) {
			case 'l2r': return {sx: 0, sy: 100, ex: 800, ey: 100};
			case 'r2l': return {sx: 800, sy: 100, ex: 0, ey: 100};
		}
	}

	run ( component ) {

		if ( component !== 'text' ) {
			alert( 'Danmaku action ONLY allows text component input!' );
			return;
		}

		let text = this.text.getArg();
		let color = this.color.getArg();
		let size = Number( this.size.getArg() );
		let elapse = Number( this.elasp.getArg() );
		let manner = this.getManner( this.manner.getArg() );

		this.danmakuController.display( text, color, size, elapse, manner );
	}

	toJSON () {
		return {
			type: this.type,
			offset: this.getOffset(),
			text: this.text.getArg(),
			color: this.color.getArg(),
			size: this.size.getArg(),
			elapse: this.elasp.getArg(),
			manner: this.manner.getArg()
		};
	}

	fromJSON ( state ) {
		this.type = state.type;
		this.setOffset( state.offset );
		this.text.setArg( state.text );
		this.color.setArg( state.color );
		this.size.setArg( state.size );
		this.elasp.setArg( state.elapse );
		this.manner.setArg( state.manner );
	}
}

class ViberationNode extends Node {
	constructor (type, editor) {
		super( 'Action: ' + type );

		this.type = type;
		this.editor = editor;
	}
}