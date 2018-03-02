
// TODO
// Add boundary checking, thus possibility for returning false

class TranslationNode extends Node {
	constructor ( type ) {
		super( 'Action: ' + type );

		this.addOutput();

		this.direction = new LeafInput( 'direction: ' );
		this.direction.addSelectionInput( { 'horizontal': 'horizontal', 'vertical': 'vertical' } );

		this.translation = new LeafInput( 'translation (-2 - 2): ' );
		this.translation.addTextInput();

		this.addInput( this.direction );
		this.addInput( this.translation );
	}

	run ( object, targetPose ) {

		switch( this.direction.selectMenu.getValue() ) {
			case 'horizontal': {
				// object.position.x += Number( this.translation.text.getValue() );

				let targetPosition = {
					x: targetPose.x + Number( this.translation.text.getValue() ),
					y: targetPose.y,
					z: targetPose.z
				};

				let tween = new TWEEN.Tween( object.position ).to( targetPosition, 1000 );

				let res = targetPosition;
				res.angle = targetPose.angle;
				return {'tween': tween, 'state': true, 'pose': res};
			}
			case 'vertical': {
				let targetPosition = {
					x: targetPose.x,
					y: targetPose.y + Number( this.translation.text.getValue() ),
					z: targetPose.z
				};

				let tween = new TWEEN.Tween( object.position ).to( targetPosition, 1000 );

				let res = targetPosition;
				res.angle = targetPose.angle;
				return {'tween': tween, 'state': true, 'pose': res};
			}
		}
	}
}

class RotationNode extends Node {
	constructor ( type ) {
		super( 'Action: ' + type );

		this.addOutput();

		this.rotation = new LeafInput( 'rotation (-180 - 180): ' );
		this.rotation.addTextInput();

		this.addInput( this.rotation );
	}

	run ( object, targetPose ) {

		let targetOrientation = {
			x: object.rotation.x,
			y: object.rotation.y,
			z: targetPose.angle + ( Number( this.rotation.text.getValue() ) * Math.PI / 180 )
		};

		let tween = new TWEEN.Tween( object.rotation ).to( targetOrientation, 1000 );

		let res = {
			x: object.position.x,
			y: object.position.y,
			z: object.position.z,
			angle: targetOrientation.z
		};
		return {'tween': tween, 'state': true, 'pose': res};
	}
}

class SleepNode extends Node {
	constructor ( type ) {
		super( 'Action: ' + type );

		this.addOutput();

		this.sleepTime = new LeafInput( 'time (milliseconds): ' );
		this.sleepTime.addTextInput();

		this.addInput( this.sleepTime );
	}

	run ( object, targetPose) {
		let targetPosition = {
			x: targetPose.x,
			y: targetPose.y,
			z: targetPose.z
		};

		let tween = new TWEEN.Tween( object.position ).to( targetPosition, 1000 ).delay( Number( this.sleepTime.text.getValue() ) );

		return {'tween': tween, 'state': true, 'pose': targetPose};
	}
}

class SwapNode extends Node {
	constructor ( type ) {
		super( 'Action: ' + type );

		// this.objectOptions = new LeafInput( 'Object: ' );
		// this.objectOptions.addObjectInput();
		//
		// this.addInput( this.objectOptions );

		this.addOutput();
	}

	run( obj, info ) {
		// let val = this.objectOptions.arg;
		// console.log( val );

		obj.updateEmotion( info );
		editor.signals.sceneGraphChanged.dispatch();
	}
}