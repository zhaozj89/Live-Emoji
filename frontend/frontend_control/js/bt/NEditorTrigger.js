

class KeyTriggerNode extends Node {
	constructor ( type ) {
		super(type, true);

		let input = new KeyInput();
		this.addInput(input);
	}
}

class EmotionTriggerNode extends Node {
	constructor ( type ) {
		super( type, true );
		
		let input = new EmotionInput();
		this.addInput( input );
	}
}

class TickTriggerNode extends Node {
	constructor( type ) {
		super( type, true );

		let input = new ArgInput();
		this.addInput( input );
	}
}
