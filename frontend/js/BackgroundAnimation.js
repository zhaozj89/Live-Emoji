class Pixi4ParticleExample {
	destroy () {
		this.stage.destroy( true );
		this.stage = null;

		this.renderer.destroy( true );
		this.renderer = null;

		let canvas = new UI.Canvas();
		canvas.setId( 'BackgroundAnimationCanvas' );
		canvas.setPosition( 'absolute' );
		canvas.dom.style.width = '100%';
		canvas.dom.style.height = '100%';

		document.getElementById( "BackgroundAnimation" ).appendChild( canvas.dom );

		if( this.updateId!==null ) {
			cancelAnimationFrame( this.updateId );
			this.updateId = null;
		}
	}

	display() {
		this.update();
	}

	loadAsset( imagePath, config ) {
		let that = this;
		this.loader.load( function () {
			let art = [];
			art.push( PIXI.Texture.fromImage( imagePath ) );

			let emitterContainer = new PIXI.Container();
			that.stage.addChild( emitterContainer );

			that.emitter = new PIXI.particles.Emitter( emitterContainer, art, config );
			that.emitter.updateOwnerPos( that.width / 2, that.height / 2 );

			that.canvas.addEventListener( 'mouseup', function ( e ) {
				if ( !that.emitter ) return;
				that.emitter.emit = true;
				that.emitter.resetPositionTracking();
				that.emitter.updateOwnerPos( e.offsetX || e.layerX, e.offsetY || e.layerY );
			} );
		} );
	}

	constructor () {
		let that = this;

		this.width = 840;
		this.height = 681;

		this.canvas = document.getElementById( "BackgroundAnimationCanvas" );

		this.stage = new PIXI.Container();

		this.renderer = PIXI.autoDetectRenderer( that.width, that.height, { view: that.canvas, transparent: true });
		this.loader = PIXI.loader;

		let elapsed = Date.now();

		this.updateId = null;

		this.update = function () {
			that.updateId = requestAnimationFrame( that.update );

			let now = Date.now();
			if ( that.emitter )
				that.emitter.update( ( now - elapsed ) * 0.001 );

			elapsed = now;
			that.renderer.render( that.stage );
		};

		that.renderer.resize( that.width, that.height );

		// window.onresize = function ( event ) {
		// 	canvas.width = that.width;
		// 	canvas.height = that.height;
		// 	that.renderer.resize( canvas.width, canvas.height );
		// };
		// window.onresize();
	}
}


var BackgroundAnimationCanvas = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'BackgroundAnimation' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '600px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.9 );
	container.dom.style.zIndex = "1";

	let canvas = new UI.Canvas();
	canvas.setId( 'BackgroundAnimationCanvas' );
	canvas.setPosition( 'absolute' );
	canvas.dom.style.width = '100%';
	canvas.dom.style.height = '100%';

	container.add( canvas );

	return container;

};
