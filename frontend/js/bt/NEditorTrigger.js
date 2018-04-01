class TriggerNode extends Node {
	constructor ( type ) {
		super( 'Node+' );

		this.type = type;

		this.semanticName = new LeafInput( 'Semantic: ' );
		this.semanticName.addTextInput();
		this.addInput( this.semanticName );

		this.valence = new LeafInput( 'Valence: ' );
		this.valence.addTextLabel( '0' );
		this.addInput( this.valence );

		this.arousal = new LeafInput( 'Arousal: ' );
		this.arousal.addTextLabel( '1' );
		this.addInput( this.arousal );

		this.counter = 1;

		//

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

		this.key = new NodeInput( this );
		this.key.domElement.textContent = "Key: ";
		this.key.domElement.setAttribute( 'title', 'Trigger to preview' );
		this.key.addTextInput();
		this.addInput( this.key );

		let that = this;

		incrementer.onClick( function () {
			let input = new NodeInput( this );
			input.addTextLabel( '' );
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
			semanticName: this.semanticName.getArg(),
			valence: this.valence.getArg(),
			arousal: this.arousal.getArg(),
			key: this.key.getArg(),
			counter: this.counter
		};
	}

	fromJSON ( state ) {
		this.type = state.type;
		this.setOffset( state.offset );
		this.semanticName.setArg( state.semanticName );
		this.valence.setArg( state.valence );
		this.arousal.setArg( state.arousal );
		this.key.setArg( state.key );

		this.counter = state.counter;
		for ( let i = 1; i < state.counter; ++i ) {
			let input = new NodeInput( this );
			input.addTextLabel( '' );
			this.addInput( input );
		}
	}
}


