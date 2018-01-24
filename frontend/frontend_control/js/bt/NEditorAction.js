

class TranslationNode extends Node {
	constructor ( type ) {
		super( type );

		this.addOutput();

		// this.addTextArg( 'translation: ' );

		let input = new NodeInput();
		input.addTextInput();

		this.addInput( input );
	}
}

class RotationNode extends Node {
	constructor ( type ) {
		super( type );

		this.addOutput();

		this.addTextArg( 'rotation: ' );
	}
}
