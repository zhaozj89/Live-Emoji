var BrushCanvas = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'brushCanvas' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '600px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.9 );
	container.dom.style.zIndex = "1";

	let canvas = new UI.Canvas();
	canvas.setId( 'mainCanvas' );
	canvas.setPosition( 'absolute' );
	canvas.dom.style.width = '100%';
	canvas.dom.style.height = '100%';

	container.add( canvas );

	editor.brushCanvas = canvas.dom;

	$( function () {
		let ctx = canvas.dom.getContext( '2d' );

		let isDrawing = false;

		resizeCanvasToDisplaySize( canvas.dom );

		$( canvas.dom ).mousedown( function ( event ) {
			isDrawing = true;

			if( editor.currentParticleNode!==null ) {
				if ( editor.currentParticleNode.strokeInput.selectMenu.getValue() === 'SourceStroke' ) {
					let newStroke = [];
					let name = 'SourceStroke' + editor.currentParticleNode.sourceStrokeCounter;
					editor.currentParticleNode.sourceStrokes[ name ] = newStroke;
					ctx.strokeStyle = editor.currentParticleNode.sourceStrokeColor.getValue();
					editor.currentParticleNode.sourceStrokeCounter++;
				}
				else if ( editor.currentParticleNode.strokeInput.selectMenu.getValue() === 'TravelStroke' ) {
					let newStroke = [];
					let name = 'TravelStroke' + editor.currentParticleNode.travelStrokeCounter;
					editor.currentParticleNode.travelStrokes[ name ] = newStroke;
					ctx.strokeStyle = editor.currentParticleNode.travelStrokeColor.getValue();
					editor.currentParticleNode.travelStrokeCounter++;
				}
				else {
					isDrawing = false;
					return;
				}

				ctx.beginPath();
				ctx.moveTo( event.clientX, event.clientY - 32 );
			}
		} );

		$( canvas.dom ).mousemove( function ( event ) {
			if ( isDrawing ) {
				if ( editor.currentParticleNode.strokeInput.selectMenu.getValue() === 'SourceStroke' ) {
					let tmp = new Vector2( event.clientX, event.clientY - 32 );
					let name = 'SourceStroke' + ( editor.currentParticleNode.sourceStrokeCounter - 1 );
					editor.currentParticleNode.sourceStrokes[ name ].push( tmp );
				}
				else if ( editor.currentParticleNode.strokeInput.selectMenu.getValue() === 'TravelStroke' ) {
					let tmp = new Vector2( event.clientX, event.clientY - 32 );
					let name = 'TravelStroke' + ( editor.currentParticleNode.travelStrokeCounter - 1 );
					editor.currentParticleNode.travelStrokes[ name ].push( tmp );
				}

				ctx.lineTo( event.clientX, event.clientY - 32 );
				ctx.stroke();
			}
		} );

		$( canvas.dom ).mouseup( function () {
			isDrawing = false;
			ctx.closePath();
		} );

		function resizeCanvasToDisplaySize ( canv ) {
			const width = canv.clientWidth;
			const height = canv.clientHeight;

			if ( canv.width !== width || canv.height !== height ) {
				canv.width = width;
				canv.height = height;
				return true;
			}
			return false;
		}
	} );


	return container;

};
