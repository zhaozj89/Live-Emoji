
// TODO
// Add boundary checking, thus possibility for returning false

// class TranslationNode extends Node {
// 	constructor ( type ) {
// 		super( 'Action: ' + type );
//
// 		this.addOutput();
//
// 		this.direction = new LeafInput( 'direction: ' );
// 		this.direction.addSelectionInput( { 'horizontal': 'horizontal', 'vertical': 'vertical' } );
//
// 		this.translation = new LeafInput( 'translation (-2 - 2): ' );
// 		this.translation.addTextInput();
//
// 		this.addInput( this.direction );
// 		this.addInput( this.translation );
// 	}
//
// 	run ( object, targetPose ) {
//
// 		switch( this.direction.selectMenu.getValue() ) {
// 			case 'horizontal': {
// 				// object.position.x += Number( this.translation.text.getValue() );
//
// 				let targetPosition = {
// 					x: targetPose.x + Number( this.translation.text.getValue() ),
// 					y: targetPose.y,
// 					z: targetPose.z
// 				};
//
// 				let tween = new TWEEN.Tween( object.position ).to( targetPosition, 1000 );
//
// 				let res = targetPosition;
// 				res.angle = targetPose.angle;
// 				return {'tween': tween, 'state': true, 'pose': res};
// 			}
// 			case 'vertical': {
// 				let targetPosition = {
// 					x: targetPose.x,
// 					y: targetPose.y + Number( this.translation.text.getValue() ),
// 					z: targetPose.z
// 				};
//
// 				let tween = new TWEEN.Tween( object.position ).to( targetPosition, 1000 );
//
// 				let res = targetPosition;
// 				res.angle = targetPose.angle;
// 				return {'tween': tween, 'state': true, 'pose': res};
// 			}
// 		}
// 	}
// }
//
// class RotationNode extends Node {
// 	constructor ( type ) {
// 		super( 'Action: ' + type );
//
// 		this.addOutput();
//
// 		this.rotation = new LeafInput( 'rotation (-180 - 180): ' );
// 		this.rotation.addTextInput();
//
// 		this.addInput( this.rotation );
// 	}
//
// 	run ( object, targetPose ) {
//
// 		let targetOrientation = {
// 			x: object.rotation.x,
// 			y: object.rotation.y,
// 			z: targetPose.angle + ( Number( this.rotation.text.getValue() ) * Math.PI / 180 )
// 		};
//
// 		let tween = new TWEEN.Tween( object.rotation ).to( targetOrientation, 1000 );
//
// 		let res = {
// 			x: object.position.x,
// 			y: object.position.y,
// 			z: object.position.z,
// 			angle: targetOrientation.z
// 		};
// 		return {'tween': tween, 'state': true, 'pose': res};
// 	}
// }
//
// class SleepNode extends Node {
// 	constructor ( type ) {
// 		super( 'Action: ' + type );
//
// 		this.addOutput();
//
// 		this.sleepTime = new LeafInput( 'time (milliseconds): ' );
// 		this.sleepTime.addTextInput();
//
// 		this.addInput( this.sleepTime );
// 	}
//
// 	run ( object, targetPose) {
// 		let targetPosition = {
// 			x: targetPose.x,
// 			y: targetPose.y,
// 			z: targetPose.z
// 		};
//
// 		let tween = new TWEEN.Tween( object.position ).to( targetPosition, 1000 ).delay( Number( this.sleepTime.text.getValue() ) );
//
// 		return {'tween': tween, 'state': true, 'pose': targetPose};
// 	}
// }

class SwapNode extends Node {
	constructor ( type ) {
		super( 'Action: ' + type );

		// this.objectOptions = new LeafInput( 'Object: ' );
		// this.objectOptions.addObjectInput();
		//
		// this.addInput( this.objectOptions );

		this.addOutput();
	}

	run( obj, info ) {
		// let val = this.objectOptions.arg;
		// console.log( val );

		obj.updateEmotion( info );
		editor.signals.sceneGraphChanged.dispatch();
	}
}

