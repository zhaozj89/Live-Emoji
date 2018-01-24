

class KeyTriggerNode extends Node {
	constructor ( type ) {
		super( type );

		let input = new NodeInput();
		input.addTextInput();

		this.addInput( input );
	}
}

class EmotionTriggerNode extends Node {
	constructor ( type ) {
		super( type );

		let input = new NodeInput();
		input.addEmotionInput();

		this.addInput( input );
	}
}

class TickTriggerNode extends Node {
	constructor( type ) {
		super( type );

		let input = new NodeInput();
		input.addNumberInput();

		this.addInput( input );
	}
}
