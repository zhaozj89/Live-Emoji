class CompositeNode extends Node {
	constructor ( type ) {
		super( 'Sequence+' );

		this.type = type;

		this.addOutput();

		this.component = new LeafInput( 'Component: ' );
		this.component.addSelectionInput({
			'puppet': 'puppet',
			'background': 'background',
			'text': 'text'
		});
		this.addInput( this.component );
		this.component.setArg( 'background' );

		this.counter = 0;

		let rower = new UI.Row();
		let spanner0 = new UI.Span();
		let spanner1 = new UI.Span();
		let incrementer = new UI.Button( '+' );
		let decrementer = new UI.Button( '-' );
		incrementer.setPadding( '1px' );
		decrementer.setPadding( '1px' );
		incrementer.setColor( '#00ea00' );
		decrementer.setColor( '#00ea00' );
		incrementer.setBackgroundColor( 'rgba(0,0,0,0.25)' );
		decrementer.setBackgroundColor( 'rgba(0,0,0,0.25)' );

		incrementer.setWidth( '50%' );
		decrementer.setWidth( '50%' );

		spanner0.add( incrementer );
		spanner1.add( decrementer );

		rower.add( spanner0 );
		rower.add( spanner1 );

		this.addDOM( rower.dom );

		let input = new NodeInput( this );
		input.addTextLabel('Channel ' + this.counter + ': ');
		this.addInput( input );
		++this.counter;

		let that = this;
		incrementer.onClick( function () {
			let input = new NodeInput( that );
			input.addTextLabel('Channel ' + that.counter + ': ');
			that.addInput( input );
			++that.counter;
		} );

		decrementer.onClick( function () {
			if ( that.counter <= 1 ) return;
			--that.counter;
			that.removeInput();
		} );

		this.moveTo( { x: 300, y: 80 } );
	}

	toJSON () {
		return {
			type: this.type,
			offset: this.getOffset(),
			component: this.component.getArg(),
			counter: this.counter
		};
	}

	fromJSON ( state ) {
		this.type = state.type;
		this.setOffset( state.offset );
		this.component.setArg( state.component );

		this.counter = state.counter;
		for ( let i = 1; i < state.counter; ++i ) {
			let input = new NodeInput( this );

			input.domElement.textContent = 'Channel ' + i + ': ';
			this.addInput( input );
		}
	}
}