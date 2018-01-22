class CharacterNode extends Node {
	constructor ( type, currentCharacter ) {
		super ( type, false );


		let input = new CharacterInput( currentCharacter );
		this.addInput( input );
	}
}