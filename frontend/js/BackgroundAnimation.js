class Pixi4ParticleExample {
	stop () {
		if( this.emitterContainer!==null  )
			this.stage.removeChild( this.emitterContainer );

		if( this.updateId!==null ) {
			cancelAnimationFrame( this.updateId );
			this.updateId = null;
		}
	}

	display() {
		this.update();
	}

	updateConfig( asset_name, config, emitterX, emitterY ) {
		let that = this;
		that.emitterContainer = new PIXI.Container();

		that.stage.addChild( that.emitterContainer );

		that.editor.pixi4Obj.emitter = new PIXI.particles.Emitter( that.emitterContainer, that.assets[asset_name], config );
		that.editor.pixi4Obj.emitter.updateOwnerPos( Number(emitterX.text.getValue()), Number(emitterY.text.getValue()) );

		that.canvas.addEventListener( 'mouseup', function ( e ) {
			let X = e.offsetX || e.layerX;
			let Y = e.offsetY || e.layerY;
			if ( !that.editor.pixi4Obj.emitter ) return;
			that.editor.pixi4Obj.emitter.emit = true;
			that.editor.pixi4Obj.emitter.resetPositionTracking();
			that.editor.pixi4Obj.emitter.updateOwnerPos( X, Y );

			emitterX.text.setValue( X );
			emitterY.text.setValue( Y );
		} );
	}

	constructor ( editor ) {
		this.editor = editor;

		this.width = editor.pixi4Obj.width;
		this.height = editor.pixi4Obj.height;

		this.canvas = editor.pixi4Obj.canvas;
		this.stage = editor.pixi4Obj.stage;
		this.assets = editor.pixi4Obj.assets;
		this.renderer = editor.pixi4Obj.renderer;
		this.updateId = editor.pixi4Obj.updateId;
		this.update = editor.pixi4Obj.update;
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

	let width = editor.pixi4Obj.width;
	let height = editor.pixi4Obj.height;

	editor.pixi4Obj.canvas = canvas.dom;
	let loader = editor.pixi4Obj.loader;

	editor.pixi4Obj.renderer = PIXI.autoDetectRenderer( width, height, { view: canvas.dom, transparent: true });

	let elapsed = Date.now();

	editor.pixi4Obj.update = function () {
		editor.pixi4Obj.updateId = requestAnimationFrame( editor.pixi4Obj.update );

		let now = Date.now();
		if ( editor.pixi4Obj.emitter )
			editor.pixi4Obj.emitter.update( ( now - elapsed ) * 0.001 );

		elapsed = now;
		editor.pixi4Obj.renderer.render( editor.pixi4Obj.stage );
	};

	editor.pixi4Obj.renderer.resize( width, height );

	let asset_name = ['fire', 'heart', 'poop', 'raindrop', 'splatter1', 'splatter2', 'surprised', 'yellowbubble'];
	loader.load( function () {
		for(let k=0; k<asset_name.length; ++k) {
			let art = [];
			let name = './asset/background/small/' + asset_name[k] + '.png';
			art.push( PIXI.Texture.fromImage( name ) );
			editor.pixi4Obj.assets[asset_name[k]] = art;
		}
	} );

	return container;

};
