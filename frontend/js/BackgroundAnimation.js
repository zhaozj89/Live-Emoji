class BackgroundAnimationController {
	constructor ( editor, outX, outY ) {
		this.editor = editor;
		this.emitter = new Proton.BehaviourEmitter();
		// this.emitter.rate = new Proton.Rate( new Proton.Span( 25, 40 ), new Proton.Span( .2, .5 ) );
		this.editor.protonPixi4Renderer.proton.addEmitter( this.emitter );

		this.emitter.p.x = outX.getArg();
		this.emitter.p.y = outY.getArg();

		let canvas = document.getElementById( 'BackgroundAnimationCanvas' ).firstChild;

		let that = this;
		canvas.addEventListener( 'mouseup', function ( e ) {
			let X = e.offsetX || e.layerX;
			let Y = e.offsetY || e.layerY;

			// alert( X + ', ' + Y );

			if( that.editor.currentEmitter!==null && that.editor.runAtLeastOneCMD===true) { // && that.editor.currentEmitter===that.emitter ) {
				that.editor.currentEmitter.p.x = X;
				that.editor.currentEmitter.p.y = Y;
				outX.setArg( X );
				outY.setArg( Y );
				that.editor.currentEmitter.emit( 'once' );
			}
		} );
	}

	updateEmitter ( _name, _mass, _manner, _X, _Y ) {

		this.emitter.removeAllInitializers();
		this.emitter.removeAllBehaviours();

		let filename = "./asset/background/small/" + _name + ".png";
		this.emitter.addInitialize( new Proton.Body( filename ) );

		let mass = 1 / Number( _mass );
		this.emitter.addInitialize( new Proton.Mass( mass ) );
		this.emitter.p.x = Number( _X );
		this.emitter.p.y = Number( _Y );

		switch(_manner) {
			case 'rain': {
				this.emitter.rate = new Proton.Rate( new Proton.Span( 20, 40 ), new Proton.Span( .2, .4 ) );

				this.emitter.addInitialize(new Proton.Life(1, 3));
				this.emitter.addInitialize(new Proton.Position(new Proton.CircleZone(0, 0, 500)));
				this.emitter.addInitialize( new Proton.Velocity( new Proton.Span( 1, 1 ), new Proton.Span( 180, 180, true ), 'polar' ) );

				this.emitter.addBehaviour( new Proton.Gravity( 4 ) );
				this.emitter.addBehaviour( new Proton.Alpha( 1, 0.6 ) );

				break;
			}
			case 'explode': {
				this.emitter.rate = new Proton.Rate( new Proton.Span( 25, 40 ), new Proton.Span( .2, .5 ) );

				this.emitter.addInitialize(new Proton.Life(1, 3));
				this.emitter.addInitialize( new Proton.Velocity( new Proton.Span( 3, 9 ), new Proton.Span( 0, 30, true ), 'polar' ) );

				this.emitter.addBehaviour( new Proton.Gravity( 8 ) );
				this.emitter.addBehaviour( new Proton.Scale( new Proton.Span( 1, 3 ), 0.3 ) );
				this.emitter.addBehaviour( new Proton.Alpha( 1, 0.5 ) );
				this.emitter.addBehaviour( new Proton.Rotate( 0, Proton.getSpan( -8, 9 ), 'add' ) );

				break;
			}
			case 'jet': {
				this.emitter.rate = new Proton.Rate(new Proton.Span(40, 80), 0.1);

				// this.emitter.addInitialize(new Proton.P(new Proton.CircleZone(Number( _X ), Number( _Y ), 10)));
				this.emitter.addInitialize(new Proton.Life(5, 7));
				this.emitter.addInitialize(new Proton.V(new Proton.Span(2, 3), new Proton.Span(0, 30, true), 'polar'));

				this.emitter.addBehaviour(new Proton.Scale(1, .2));
				this.emitter.addBehaviour(new Proton.Alpha(1, .2));

				break;
			}
		}

		// this.emitter.addInitialize(new Proton.Life(1, 3));
		// this.emitter.addInitialize( new Proton.Velocity( new Proton.Span( 3, 9 ), new Proton.Span( 0, 30, true ), 'polar' ) );
		//
		// this.emitter.addBehaviour( new Proton.Gravity( 8 ) );
		// this.emitter.addBehaviour( new Proton.Scale( new Proton.Span( 1, 3 ), 0.3 ) );
		// this.emitter.addBehaviour( new Proton.Alpha( 1, 0.5 ) );
		// this.emitter.addBehaviour( new Proton.Rotate( 0, Proton.getSpan( -8, 9 ), 'add' ) );

		// this.emitter.addSelfBehaviour( new Proton.Gravity( 5 ) );
		// this.emitter.addSelfBehaviour( new Proton.RandomDrift( 30, 30, .1 ) );
		// this.emitter.addSelfBehaviour( new Proton.CrossZone( new Proton.RectZone( 50, 0, 953, 610 ), 'bound' ) );
	}

	display () {
		this.emitter.emit( 'once' );
	}
}

