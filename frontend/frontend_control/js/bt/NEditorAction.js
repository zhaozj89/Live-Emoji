
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

	run ( object ) {
		// console.log( object );
		// console.log( this.direction.selectMenu.getValue() );
		// console.log( this.translation.text.getValue() );

		switch( this.direction.selectMenu.getValue() ) {
			case 'horizontal': {
				object.position.x += Number( this.translation.text.getValue() );
				break;
			}
			case 'vertical': {
				object.position.y += Number( this.translation.text.getValue() );
				break;
			}
		}

		return true;
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

	run ( object ) {
		// console.log( object );
		// console.log( this.direction.selectMenu.getValue() );
		// console.log( this.rotation.text.getValue() );

		object.rotation.z += ( Number( this.rotation.text.getValue() ) * Math.PI / 180 );

		return true;
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

	run (object) {

		// TODO, find a way

		return true;
	}
}