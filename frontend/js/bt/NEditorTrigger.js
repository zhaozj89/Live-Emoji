class KeyTriggerNode extends Node {
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

		let input = new NodeInput( this );
		input.addTextInput();

		this.addInput( input );

		let that = this;
		$( incrementer.dom ).click( function() {
			let input = new NodeInput( this );

			input.domElement.textContent = 'channel ' + that.counter + ': ';
			that.addInput( input );
			++that.counter;
		} );

		$( decrementer.dom ).click( function() {
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
}

class EmotionTriggerNode extends Node {
	constructor ( type, signals ) {
		super( 'Trigger: ' + type );

		let input = new NodeInput( this );

		signals.turnOnOffFaceTracking.dispatch( true );

		this.addInput( input );

		$( this.domElement ).find( "button.delete" ).on( 'click', function () {
			signals.turnOnOffFaceTracking.dispatch( false );
		} );
	}
}

class TickTriggerNode extends Node {
	constructor ( type ) {
		super( 'Trigger: ' + type );


		// UI

		this.counter = 1;

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

		let input = new NodeInput( this );
		input.addNumberInput();

		this.addInput( input );

		let that = this;
		$( incrementer.dom ).click( function() {
			let input = new NodeInput( this );

			input.domElement.textContent = 'channel ' + that.counter + ': ';
			that.addInput( input );
			++that.counter;
		} );

		$( decrementer.dom ).click( function() {
			if( that.counter<=1 ) return;
			--that.counter;
			that.removeInput();
		} );


		// Dynamic

		this.handle = TickTriggerFunction( 1000 );

		$( input.domElement ).find( "input" ).change( function () {
			clearInterval( that.handle );
			let time_interval = Number( input.arg );
			if ( time_interval > 0 )
				that.handle = TickTriggerFunction( time_interval );
			else
				alert( 'The input must be a number!' );
		} );

		$( this.domElement ).find( "button.delete" ).on( 'click', function () {
			clearInterval( that.handle );
		} );
	}
}