var BackgroundAnimationCanvas = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'BackgroundAnimationCanvas' );
	container.setPosition( 'absolute' );
	container.setTop( '40px' );
	container.setLeft( '300px' );
	container.setRight( '200px' );
	container.setOpacity( 0.9 );
	container.dom.style.zIndex = "3";

	editor.background_animation = container;

	editor.protonPixi4Renderer.proton = new Proton();

    $( function(){
        let width = document.getElementById('viewport').clientWidth;
        let height = document.getElementById('viewport').clientHeight;

        // initialize proton in editor
        editor.protonPixi4Renderer.app = new PIXI.Application( width, height, { transparent: true } );
        container.dom.appendChild( editor.protonPixi4Renderer.app.view );

        editor.protonPixi4Renderer.proton.addRenderer( new Proton.PixiRenderer( editor.protonPixi4Renderer.app.stage ) );

        function backgroundUpdate () {
            requestAnimationFrame( backgroundUpdate );

            editor.protonPixi4Renderer.proton.update();
        }

        backgroundUpdate();

        LoadEmotionCMDJSONFile( editor, 'test.json' );

		editor.protonPixi4Renderer.proton.addEventListener(Proton.PARTICLE_DEAD, function(particle) {

			let num = editor.protonPixi4Renderer.proton.getCount();

			if( num===1 ) {
				editor.runningEmotionCMDState.has_particle_node = false;
				editor.updateRunningEmotionCMDState();
			}
		});


		// for testing

		// rain
/*
		var emitter = new Proton.BehaviourEmitter();

		emitter.p.x = 500;
		emitter.p.y = 100;

		emitter.rate = new Proton.Rate( new Proton.Span( 20, 40 ), new Proton.Span( .2, .4 ) );

		editor.protonPixi4Renderer.proton.addEmitter( emitter );
		emitter.emit( 'once' );

		emitter.addInitialize( new Proton.Body( "./asset/background/small/raindrop.png" ) );
		emitter.addInitialize( new Proton.Mass( 1 ) );
		emitter.addInitialize(new Proton.Life(1, 3));
		emitter.addInitialize(new Proton.Position(new Proton.CircleZone(0, 0, 500)));
		emitter.addInitialize( new Proton.Velocity( new Proton.Span( 1, 1 ), new Proton.Span( 180, 180, true ), 'polar' ) );

		emitter.addBehaviour( new Proton.Gravity( 4 ) );
		emitter.addBehaviour( new Proton.Alpha( 1, 0.6 ) );
*/

		// bubble

		/*
		var emitter = new Proton.BehaviourEmitter();

		emitter.p.x = 500;
		emitter.p.y = 400;

		emitter.rate = new Proton.Rate( new Proton.Span( 25, 40 ), new Proton.Span( .2, .5 ) );

		editor.protonPixi4Renderer.proton.addEmitter( emitter );
		emitter.emit( 'once' );

		emitter.addInitialize( new Proton.Body( "./asset/background/small/yellowbubble.png" ) );
		emitter.addInitialize( new Proton.Mass( 1 ) );
		emitter.addInitialize(new Proton.Life(1, 3));
		emitter.addInitialize( new Proton.Velocity( new Proton.Span( 3, 9 ), new Proton.Span( 0, 30, true ), 'polar' ) );

		emitter.addBehaviour( new Proton.Gravity( 8 ) );
		emitter.addBehaviour( new Proton.Scale( new Proton.Span( 1, 3 ), 0.3 ) );
		emitter.addBehaviour( new Proton.Alpha( 1, 0.5 ) );
		emitter.addBehaviour( new Proton.Rotate( 0, Proton.getSpan( -8, 9 ), 'add' ) );
*/

		// var emitter = new Proton.BehaviourEmitter();
		//
		// emitter.p.x = 200;
		// emitter.p.y = 200;
		//
		// emitter.rate = new Proton.Rate(new Proton.Span(40, 80), 0.1);
		//
		// editor.protonPixi4Renderer.proton.addEmitter( emitter );
		// emitter.emit( 'once' );
		//
		// emitter.addInitialize( new Proton.Body( "./asset/background/small/fire.png" ) );
		// emitter.addInitialize(new Proton.Mass(1));
		// emitter.addInitialize(new Proton.P(new Proton.CircleZone(200, 200, 10)));
		// emitter.addInitialize(new Proton.Life(5, 7));
		// emitter.addInitialize(new Proton.V(new Proton.Span(2, 3), new Proton.Span(0, 30, true), 'polar'));
		//
		// emitter.addBehaviour(new Proton.Scale(1, .2));
		// emitter.addBehaviour(new Proton.Alpha(1, .2));

    } );

	return container;

};
