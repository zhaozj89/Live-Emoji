class Composites extends Node {
	constructor ( name ) {
		super ( name, false, null );

		this.counter = 0;

		let rower = new UI.Row();
		let spanner0 = new UI.Span();
		let spanner1 = new UI.Span();
		let incrementer = new UI.Button( '+' );
		let decrementer = new UI.Button( '-' );
		let breaker = new UI.Break();

		incrementer.setWidth( '50%' );
		decrementer.setWidth( '50%' );

		spanner0.add( incrementer );
		spanner1.add( decrementer );

		rower.add( spanner0 );
		rower.add( spanner1 );
		this.domElement.appendChild( rower.dom );
		this.domElement.appendChild( breaker.dom );

		this.addInput( 'Channel '+this.counter, NEDITOR_INPUT_TYPE.CONNECTION );
		++this.counter;

		let that = this;
		$( incrementer.dom ).click( function() {

			that.addInput( 'Channel '+that.counter, NEDITOR_INPUT_TYPE.CONNECTION );
			++that.counter;
		} );

		$( decrementer.dom ).click( function() {
			if( that.counter<=1 ) return;
			--that.counter;
			that.removeInput( 'Channel '+that.counter );
		} );
	}
}

class Selector extends Composites {
	constructor() {
		super( 'Selector (OR)' );
	}
}

class Sequence extends Composites {
	constructor() {
		super( 'Sequence (AND)' );
	}
}
