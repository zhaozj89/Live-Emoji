
class KeyTriggerNode extends Node {
	constructor ( type ) {
		super( 'Trigger: ' + type );

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
	constructor ( type, signals ) {
		super( 'Trigger: ' + type );

		let input = new NodeInput();

		signals.turnOnOffFaceTracking.dispatch( true );

		this.addInput( input );

		$( this.domElement ).find("button.delete").on( 'click', function () {
			signals.turnOnOffFaceTracking.dispatch( false );
		} ) ;
	}
}

class TickTriggerNode extends Node {
	constructor( type ) {
		super( 'Trigger: ' + type );

		let input = new NodeInput();
		input.addNumberInput();

		this.addInput( input );

		this.handle = TickTriggerFunction( 1000 );

		let that = this;

		$( input.domElement ).find( "input" ).change( function () {
			clearInterval( that.handle );
			console.log( input.arg );
			let time_interval = Number( input.arg );
			if( time_interval>0 )
				that.handle = TickTriggerFunction( time_interval );
			else
				alert( 'The input must be a number!' );
		} );

		$( this.domElement ).find("button.delete").on( 'click', function () {
			clearInterval( that.handle );
		} ) ;
	}
}
