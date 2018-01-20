class Composite extends Node {
	constructor ( value ) {
		super ( NODE_TYPE.COMPOSITE, value, false );
		this.setUI();
	}

	setUI() {
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

		this.addInput( INPUT_TYPE.CONNECTION, 'channel '+this.counter );
		++this.counter;

		let that = this;
		$( incrementer.dom ).click( function() {

			that.addInput( INPUT_TYPE.CONNECTION, 'channel '+that.counter );
			++that.counter;
		} );

		$( decrementer.dom ).click( function() {
			if( that.counter<=1 ) return;
			--that.counter;
			that.removeInput( 'channel '+that.counter );
		} );
	}
}
