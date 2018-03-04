
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

	run( obj, info, extra_info ) {
		// let val = this.objectOptions.arg;
		// console.log( val );

		obj.updateEmotion( info );
		extra_info.editor.signals.sceneGraphChanged.dispatch();
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

		this.sourceStrokes = {};
		this.travelStrokes = {};

		this.canvasWidth = 0;
		this.canvasHeight = 0;

		// add a canvas here
		this.brushCanvas = new BrushCanvas( this.sourceStrokes, this.travelStrokes, this, source, travel );
		document.body.appendChild( this.brushCanvas.dom );

		this.sourceStrokeCounter = 0;
		this.travelStrokeCounter = 0;

		let that = this;
		$( function (  ) {
			let canvas = that.brushCanvas.dom.firstChild;
			that.canvasWidth = canvas.width;
			that.canvasHeight = canvas.height;
		} );
	}

	run ( obj, info, extra_info ) {
		let sourceStrokes = this.sourceStrokes;
		let travelStrokes = this.travelStrokes;

		let msg = {
			sourceStrokes: sourceStrokes,
			travelStrokes: travelStrokes,
			textureName: info
		};

		extra_info.editor.signals.runBackgroundTexturePattern.dispatch( msg );

		// for( let i=0; i<obj.all.length; ++i ) {
		//
		// 	if(obj.all[i].name === info ) {
		// 		let cur_obj = obj.all[i].mesh;
		// 		extra_info.editor.execute( new SetScaleCommand( cur_obj, new THREE.Vector3( 0.5, 0.5, 0.5 ) ) );
		// 		extra_info.editor.execute( new SetPositionCommand( cur_obj, new THREE.Vector3( 0, 0, 5 ) ) );
		//
		// 		let particleSystem = new ParticleSystem( sourceStrokes, travelStrokes, cur_obj, extra_info.editor,
		// 			this.canvasWidth, this.canvasHeight,
		// 			extra_info.right - extra_info.left,
		// 			extra_info.bottom - extra_info.top );
		//
		// 		for( let k=0; k<100; ++k ) {
		//
		// 			particleSystem.addParticle();
		// 			particleSystem.run();
		// 		}
		//
		// 		extra_info.editor.signals.sceneGraphChanged.dispatch();
		// 	}
		// }
	}
}


var BrushCanvas = function ( sourceStrokes, travelStrokes, that, source, travel ) {
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

		let isDrawing = false;

		resizeCanvasToDisplaySize( canvas.dom );

		$( canvas.dom ).mousedown( function ( event ) {
			isDrawing = true;

			if ( that.strokeInput.selectMenu.getValue()==='SourceStroke' ) {
				let newStroke = [];
				let name = 'SourceStroke' + that.sourceStrokeCounter;
				sourceStrokes[name] = newStroke;
				ctx.strokeStyle = source.getValue();
				that.sourceStrokeCounter++;
			}
			else if ( that.strokeInput.selectMenu.getValue()==='TravelStroke' ) {
				let newStroke = [];
				let name = 'TravelStroke' + that.travelStrokeCounter;
				travelStrokes[name] = newStroke;
				ctx.strokeStyle = travel.getValue();
				that.travelStrokeCounter++;
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
				if ( that.strokeInput.selectMenu.getValue()==='SourceStroke' ) {
					let tmp = new Vector2(event.clientX, event.clientY - 32);
					let name = 'SourceStroke' + (that.sourceStrokeCounter-1);
					sourceStrokes[name].push( tmp );
				}
				else if ( that.strokeInput.selectMenu.getValue()==='TravelStroke' ) {
					let tmp = new Vector2(event.clientX, event.clientY - 32);
					let name = 'TravelStroke' + (that.travelStrokeCounter-1);
					travelStrokes[name].push( tmp );
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
