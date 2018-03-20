/**
 * @author mrdoob / http://mrdoob.com/
 */

// easyrtc

var selfEasyrtcid = "";

function addToConversation ( who, msgType, info ) {
	// alert( 'Received message from ' + who + ', as: ' + content );

	// console.log(content);
	switch ( info.type ) {
		case 'followFace': {
			let puppet = editor.selected;

			if ( puppet !== null ) {
				puppet.position.x = info.x;
				puppet.position.y = info.y;

				editor.signals.sceneGraphChanged.dispatch();
			}
			break;
		}

		case 'followEmotion': {
			let puppet = editor.selected;

			if ( puppet !== null ) {
				puppet.updateEmotion( info.emotion );
				editor.signals.sceneGraphChanged.dispatch();
			}
			break;
		}

		case 'followLeftEye': {
			let puppet = editor.selected;

			if ( puppet !== null ) {
				puppet.updateLeftEye( info.state );
				editor.signals.sceneGraphChanged.dispatch();
			}
			break;
		}

		case 'followRightEye': {
			let puppet = editor.selected;

			if ( puppet !== null ) {
				puppet.updateRightEye( info.state );
				editor.signals.sceneGraphChanged.dispatch();
			}
			break;
		}

		case 'followMouth': {
			let puppet = editor.selected;

			if ( puppet !== null ) {
				puppet.updateMouth( info.state );
				editor.signals.sceneGraphChanged.dispatch();
			}
			break;
		}
	}
}

function connect () {
	easyrtc.setPeerListener( addToConversation );
	easyrtc.setRoomOccupantListener( convertListToButtons );
	easyrtc.easyApp( "easyrtc.audioVideoSimple", "selfVideo", [ "callerVideo" ], loginSuccess, loginFailure );
}

function clearConnectList () {
	var otherClientDiv = document.getElementById( 'otherClients' );
	while ( otherClientDiv.hasChildNodes() ) {
		otherClientDiv.removeChild( otherClientDiv.lastChild );
	}
}

function convertListToButtons ( roomName, data, isPrimary ) {
	// console.log(data);
	clearConnectList();
	var otherClientDiv = document.getElementById( 'otherClients' );

	var rtcid = Object.keys( data )[ 0 ]; // Only allowing ONE client

	var button = document.createElement( 'button' );
	button.onclick = function ( easyrtcid ) {
		return function () {
			performCall( easyrtcid );

			// sendStuffWS( easyrtcid );
		};
	}( rtcid );

	var label = document.createTextNode( 'Connect' );
	button.appendChild( label );
	otherClientDiv.appendChild( button );

	editor.signals.teacherSendInfo2Students.add( function ( info ) {
		// console.log( info );
		sendStuffWS( rtcid, info );
	} );

	// for ( var easyrtcid in data ) {
	// 	var button = document.createElement( 'button' );
	// 	button.onclick = function ( easyrtcid ) {
	// 		return function () {
	// 			performCall( easyrtcid );
	//
	// 			sendStuffWS( easyrtcid );
	// 		};
	// 	}( easyrtcid );
	//
	// 	// var label = document.createTextNode( 'Connect/Send to: ' + easyrtc.idToName( easyrtcid ) );
	// 	var label = document.createTextNode( 'Connect' );
	// 	button.appendChild( label );
	// 	otherClientDiv.appendChild( button );
	//
	// 	editor.signals.teacherSendInfo2Students.add(function () {
	//
	//    });
	// }
}

function sendStuffWS ( otherEasyrtcid, info ) {
	// var text = 'Hello World!';

	easyrtc.sendDataWS( otherEasyrtcid, "message", info );

	// alert( 'Send to ' + easyrtc.idToName( otherEasyrtcid ) + ': ' + text );
}

function performCall ( otherEasyrtcid ) {
	easyrtc.hangupAll();

	var successCB = function () {
	};
	var failureCB = function () {
	};
	easyrtc.call( otherEasyrtcid, successCB, failureCB );

	//
}

