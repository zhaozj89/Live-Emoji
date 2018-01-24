class CharacterNode extends Node {
	constructor ( type, currentCharacter ) {
		super ( type );

		this.addOutput();

		let input = new NodeInput();
		input.addCharacterInput( currentCharacter );
		this.addInput( input );
	}
}