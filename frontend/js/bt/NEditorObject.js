class CharacterNode extends Node {
	getEmotion () {
		return this.input.arg;
	}

	setEmotion (emotion) {
		this.input.arg = emotion;
	}

	constructor ( type ) {
		super ( 'Character: ' + type );

		this.addOutput();

		this.input = new NodeInput( this );
		this.input.addCharacterInput();
		this.addInput( this.input );
	}

	toJSON () {
		return {
			type: 'character',
			emotion: this.getEmotion()
		};
	}

	fromJSON (state) {
		this.setEmotion(state.emotion);
	}
}

class TextureNode extends Node {

	getTextureName () {
		return this.input.arg;
	}

	setTextureName (textureName) {
		this.input.arg = textureName;
	}

	constructor ( type ) {
		super ( 'Texture: ' + type );

		this.addOutput();

		this.input = new NodeInput( this );
		this.input.addTextureInput();
		this.addInput( this.input );
	}

	toJSON () {
		return {
			type: 'texture',
			textureName: this.getTextureName()
		};
	}

	fromJSON (state) {
		this.setTextureName(state.textureName);
	}
}

// class TextNode extends Node {
// 	constructor ( type ) {
// 		super ( 'Text: ' + type );
//
// 		this.addOutput();
//
// 		let input = new NodeInput( this );
// 		input.addTextInput();
// 		this.addInput( input );
// 	}
// }