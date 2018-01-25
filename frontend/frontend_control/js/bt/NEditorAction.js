

class TranslationNode extends Node {
	constructor ( type ) {
		super( type );

		this.addOutput();

		let input = new LeafInput();
		input.addTextInput( 'translation (0 - 10): ' );

		this.addInput( input );
	}
}

class RotationNode extends Node {
	constructor ( type ) {
		super( type );

		this.addOutput();

		let input = new LeafInput();
		input.addTextInput( 'rotation (-180 - 180): ' );

		this.addInput( input );
	}
}
