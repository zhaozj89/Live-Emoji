class CharacterNode extends Node {
	constructor ( type, currentCharacter ) {
		super ( 'Object: ' + type );

		this.addOutput();

		let input = new NodeInput();
		input.addCharacterInput( currentCharacter );
		this.addInput( input );
	}
}