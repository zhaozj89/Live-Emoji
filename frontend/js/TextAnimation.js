class TextControl {
	constructor (editor) {
		this.editor = editor;
		this.paper = editor.raphaelObj.paper;
		this.text = null;
	}

	displayText (textVal, textConfig) {
		this.text = this.paper.text( textConfig.x, textConfig.y, textVal );
		this.text.attr( 'font-size', textConfig.fontSize );
		this.text.attr( 'fill', textConfig.fontColor );

		this.text.animate( {x: textConfig.ex, y: textConfig.ey}, textConfig.elapse, 'bounce', deleteText);

		let that = this;
		function deleteText () {
			that.paper.clear();
		}
	}
}

var TextAnimationCanvas = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'TextAnimation' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '600px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.9 );
	container.dom.style.zIndex = "2";

	let canvas = new UI.Canvas();
	canvas.setId( 'TextAnimationCanvas' );
	canvas.setPosition( 'absolute' );
	canvas.dom.style.width = '100%';
	canvas.dom.style.height = '100%';

	container.add( canvas );

	editor.raphaelObj.paper = Raphael(editor.raphaelObj.left, editor.raphaelObj.top, editor.raphaelObj.width, editor.raphaelObj.height);

	return container;
};
