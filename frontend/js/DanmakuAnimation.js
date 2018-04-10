class DanmakuController {
	constructor ( editor ) {
		this.editor = editor;
		this.paper = editor.raphaelRenderer.paper;
	}

	display ( _text, _color, _size, _font, _elapse, _manner ) {
		let text = this.paper.text( _manner.sx, _manner.sy, _text );
		text.attr( 'font-size', _size );
		text.attr( 'fill', _color );
		text.attr( 'font-family', _font );

		text.animate( { x: _manner.ex, y: _manner.ey }, _elapse, '', deleteText );

		let that = this;
		function deleteText () {
			that.paper.clear();

			if( editor.runningEmotionCMDState.num_danmaku_node!==0 )
				editor.runningEmotionCMDState.num_danmaku_node--;
			editor.updateRunningEmotionCMDState();
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
