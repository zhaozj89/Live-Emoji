
class KeyTriggerNode extends Node {
	constructor ( type ) {
		super( type );

		let input = new NodeInput();
		input.addTextInput();

		this.addInput( input );

		document.addEventListener( 'keydown', KeyboardTriggerFunction );

		$( this.domElement ).find("button.delete").on( 'click', function () {
			document.removeEventListener( 'keydown', KeyboardTriggerFunction );
		} ) ;
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

		this.handle = TickTriggerFunction( 1000 );

		let that = this;
		$( this.domElement ).find("button.delete").on( 'click', function () {
			clearInterval( that.handle );
		} ) ;
	}
}
