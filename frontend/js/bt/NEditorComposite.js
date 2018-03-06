class CompositeNode extends Node {
	constructor ( type ) {
		super ( 'Composite: ' + type );

		this.addOutput();

		this.setUI();
	}

	setUI() {
		this.counter = 0;

		let rower = new UI.Row();
		let spanner0 = new UI.Span();
		let spanner1 = new UI.Span();
		this.incrementer = new UI.Button( '+' );
		this.decrementer = new UI.Button( '-' );
		let breaker = new UI.Break();

		this.incrementer.setWidth( '50%' );
		this.decrementer.setWidth( '50%' );

		spanner0.add( this.incrementer );
		spanner1.add( this.decrementer );

		rower.add( spanner0 );
		rower.add( spanner1 );
		this.domElement.appendChild( rower.dom );
		this.domElement.appendChild( breaker.dom );

		this.input = new NodeInput( this );
		this.input.domElement.textContent = 'channel ' + this.counter + ': ';
		this.addInput(this.input);
		++this.counter;

		let that = this;
		$( this.incrementer.dom ).click( function() {
			let input = new NodeInput( this );
			input.domElement.textContent = 'channel ' + that.counter + ': ';
			that.addInput( input );
			++that.counter;
		} );

		$( this.decrementer.dom ).click( function() {
			if( that.counter<=1 ) return;
			--that.counter;
			that.removeInput();
		} );
	}

	toJSON () {
		return {
			counter: this.counter
		};
	}

	fromJSON (state) {
		this.counter = state.counter;

		for (let i=1; i<state.counter; ++i) {
			let input = new NodeInput( this );

			input.domElement.textContent = 'channel ' + i + ': ';
			this.addInput( input );
		}
	}
}
