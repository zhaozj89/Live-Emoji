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


	// Creates canvas 320 × 200 at 10, 50
	let paper = Raphael(0, 32, 840, 681);

	var t = paper.text(100, 100, "愤怒!");

	t.attr( 'font-size', 80 );
	t.attr("fill", "#f00");

	t.animate({x:200, y:200}, 2000);

	return container;

};
