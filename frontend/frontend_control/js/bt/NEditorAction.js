class TranslationNode extends Node {
	constructor ( type ) {
		super( type );

		this.addOutput();

		this.direction = new LeafInput( 'direction: ' );
		this.direction.addSelectionInput( { 'horizontal': 'horizontal', 'vertical': 'vertical' } );

		this.translation = new LeafInput( 'translation (0 - 10): ' );
		this.translation.addTextInput();

		this.addInput( this.direction );
		this.addInput( this.translation );
	}

	run ( object ) {
		console.log( object );
		console.log( this.direction.text.getValue() );
		console.log( this.translation.selectMenu.getValue() );

		return true;
	}
}

class RotationNode extends Node {
	constructor ( type ) {
		super( type );

		this.addOutput();

		this.direction = new LeafInput( 'direction: ' );
		this.direction.addSelectionInput( { 'clockwise': 'clockwise', 'counter': 'counter' } );

		this.rotation = new LeafInput( 'rotation (-180 - 180): ' );
		this.rotation.addTextInput();

		this.addInput( this.direction );
		this.addInput( this.rotation );
	}

	run ( object ) {
		console.log( object );
		console.log( this.direction.text.getValue() );
		console.log( this.rotation.selectMenu.getValue() );

		return true;
	}
}
