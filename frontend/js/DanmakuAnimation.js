class DanmakuController {
	constructor ( editor ) {
		this.editor = editor;
		this.paper = editor.raphaelRenderer.paper;
	}

	display ( _text, _color, _size, _font, _elapse, _manner ) {
		this.text = this.paper.text( _manner.sx, _manner.sy, _text );
		this.text.attr( 'font-size', _size );
		this.text.attr( 'fill', _color );
		this.text.attr( 'font-family', _font );

		this.text.animate( { x: _manner.ex, y: _manner.ey }, _elapse, 'bounce', deleteText );

		let that = this;
		function deleteText () {
			that.paper.clear();

			console.log( 'text+' );
			editor.emotionCMDDurationMutex += 1;
		}
	}
}

var DanmakuAnimationCanvas = function ( editor ) {

	editor.raphaelRenderer.paper = Raphael( editor.raphaelRenderer.left, editor.raphaelRenderer.top, editor.raphaelRenderer.width, editor.raphaelRenderer.height );

	editor.raphaelRenderer.paper.canvas.style.zIndex = '2';
	editor.raphaelRenderer.paper.canvas.style.left = '300px';
	editor.raphaelRenderer.paper.canvas.style.right = '200px';
	editor.raphaelRenderer.paper.canvas.style.top = '40px';
	editor.raphaelRenderer.paper.canvas.style.bottom = '0px';
    // editor.raphaelRenderer.paper.canvas.style.backgroundColor = 'black';

	editor.danmaku_animation = editor.raphaelRenderer.paper.canvas;

	$(function () {
		let width = document.getElementById('viewport').clientWidth;
		let height = document.getElementById('viewport').clientHeight;

        editor.raphaelRenderer.paper.setSize( width, height );
    });

	// test
	// let text = editor.raphaelRenderer.paper.text( 400, 200, 'Good morning' );
	// text.attr('font-size', 100);
	// text.attr( 'font', 'sans-serif' );

	return editor.raphaelRenderer.paper.canvas;
};
