// class Pixi4ParticleExample {
// 	stop () {
// 		if ( this.emitterContainer !== null )
// 			this.stage.removeChild( this.emitterContainer );
//
// 		if ( this.updateId !== null ) {
// 			cancelAnimationFrame( this.updateId );
// 			this.updateId = null;
// 		}
// 	}
//
// 	display () {
// 		this.update();
// 	}
//
// 	updateConfig ( asset_name, config, emitterX, emitterY ) {
// 		let that = this;
// 		that.emitterContainer = new PIXI.Container();
//
// 		that.stage.addChild( that.emitterContainer );
//
// 		that.editor.protonPixi4Renderer.emitter = new PIXI.particles.Emitter( that.emitterContainer, that.assets[ asset_name ], config );
// 		that.editor.protonPixi4Renderer.emitter.updateOwnerPos( Number( emitterX.text.getValue() ), Number( emitterY.text.getValue() ) );
//
// 		that.canvas.addEventListener( 'mouseup', function ( e ) {
// 			let X = e.offsetX || e.layerX;
// 			let Y = e.offsetY || e.layerY;
// 			if ( !that.editor.protonPixi4Renderer.emitter ) return;
// 			that.editor.protonPixi4Renderer.emitter.emit = true;
// 			that.editor.protonPixi4Renderer.emitter.resetPositionTracking();
// 			that.editor.protonPixi4Renderer.emitter.updateOwnerPos( X, Y );
//
// 			emitterX.text.setValue( X );
// 			emitterY.text.setValue( Y );
// 		} );
// 	}
//
// 	constructor ( editor ) {
// 		this.editor = editor;
//
// 		this.width = editor.protonPixi4Renderer.width;
// 		this.height = editor.protonPixi4Renderer.height;
//
// 		this.canvas = editor.protonPixi4Renderer.canvas;
// 		this.stage = editor.protonPixi4Renderer.stage;
// 		this.assets = editor.protonPixi4Renderer.assets;
// 		this.renderer = editor.protonPixi4Renderer.renderer;
// 		this.updateId = editor.protonPixi4Renderer.updateId;
// 		this.update = editor.protonPixi4Renderer.update;
// 	}
// }

class BackgroundAnimationController {
	constructor ( editor, outX, outY ) {
		this.editor = editor;
		this.emitter = new Proton.BehaviourEmitter();
		this.emitter.rate = new Proton.Rate( new Proton.Span( 25, 40 ), new Proton.Span( .2, .5 ) );
		this.editor.protonPixi4Renderer.proton.addEmitter( this.emitter );

		this.emitter.p.x = outX.getArg();
		this.emitter.p.y = outY.getArg();

		let canvas = document.getElementById('BackgroundAnimationCanvas').firstChild;

		let that = this;
		canvas.addEventListener( 'mouseup', function ( e ) {
			let X = e.offsetX || e.layerX;
			let Y = e.offsetY || e.layerY;
			that.emitter.p.x = X;
			that.emitter.p.y = Y;
			outX.setArg(X);
			outY.setArg(Y);
			that.emitter.emit( 'once' );
		});
	}

	updateEmitter ( _name, _mass, _X, _Y ) {

		this.emitter.removeAllInitializers();
		this.emitter.removeAllBehaviours();

		let filename = "./asset/background/small/" + _name + ".png";
		this.emitter.addInitialize( new Proton.Body( filename ) );

		let mass = 1 / Number(_mass);
		this.emitter.addInitialize( new Proton.Mass( mass ) );

		this.emitter.p.x = Number(_X);
		this.emitter.p.y = Number(_Y);

		this.emitter.addInitialize( new Proton.Velocity( new Proton.Span( 3, 9 ), new Proton.Span( 0, 30, true ), 'polar' ) );

		this.emitter.addBehaviour( new Proton.Gravity( 8 ) );
		this.emitter.addBehaviour( new Proton.Scale( new Proton.Span( 1, 3 ), 0.3 ) );
		this.emitter.addBehaviour( new Proton.Alpha( 1, 0.5 ) );
		this.emitter.addBehaviour( new Proton.Rotate( 0, Proton.getSpan( -8, 9 ), 'add' ) );

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
	container.setTop( '32px' );
	container.setRight( '600px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.9 );
	container.dom.style.zIndex = "2";

	let width = editor.protonPixi4Renderer.width;
	let height = editor.protonPixi4Renderer.height;

	// initialize proton in editor
	editor.protonPixi4Renderer.app = new PIXI.Application( width, height, { transparent: true } );
	container.dom.appendChild( editor.protonPixi4Renderer.app.view );

	editor.protonPixi4Renderer.proton = new Proton();
	editor.protonPixi4Renderer.proton.addRenderer( new Proton.PixiRenderer( editor.protonPixi4Renderer.app.stage ) );


	function backgroundUpdate() {
		requestAnimationFrame( backgroundUpdate );

		editor.protonPixi4Renderer.proton.update();
	}

	backgroundUpdate();

	return container;

};
