class CharacterNode extends Node {
	constructor ( type ) {
		super( 'Character: ' + type );

		this.addOutput();

		this.emotionInput = new NodeInput( this );
		this.emotionInput.addCharacterInput();
		this.addInput( this.emotionInput );
	}

	toJSON () {
		return {
			type: 'character',
			emotion: this.emotionInput.getArg()
		};
	}

	fromJSON ( state ) {
		this.emotionInput.setArg( state.emotion );
	}
}

class TextureNode extends Node {
	constructor ( type ) {
		super( 'Texture: ' + type );

		this.addOutput();

		this.textureInput = new NodeInput( this );
		this.textureInput.addTextureInput();
		this.addInput( this.textureInput );
	}

	toJSON () {
		return {
			type: 'texture',
			textureName: this.textureInput.getArg()
		};
	}

	fromJSON ( state ) {
		this.textureInput.setArg( state.textureName );
	}
}

class TextNode extends Node {
	constructor ( type ) {
		super ( 'Text: ' + type );

		this.addOutput();

		this.textInput = new NodeInput( this );
		this.textInput.addTextInput();
		this.addInput( this.textInput );
	}

	toJSON() {
		return {
			type: 'text',
			text: this.textInput.getArg()
		};
	}

	fromJSON( state ) {
		this.textInput.setArg( state.text );
	}
}