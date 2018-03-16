class DanmakuController {
	constructor ( editor ) {
		this.editor = editor;
		this.paper = editor.raphaelRenderer.paper;
	}

	display ( _text, _color, _size, _elapse, _manner ) {
		this.text = this.paper.text( _manner.sx, _manner.sy, _text );
		this.text.attr( 'font-size', _size );
		this.text.attr( 'fill', _color );

		this.text.animate( { x: _manner.ex, y: _manner.ey }, _elapse, 'bounce', deleteText );

		let that = this;
		function deleteText () {
			that.paper.clear();
		}
	}
}

var DanmakuAnimationCanvas = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'DanmakuAnimation' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '600px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.9 );
	container.dom.style.zIndex = "1";

	let canvas = new UI.Canvas();
	canvas.setId( 'DanmakuAnimationCanvas' );
	canvas.setPosition( 'absolute' );
	canvas.dom.style.width = '100%';
	canvas.dom.style.height = '100%';

	container.add( canvas );

	editor.raphaelRenderer.paper = Raphael( editor.raphaelRenderer.left, editor.raphaelRenderer.top, editor.raphaelRenderer.width, editor.raphaelRenderer.height );

	return container;
};