function loginSuccess ( easyrtcid ) {
	selfEasyrtcid = easyrtcid;
	// document.getElementById( "otherClients" ).innerHTML = "I am " + easyrtc.cleanId( easyrtcid );
}

function loginFailure ( errorCode, message ) {
	easyrtc.showError( errorCode, message );
}

var VideoChar = function ( editor ) {

	let cameraView = new UI.Panel();
	cameraView.setTop( '100px' );
	cameraView.setLeft( '100px' );
	cameraView.setPosition( 'absolute' );
	cameraView.setDisplay( 'none' );
	editor.camera_view = cameraView;

	editor.camera_viewport.add( cameraView );

	let cameraViewHeader = new UI.Text( 'Camera View' );
	cameraViewHeader.setWidth( '100%' );
	cameraViewHeader.setPadding( '10px' );
	cameraViewHeader.dom.style.borderRadius = '5px';
	cameraViewHeader.setBackgroundColor( 'rgba(50, 50, 50, 0.5)' );

	cameraView.add( cameraViewHeader );

	let buttonSVG = ( function () {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'width', 32 );
		svg.setAttribute( 'height', 32 );
		var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		path.setAttribute( 'd', 'M 12,12 L 22,22 M 22,12 12,22' );
		path.setAttribute( 'stroke', '#fff' );
		svg.appendChild( path );
		return svg;
	} )();

	let close = new UI.Element( buttonSVG );
	close.setPosition( 'absolute' );
	close.setTop( '3px' );
	close.setRight( '1px' );
	close.setCursor( 'pointer' );

	close.onClick( function () {
		cameraView.setDisplay( 'none' );
	} );

	cameraViewHeader.add( close );

	let overlayedPanel = new UI.Panel();
	overlayedPanel.setWidth( '250px' );
	overlayedPanel.setHeight( '200px' );

	cameraView.add( overlayedPanel );

	// camera

	let videoStream = new UI.Video();
	videoStream.setPosition( 'absolute' );
	videoStream.setId( 'selfVideo' );
	videoStream.dom.width = 250;
	videoStream.dom.height = 200;
	videoStream.setPreload( 'auto' );
	videoStream.setLoop( true );
	videoStream.setPlaysinline( true );
	videoStream.setAutoplay( true );
	videoStream.dom.muted = 'muted';
	let videoStreamWidth = videoStream.dom.width;
	let videoStreamHeight = videoStream.dom.height;
	overlayedPanel.add( videoStream );

	let videoStreamOverlay = new UI.Canvas();
	videoStreamOverlay.setPosition( 'absolute' );
	videoStreamOverlay.setId( 'videoStreamOverlay' );
	videoStreamOverlay.dom.width = 250;
	videoStreamOverlay.dom.height = 200;
	overlayedPanel.add( videoStreamOverlay );

	let startButton = new UI.Button( 'Start' );
	startButton.setValue( 'wait, loading video' );
	startButton.setId( 'startButton' );
	startButton.setType( 'button' );
	startButton.setWidth( '100%' );
	startButton.dom.style.borderRadius = '5px';
	startButton.setDisabled( 'disabled' );

	$( startButton.dom ).click( function () {
		TurnONOFFFaceTracking();
	} );

	cameraView.add( startButton );

	// caller

	let studentView = new UI.Panel();
	studentView.setTop( '200px' );
	studentView.setLeft( '200px' );
	studentView.setPosition( 'absolute' );
	studentView.setDisplay( 'none' );
	editor.student_view = studentView;

	editor.camera_viewport.add( studentView );

	let studentViewHeader = new UI.Text( 'Student View' );
	studentViewHeader.setWidth( '100%' );
	studentViewHeader.setPadding( '10px' );
	studentViewHeader.dom.style.borderRadius = '5px';
	studentViewHeader.setBackgroundColor( 'rgba(50, 50, 50, 0.5)' );

	studentView.add( studentViewHeader );

	let studentButtonSVG = ( function () {
		let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'width', 32 );
		svg.setAttribute( 'height', 32 );
		let path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		path.setAttribute( 'd', 'M 12,12 L 22,22 M 22,12 12,22' );
		path.setAttribute( 'stroke', '#fff' );
		svg.appendChild( path );
		return svg;
	} )();

	let studentClose = new UI.Element( studentButtonSVG );
	studentClose.setPosition( 'absolute' );
	studentClose.setTop( '3px' );
	studentClose.setRight( '1px' );
	studentClose.setCursor( 'pointer' );

	studentClose.onClick( function () {
		studentView.setDisplay( 'none' );
	} );

	studentViewHeader.add( studentClose );

	let callerPanel = new UI.Panel();
	callerPanel.setWidth( '250px' );
	callerPanel.setHeight( '200px' );

	studentView.add( callerPanel );

	let callerVideoStream = new UI.Video();
	callerVideoStream.setPosition( 'absolute' );
	callerVideoStream.setId( 'callerVideo' );
	callerVideoStream.dom.width = 250;
	callerVideoStream.dom.height = 200;
	callerVideoStream.setAutoplay( true );

	callerPanel.add( callerVideoStream );

	let otherClients = new UI.Div();
	otherClients.setId( 'otherClients' );

	studentView.add( otherClients );

	//

	$( function () {
		$( cameraView.dom ).draggable();
		$( studentView.dom ).draggable();
	} );

	//

	var videoStreamOverlayContext = videoStreamOverlay.getContext( '2d' );

	//

	var faceTrackingStarted = false;

	// Initialization
	{
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

		function GetUserMediaSuccess ( stream ) {
			if ( "srcObject" in videoStream.dom ) {
				videoStream.dom.srcObject = stream;
			}
			else {
				videoStream.dom.src = ( window.URL && window.URL.createObjectURL( stream ) );
			}

			function adjustVideoProportions () {
				var proportion = videoStream.dom.videoWidth / videoStream.dom.videoHeight;
				videoStreamWidth = Math.round( videoStreamHeight * proportion );
				videoStream.dom.width = videoStreamWidth;
				videoStreamOverlay.dom.width = videoStreamWidth;
				callerVideoStream.dom.width = videoStreamWidth;

				overlayedPanel.setWidth( videoStreamWidth + 'px' );
			}

			videoStream.dom.onloadedmetadata = function () {
				adjustVideoProportions();
				videoStream.dom.play();
			}

			videoStream.dom.onresize = function () {
				adjustVideoProportions();
				if ( faceTrackingStarted ) {
					ctrack.stop();
					ctrack.reset();
					ctrack.start( videoStream.dom );
				}
			}
		}

		function GetUserMediaFail () {
		}

		if ( navigator.mediaDevices ) {
			navigator.mediaDevices.getUserMedia( { video: true } ).then( GetUserMediaSuccess ).catch( GetUserMediaFail );
		}
		else if ( navigator.getUserMedia ) {
			navigator.getUserMedia( { video: true }, GetUserMediaSuccess, GetUserMediaFail );
		}
		else {
			alert( "Your browser does not seem to support getUserMedia, using a fallback video instead." );
		}

		videoStream.dom.addEventListener( 'canplay', function () {
			startButton.dom.value = "Start";
			startButton.dom.disabled = null;
		}, false );

		// Provides requestAnimationFrame in a cross browser way
		window.requestAnimFrame = ( function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
					return window.setTimeout( callback, 1000 / 60 );
				};
		} )();

		// Provides cancelRequestAnimationFrame in a cross browser way
		window.cancelRequestAnimFrame = ( function () {
			return window.cancelAnimationFrame ||
				window.webkitCancelRequestAnimationFrame ||
				window.mozCancelRequestAnimationFrame ||
				window.oCancelRequestAnimationFrame ||
				window.msCancelRequestAnimationFrame ||
				window.clearTimeout;
		} )();
	}


	// Setup Models
	var ctrack = new clm.tracker( { useWebGL: true } );
	ctrack.init();

	// Start Detection / Tracking

	let resVals = [];
	let bufSize = 20;

	function lpf ( nextValue, smoothing ) {
		if ( resVals.length < bufSize ) {
			resVals.push( nextValue );
			return null;
		}
		else {
			let initial = resVals.shift();
			resVals.push( nextValue );

			return resVals.reduce( function ( last, current ) {
				let res = { x: 0, y: 0 };
				res.x = smoothing * current.x + ( 1 - smoothing ) * last.x;
				res.y = smoothing * current.y + ( 1 - smoothing ) * last.y;
				return res;
			}, initial );
		}
	}

	let requestId = undefined;

	let FaceTracker = new ParticleFilter();
	FaceTracker.init( videoStreamWidth, videoStreamHeight, 500, 1 );

	let pred = null;
	let measurement = null;
	let corr = null;

	let fpsInterval, now, then, elapsed;

	function MainLoop () {
		requestId = undefined;

		now = Date.now();
		elapsed = now - then;

		if ( elapsed > fpsInterval ) {
			then = now - ( elapsed % fpsInterval );

			// predict
			pred = FaceTracker.predict();

			// measure
			measurement = GetFaceEmotionAndLandmark();

			// correct
			if ( measurement === null ) {
				corr = pred;
			}
			else {
				corr = FaceTracker.correct( measurement.x, measurement.y );
			}

			// send signal
			if ( corr !== null ) {

				let lpfCorr = lpf( corr, 0.6 );
				if ( lpfCorr !== null ) {
					let res = { x: 0, y: 0 };

					res.x = lpfCorr.x / videoStreamWidth - 0.5;
					res.y = lpfCorr.y / videoStreamHeight - 0.5;

					res.x *= 10;
					res.y *= 10;

					signals.followFace.dispatch( res );
				}
			}

			DrawLandmark();

			StartMainLoop();
		}
	}

	function StartMainLoop () {
		if ( !requestId ) {
			requestId = requestAnimationFrame( MainLoop );
		}
	}

	function StopMainLoop () {
		if ( requestId ) {
			cancelAnimationFrame( requestId );
			requestId = undefined;
		}
	}

	function TurnONOFFFaceTracking () {

		if ( startButton.dom.textContent === 'Start' ) {
			startButton.dom.textContent = 'Stop';

			videoStream.dom.play();
			ctrack.start( videoStream.dom );
			faceTrackingStarted = true;

			let fps = 45;
			fpsInterval = 1000 / fps;
			then = Date.now();

			StartMainLoop();
		}
		else {
			startButton.dom.textContent = 'Start';

			ctrack.stop( videoStream.dom );
			faceTrackingStarted = false;

			videoStreamOverlayContext.clearRect( 0, 0, videoStreamWidth, videoStreamHeight );

			StopMainLoop();
		}
	}

	//load models
	var KerasJS = require( "keras-js" );
	var ndarray = require( "ndarray" );
	var ops = require( "ndarray-ops" );
	const blinkmodelLeft = new KerasJS.Model( {
		filepath: './js/face/blink.bin',
		gpu: true
	} );
	const blinkmodelRight = new KerasJS.Model( {
		filepath: './js/face/blink.bin',
		gpu: true
	} );

	const emotionmodel = new KerasJS.Model( {
		filepath: './js/face/emotion.bin',
		gpu: true
	} );

	//define canvas for image processing
	var captureCanvas = document.createElement( 'canvas' );		// internal canvas for capturing full images from video stream
	captureCanvas.width = 250;  //should be the same as videoStream.dom.width in Camera.js
	captureCanvas.height = 200; //should be the same as videoStream.dom.height in Camera.js
	var captureContext = captureCanvas.getContext( '2d' );

	var FaceCanvas = document.createElement( 'canvas' );
	FaceCanvas.width = 48;
	FaceCanvas.height = 48;
	var FaceContext = FaceCanvas.getContext( '2d' );

	var LeftEyeCanvas = document.createElement( 'canvas' );
	LeftEyeCanvas.width = 24;
	LeftEyeCanvas.height = 24;
	var LeftEyeContext = LeftEyeCanvas.getContext( '2d' );

	var RightEyeCanvas = document.createElement( 'canvas' );
	RightEyeCanvas.width = 24;
	RightEyeCanvas.height = 24;
	var RightEyeContext = RightEyeCanvas.getContext( '2d' );

	function GetFaceEmotionAndLandmark () {
		let positions = ctrack.getCurrentPosition();

		if ( positions ) {

			// open mouth detection
			let mousedist = positions[ 57 ][ 1 ] - positions[ 60 ][ 1 ];
			let mouthwidth = positions[ 50 ][ 0 ] - positions[ 44 ][ 0 ];
			if ( mousedist > mouthwidth * 0.18 ) {
				signals.followMouth.dispatch( 'open' );
			}
			else {
				signals.followMouth.dispatch( 'close' );
			}

			// let normalizedPositions = positions.map( function( arr ) {
			// 	return arr.slice();
			// } );

			//Blink & Emotion detection
			eyeRectRight.x = positions[ 23 ][ 0 ] - 5;
			eyeRectRight.y = positions[ 24 ][ 1 ] - 7;
			eyeRectRight.w = positions[ 25 ][ 0 ] - positions[ 23 ][ 0 ] + 10;
			eyeRectRight.h = positions[ 26 ][ 1 ] - positions[ 24 ][ 1 ] + 14;

			eyeRectLeft.x = positions[ 30 ][ 0 ] - 5;
			eyeRectLeft.y = positions[ 29 ][ 1 ] - 7;
			eyeRectLeft.w = positions[ 28 ][ 0 ] - positions[ 30 ][ 0 ] + 10;
			eyeRectLeft.h = positions[ 31 ][ 1 ] - positions[ 29 ][ 1 ] + 14;

			/*
			FaceRect.x = positions[0][0] - 5;
			FaceRect.y = positions[20][1] - 7;
			FaceRect.w = positions[14][0] - positions[0][0] + 10;
			FaceRect.h = positions[7][1] - positions[20][1] + 14;
			*/

			FaceRect.x = positions[ 0 ][ 0 ] - 20;
			FaceRect.y = positions[ 20 ][ 1 ] - 30;
			//FaceRect.w = positions[14][0] - positions[0][0] + 10;
			FaceRect.w = FaceRect.h = positions[ 7 ][ 1 ] - positions[ 20 ][ 1 ] + 30;

			var width = 24;
			var height = 24;
			captureContext.drawImage( videoStream.dom, 0, 0, videoStreamWidth, videoStreamHeight );

			LeftEyeContext.drawImage( captureCanvas, eyeRectLeft.x, eyeRectLeft.y, eyeRectLeft.w, eyeRectLeft.h, 0, 0, LeftEyeCanvas.width, LeftEyeCanvas.height );
			var LeftImageData = LeftEyeContext.getImageData( 0, 0, LeftEyeCanvas.width, LeftEyeCanvas.height );
			var LeftImageGray = grayscale( LeftImageData, 0.5 );
			var LeftEyedata = LeftImageGray.data;

			RightEyeContext.drawImage( captureCanvas, eyeRectRight.x, eyeRectRight.y, eyeRectRight.w, eyeRectRight.h, 0, 0, RightEyeCanvas.width, RightEyeCanvas.height );
			var RightImageData = RightEyeContext.getImageData( 0, 0, RightEyeCanvas.width, RightEyeCanvas.height );
			var RightImageGray = grayscale( RightImageData, 0.5 );
			var RightEyedata = RightImageGray.data;

			FaceContext.drawImage( captureCanvas, FaceRect.x, FaceRect.y, FaceRect.w, FaceRect.h, 0, 0, FaceCanvas.width, FaceCanvas.height );
			var FaceImageData = FaceContext.getImageData( 0, 0, FaceCanvas.width, FaceCanvas.height );
			var FaceImageGray = grayscale( FaceImageData, 0 );
			var Facedata = FaceImageGray.data;

			blinkmodelLeft.ready()
			.then( () => {
				var dataTensor = ndarray( new Float32Array( LeftEyedata ), [ width, height, 4 ] )
				var dataProcessedTensor = ndarray( new Float32Array( width * height * 3 ), [ width, height, 3 ] )
				ops.divseq( dataTensor, 255 )
				ops.subseq( dataTensor, 0.5 )
				ops.mulseq( dataTensor, 2 )
				ops.assign( dataProcessedTensor.pick( null, null, 0 ), dataTensor.pick( null, null, 0 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 1 ), dataTensor.pick( null, null, 1 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 2 ), dataTensor.pick( null, null, 2 ) )
				var preprocessedData = dataProcessedTensor.data;
				var inputData = { "input": preprocessedData }
				return blinkmodelLeft.predict( inputData )
			} )
			.then( outputData => {
				if ( outputData.output < 0.2 ) {
					FACE_INFORMATION[ 'left_eye' ] = EYE_STATUS.CLOSE;
					signals.followLeftEye.dispatch( 'close' );
				}
				else {
					FACE_INFORMATION[ 'left_eye' ] = EYE_STATUS.OPEN;
					signals.followLeftEye.dispatch( 'open' );
				}
			} )
			.catch( err => {
				console.log( err )
			} )

			blinkmodelRight.ready()
			.then( () => {
				var dataTensor = ndarray( new Float32Array( RightEyedata ), [ width, height, 4 ] )
				var dataProcessedTensor = ndarray( new Float32Array( width * height * 3 ), [ width, height, 3 ] )
				ops.divseq( dataTensor, 255 )
				ops.subseq( dataTensor, 0.5 )
				ops.mulseq( dataTensor, 2 )
				ops.assign( dataProcessedTensor.pick( null, null, 0 ), dataTensor.pick( null, null, 0 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 1 ), dataTensor.pick( null, null, 1 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 2 ), dataTensor.pick( null, null, 2 ) )
				var preprocessedData = dataProcessedTensor.data;
				var inputData = { "input": preprocessedData }
				return blinkmodelRight.predict( inputData )
			} )
			.then( outputData => {
				if ( outputData.output < 0.2 ) {
					FACE_INFORMATION[ 'right_eye' ] = EYE_STATUS.CLOSE;
					signals.followRightEye.dispatch( 'close' );
				}
				else {
					FACE_INFORMATION[ 'right_eye' ] = EYE_STATUS.OPEN;
					signals.followRightEye.dispatch( 'open' );
				}
			} )
			.catch( err => {
				console.log( err )
			} )


			emotionmodel.ready()
			.then( () => {
				var dataTensor = ndarray( new Float32Array( Facedata ), [ FaceCanvas.width, FaceCanvas.height, 4 ] );
				var dataProcessedTensor = ndarray( new Float32Array( FaceCanvas.width * FaceCanvas.height * 1 ), [ FaceCanvas.width, FaceCanvas.height, 1 ] );

				ops.divseq( dataTensor, 255 )
				ops.subseq( dataTensor, 0.5 )
				ops.mulseq( dataTensor, 2 )
				ops.assign( dataProcessedTensor.pick( null, null, 0 ), dataTensor.pick( null, null, 0 ) )
				var preprocessedData = dataProcessedTensor.data
				var inputData = { "input": preprocessedData }
				return emotionmodel.predict( inputData )
			} )
			.then( outputData => {
				var emotions = new Array();
				emotions[ 0 ] = { value: outputData.output[ 0 ], label: 'angry' };
				emotions[ 1 ] = { value: outputData.output[ 1 ], label: 'disgust' };
				emotions[ 2 ] = { value: outputData.output[ 2 ], label: 'fear' };
				emotions[ 3 ] = { value: outputData.output[ 3 ], label: 'happy' };
				emotions[ 4 ] = { value: outputData.output[ 4 ], label: 'sad' };
				emotions[ 5 ] = { value: outputData.output[ 5 ], label: 'surprised' };
				emotions[ 6 ] = { value: outputData.output[ 6 ], label: 'neutral' };

				signals.updateRecommendation.dispatch( outputData.output[ 3 ] );

				var emotionvalue = '';
				var mostPossible = '';
				var temp = 0;
				for ( i = 0; i < 7; i++ ) {
					emotionvalue += emotions[ i ].label + ": " + ( emotions[ i ].value * 100 ).toFixed( 1 ) + "% ";//e.g. disgusted: 15.1%
					if ( temp < emotions[ i ].value ) { //获取最高概率的情绪mostPossible
						temp = emotions[ i ].value;
						mostPossible = emotions[ i ].label;
					}
				}

				switch ( mostPossible ) {
					case 'happy':
						FACE_INFORMATION[ 'emotion' ] = EMOTION_TYPE.HAPPY;
						break;
					case 'sad':
						FACE_INFORMATION[ 'emotion' ] = EMOTION_TYPE.SAD;
						break;
					case 'surprised':
						FACE_INFORMATION[ 'emotion' ] = EMOTION_TYPE.SURPRISED;
						break;
					case 'angry':
						FACE_INFORMATION[ 'emotion' ] = EMOTION_TYPE.ANGRY;
						break;
					case 'neutral':
						FACE_INFORMATION[ 'emotion' ] = EMOTION_TYPE.NEUTRAL;
						break;
					default:
						FACE_INFORMATION[ 'emotion' ] = EMOTION_TYPE.NEUTRAL;
						break;
				}
				if ( FACE_INFORMATION[ 'emotion' ] === EMOTION_TYPE.NEUTRAL || FACE_INFORMATION[ 'emotion' ] === EMOTION_TYPE.HAPPY )
					signals.followEmotion.dispatch( FACE_INFORMATION[ 'emotion' ] );

				//show debug information about eyes and emotion, should delete it after completion
				// debugInf.setValue( 'left:' + FACE_INFORMATION[ 'left_eye' ] + '   right:' + FACE_INFORMATION[ 'right_eye' ] + ' ' +
				// 	"Predicted emotions: " + mostPossible + " " + "Possibilities of all emotions: " + emotionvalue );
			} )
			.catch( err => {
				console.log( err )
			} );

			//show debug information about eyes, should delete it after completion
			//debugInf.setValue('left:'+ FACE_INFORMATION['left_eye'] + '   right:' + FACE_INFORMATION['right_eye'] + ' ' +
			//"Predicted emotions: " + mostPossible + " " + "Possibilities of all emotions: " + emotionvalue);


			let resX = 0;
			let resY = 0;
			for ( let i = 0; i < positions.length; ++i ) {
				resX += positions[ i ][ 0 ];
				resY += positions[ i ][ 1 ];
			}

			resX /= positions.length;
			resY /= positions.length;

			return {
				'x': resX,
				'y': resY
			};
		}
		else
			return null;
	}

	function DrawLandmark () {
		videoStreamOverlayContext.clearRect( 0, 0, videoStreamWidth, videoStreamHeight );

		if ( pred !== null ) {
			videoStreamOverlayContext.strokeStyle = '#FF0000';
			videoStreamOverlayContext.strokeRect( pred.x - 5, pred.y - 5, 10, 10 );
		}

		if ( measurement != null ) {
			videoStreamOverlayContext.strokeStyle = '#ff6dcb';
			videoStreamOverlayContext.strokeRect( measurement.x - 5, measurement.y - 5, 10, 10 );
		}

		if ( corr !== null ) {
			videoStreamOverlayContext.strokeStyle = '#0004ff';
			videoStreamOverlayContext.strokeRect( corr.x - 5, corr.y - 5, 10, 10 );
		}

		if ( ctrack.getCurrentPosition() ) {
			ctrack.draw( videoStreamOverlay.dom );
		}
	}

};