var CreateRemoveButton2 = function ( that ) {
	let dom = document.createElement( 'button' );
	dom.classList.add( 'delete' );
	dom.textContent = 'X';

	$( dom ).on( 'click', function () {

		for ( let i = 0; i < that.inputs.length; ++i ) {
			if ( that.inputs[ i ].node !== null )
				that.inputs[ i ].node.detachInput( that.inputs[ i ] );
		}

		if( that.parentInput!==null ) {
			that.parentInput.domElement.classList.remove( 'filled' );
			that.parentInput.domElement.classList.add( 'empty' );
			that.parentInput.currentNode.inputs = [];

			that.detachInput( that.parentInput );

		}

		that.domElement.remove();
		that.brushCanvas.dom.remove();
	} );
	return dom;
};

class ParticleNode extends Node {
	constructor ( type ) {
		super( null );

		this.type = 'Action: ' + type;

		this.output = null;
		this.inputs = [];

		this.parentInput = null;

		this.attachedPaths = [];
		this.connected = false;

		this.domElement = CreateTitle( this.type );

		let removeButton = CreateRemoveButton2( this );
		this.domElement.appendChild( removeButton );


		// add select menu
		this.strokeInput = new LeafInput( 'Select stroke: ' );
		this.strokeInput.addSelectionInput( {
			'SourceStroke': 'source_stroke',
			'TravelStroke': 'travel_stroke',
		} );
		this.addInput( this.strokeInput );

		this.sourceStroke = new LeafInput( 'Source stroke: ' );
		let source = this.sourceStroke.addColorInput();
		this.addInput( this.sourceStroke );

		this.travelStroke = new LeafInput( 'Travel stroke: ' );
		let travel = this.travelStroke.addColorInput();
		this.addInput( this.travelStroke );

		this.addOutput();

		this.sourcePionts = [];
		this.travelPoints = [];

		// add a canvas here
		this.brushCanvas = new BrushCanvas( this.sourcePionts, this.travelPoints, this, source, travel );
		document.body.appendChild( this.brushCanvas.dom );

		// let canvas = this.brushCanvas.dom.firstChild;
		// let ctx = canvas.getContext( '2d' );

		// $( source.dom ).change( function () {
		// 	ctx.strokeStyle = source.getValue();
		// } );
		//
		// $( travel.dom ).change( function () {
		// 	ctx.strokeStyle = travel.getValue();
		// } );
	}


	run ( obj ) {

	}
}


var BrushCanvas = function ( sourcePoints, travelPoints, that, source, travel ) {
	var container = new UI.Panel();
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


	$( function () {
		let ctx = canvas.dom.getContext( '2d' );

		let flag = false,
			prevX = 0,
			currX = 0,
			prevY = 0,
			currY = 0;

		let isDrawing = false;

		resizeCanvasToDisplaySize( canvas.dom );

		$( canvas.dom ).mousedown( function ( event ) {
			isDrawing = true;

			if ( that.strokeInput.selectMenu.getValue()==='SourceStroke' ) {
				sourcePoints.push( (event.clientX, event.clientY - 32) );
				ctx.strokeStyle = source.getValue();
			}
			else if ( that.strokeInput.selectMenu.getValue()==='TravelStroke' ) {
				travelPoints.push( (event.clientX, event.clientY - 32) );
				ctx.strokeStyle = travel.getValue();
			}
			else {
				isDrawing = false;
				return;
			}

			ctx.beginPath();
			ctx.moveTo( event.clientX, event.clientY - 32 );
		} );

		$( canvas.dom ).mousemove( function ( event ) {
			if ( isDrawing ) {
				if ( that.strokeInput.selectMenu.getValue()==='source_stroke' ) {
					sourcePoints.push( (event.clientX, event.clientY - 32) );
				}
				else if ( that.strokeInput.selectMenu.getValue()==='travel_stroke' ) {
					travelPoints.push( (event.clientX, event.clientY - 32) );
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
