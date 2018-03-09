class CharacterNode extends Node {
	getEmotion () {
		return this.input.selectMenu.getValue();
	}

	setEmotion ( emotion ) {
		this.input.selectMenu.setValue( emotion );
	}

	constructor ( type ) {
		super( 'Character: ' + type );

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

	fromJSON ( state ) {
		this.setEmotion( state.emotion );
	}
}

class TextureNode extends Node {

	getTextureName () {
		return this.input.selectMenu.getValue();
	}

	setTextureName ( textureName ) {
		this.input.selectMenu.setValue( textureName );
	}

	constructor ( type ) {
		super( 'Texture: ' + type );

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

	fromJSON ( state ) {
		this.setTextureName( state.textureName );
	}
}

class TextNode extends Node {
	setTextVal(val) {
		this.input.text.setValue( val );
	}

	getTextVal () {
		return this.input.text.getValue();
	}

	toJSON() {
		return {
			type: 'text',
			text: this.getTextVal()
		}
	}

	fromJSON( state ) {
		this.setTextVal( state.text );
	}

	constructor ( type ) {
		super ( 'Text: ' + type );

		this.addOutput();

		this.input = new NodeInput( this );
		this.input.addTextInput();
		this.addInput( this.input );
	}
}