

class TranslationNode extends Node {
	constructor ( type ) {
		super( type, false );

		let input = new ArgInput();
		this.addInput( input );
	}
}

class RotationNode extends Node {
	constructor ( type ) {
		super( type, false );

		let input = new ArgInput();
		this.addInput( input );
	}
}
