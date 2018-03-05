class TriggerNode extends Node {

	setSemanticName (name) {
		this.semanticName.text.setValue( name );
	}

	getSemanticName() {
		return this.semanticName.text.getValue();
	}

	setValence (valence) {
		this.valence.text.setValue(valence);
	}

	getValence() {
		return this.valence.text.getValue();
	}

	setArousal (arousal) {
		this.arousal.text.setValue(arousal);
	}

	getArousal() {
		return this.arousal.text.getValue();
	}

	setCounter(counter) {
		this.counter = counter;
	}

	getCounter () {
		return this.counter;
	}

	setKey(key) {
		this.key.arg = key;
	}

	getKey() {
		return this.key.arg;
	}

	constructor ( type ) {
		super( 'Trigger: ' + type );

		this.semanticName = new LeafInput( 'Emotion: ' );
		this.semanticName.addTextInput();

		this.addInput( this.semanticName );

		this.valence = new LeafInput( 'Happiness: ' );
		this.valence.addTextInput();

		this.addInput( this.valence );

		this.arousal = new LeafInput( 'Heartbeat: ' );
		this.arousal.addTextInput();

		this.addInput( this.arousal );

		let breaker2 = new UI.Break();
		this.domElement.appendChild( breaker2.dom );

		// UI

		this.counter = 1;

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

		this.key = new NodeInput( this );
		this.key.addTextInput();

		this.addInput( this.key );

		let that = this;
		$( that.incrementer.dom ).click( function() {
			let input = new NodeInput( this );

			input.domElement.textContent = 'channel ' + that.counter + ': ';
			that.addInput( input );
			++that.counter;
		} );

		$( that.decrementer.dom ).click( function() {
			if( that.counter<=1 ) return;
			--that.counter;
			that.removeInput();
		} );



		// Dynamic

		document.addEventListener( 'keydown', KeyboardTriggerFunction );

		$( this.domElement ).find( "button.delete" ).on( 'click', function () {
			document.removeEventListener( 'keydown', KeyboardTriggerFunction );
		} );
	}

	toJSON () {
		return {
			semanticName: this.getSemanticName(),
			valence: this.getValence(),
			arousal: this.getArousal(),
			key: this.getKey(),
			counter: this.getCounter()
		};
	}

	fromJSON (state) {
		this.setSemanticName(state.semanticName);
		this.setValence(state.valence);
		this.setArousal(state.arousal);
		this.setKey(state.key);
		this.setCounter(state.counter);

		for (let i=0; i<state.counter; ++i) {
			let input = new NodeInput( this );

			input.domElement.textContent = 'channel ' + i + ': ';
			this.addInput( input );
		}
	}
}


