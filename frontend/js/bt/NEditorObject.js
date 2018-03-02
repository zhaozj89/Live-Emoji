class CharacterNode extends Node {
	constructor ( type ) {
		super ( 'Character: ' + type );

		this.addOutput();

		let input = new NodeInput( this );
		input.addCharacterInput();
		this.addInput( input );
	}
}

class TextureNode extends Node {
	constructor ( type ) {
		super ( 'Texture: ' + type );

		this.addOutput();

		let input = new NodeInput( this );
		input.addTextureInput();
		this.addInput( input );
	}
}

class TextNode extends Node {
	constructor ( type ) {
		super ( 'Text: ' + type );

		this.addOutput();

		let input = new NodeInput( this );
		input.addTextInput();
		this.addInput( input );
	}
}