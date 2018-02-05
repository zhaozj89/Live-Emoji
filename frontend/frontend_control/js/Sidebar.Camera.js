/**
 * @author mrdoob / http://mrdoob.com/
 */

// easyrtc

var selfEasyrtcid = "";

function connect () {
	// easyrtc.setVideoDims(640,480);
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
	clearConnectList();
	var otherClientDiv = document.getElementById( 'otherClients' );
	for ( var easyrtcid in data ) {
		var button = document.createElement( 'button' );
		button.onclick = function ( easyrtcid ) {
			return function () {
				performCall( easyrtcid );
			};
		}( easyrtcid );

		// var label = document.createTextNode(easyrtc.idToName(easyrtcid));
		var label = document.createTextNode( 'Connect' );
		button.appendChild( label );
		otherClientDiv.appendChild( button );
	}
}


function performCall ( otherEasyrtcid ) {
	easyrtc.hangupAll();

	var successCB = function () {
	};
	var failureCB = function () {
	};
	easyrtc.call( otherEasyrtcid, successCB, failureCB );
}


function loginSuccess ( easyrtcid ) {
	selfEasyrtcid = easyrtcid;
	// document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
}


function loginFailure ( errorCode, message ) {
	easyrtc.showError( errorCode, message );
}

Sidebar.Camera = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	var overlayedPanel = new UI.Panel();
	overlayedPanel.setWidth( '250px' );
	overlayedPanel.setHeight( '200px' );

	container.add( overlayedPanel );

	// Webcam

	var videoStream = new UI.Video();
	videoStream.setPosition( 'absolute' );
	videoStream.setId( 'selfVideo' );
	videoStream.dom.width = 250;
	videoStream.dom.height = 200;
	// vid.setControls( true );
	videoStream.setPreload( 'auto' );
	videoStream.setLoop( true );
	videoStream.setPlaysinline( true );
	videoStream.setAutoplay( true );
	videoStream.dom.muted = 'muted';
	var videoStreamWidth = videoStream.dom.width;
	var videoStreamHeight = videoStream.dom.height;

	overlayedPanel.add( videoStream );

	var videoStreamOverlay = new UI.Canvas();
	videoStreamOverlay.setPosition( 'absolute' );
	videoStreamOverlay.setId( 'videoStreamOverlay' );
	videoStreamOverlay.dom.width = 250;
	videoStreamOverlay.dom.height = 200;

	overlayedPanel.add( videoStreamOverlay );

	var startButton = new UI.Button( 'Start' );
	startButton.setValue( 'wait, loading video' );
	startButton.setId( 'startButton' );
	startButton.setType( 'button' );
	startButton.setDisabled( 'disabled' );
	startButton.setLeft( '10px' );

	$( startButton.dom ).click( function () {
		TurnONOFFFaceTracking();
	} );

	signals.turnOnOffFaceTracking.add( function ( on_off ) {
		if ( startButton.dom.textContent === 'Start' ) {
			if ( on_off === true ) TurnONOFFFaceTracking();
		}
		else {
			if ( on_off === false ) TurnONOFFFaceTracking();
		}
	} );

	container.add( startButton );

	// caller

	var callerPanel = new UI.Panel();
	callerPanel.setWidth( '250px' );
	callerPanel.setHeight( '200px' );

	container.add( callerPanel );

	var callerVideoStream = new UI.Video();
	callerVideoStream.setPosition( 'absolute' );
	callerVideoStream.setId( 'callerVideo' );
	callerVideoStream.dom.width = 250;
	callerVideoStream.dom.height = 200;
	callerVideoStream.setAutoplay( true );

	callerPanel.add( callerVideoStream );

	var otherClients = new UI.Div();
	otherClients.setId( 'otherClients' );

	container.add( otherClients );

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

	var emotionClassifer = new EmotionClassifier();
	emotionClassifer.init( EmotionModel );

	var ctrack = new clm.tracker( { useWebGL: true } );
	ctrack.init();

	// Start Detection / Tracking

	let resVals = [];
	let bufSize = 20;

	function lpf ( nextValue, smoothing ) {
		if( resVals.length < bufSize ) {
			resVals.push(nextValue);
			return null;
		}
		else {
			let initial = resVals.shift();
			resVals.push( nextValue );

			return resVals.reduce( function ( last, current ) {
				let res = {x: 0, y:0};
				res.x = smoothing * current.x + ( 1 - smoothing ) * last.x;
				res.y = smoothing * current.y + ( 1 - smoothing ) * last.y;
				return res;
			}, initial );
		}
	}

	let requestId;

	let FaceTracker = new ParticleFilter();
	FaceTracker.init( videoStreamWidth, videoStreamHeight, 500, 1 );

	let pred = null;
	let measurement = null;
	let corr = null;

	function MainLoop () {
		requestId = undefined;

		// predict
		pred = FaceTracker.predict();

		// measure
		GetFaceEmotion();

		measurement = GetFaceLandmark();

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
			if( lpfCorr!==null ) {
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

	function GetFaceLandmark () {
		let positions = ctrack.getCurrentPosition();

		if ( positions ) {

			// let normalizedPositions = positions.map( function( arr ) {
			// 	return arr.slice();
			// } );

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

			// for ( let i=0; i<normalizedPositions.length; ++i ) {
			// 	normalizedPositions[i][0] -= resX;
			// 	normalizedPositions[i][1] -= resY;
			// }
			//
			// let res = numeric.svd( normalizedPositions );
			//
			// let x0 = res.V[0][0] * videoStreamWidth + videoStreamWidth/2;
			// let y0 = -res.V[0][1] * videoStreamHeight + videoStreamHeight/2;
			//
			// let x1 = res.V[1][0] * videoStreamWidth + videoStreamWidth/2;
			// let y1 = -res.V[1][1] * videoStreamHeight + videoStreamHeight/2;

			// videoStreamOverlayContext.clearRect( 0, 0, videoStreamWidth, videoStreamHeight );

			// videoStreamOverlayContext.height = videoStreamHeight;

			// videoStreamOverlayContext.strokeStyle = "#FF0000";
			// videoStreamOverlayContext.moveTo( videoStreamWidth/2, videoStreamHeight/2 );
			// videoStreamOverlayContext.lineTo( x0, y0 );
			// videoStreamOverlayContext.stroke();

			// console.log( x0, y0 );
			//
			// videoStreamOverlayContext.fillStyle = "#0034ff";
			// videoStreamOverlayContext.moveTo( videoStreamWidth/2, videoStreamHeight/2 );
			// videoStreamOverlayContext.lineTo( x1, y1 );
			// videoStreamOverlayContext.stroke();
			//
			// console.log( x1, y1 );

			// res.V[0]

			// res.V[0]
			// console.log( res.V );
			// console.log( 'S: ' + res.S );
		}
		else
			return null;

		// if ( positions ) {
		// 	let res = { x: 0, y: 0 };
		//
		// 	for ( let i = 0; i < positions.length; ++i ) {
		// 		res.x += positions[ i ][ 0 ];
		// 		res.y += positions[ i ][ 1 ];
		// 	}
		//
		// 	res.x /= positions.length;
		// 	res.y /= positions.length;
		//
		// 	res.x = res.x / videoStreamWidth - 0.5;
		// 	res.y = res.y / videoStreamWidth - 0.5;
		//
		// 	res.x *= 10;
		// 	res.y *= 10;
		// }
	}

	function GetFaceEmotion () {
		var mostPossibleEmotion = "";
		var highestVal = 0;
		var emotionRes = emotionClassifer.meanPredict( ctrack.getCurrentParameters() );

		for ( let i = 0; i < emotionRes.length; ++i ) {
			if ( highestVal < emotionRes[ i ].value ) {
				highestVal = emotionRes[ i ].value;
				mostPossibleEmotion = emotionRes[ i ].emotion;
			}
		}

		switch ( mostPossibleEmotion ) {
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
			default:
				FACE_INFORMATION[ 'emotion' ] = EMOTION_TYPE.NEUTRAL;
				break;
		}

		signals.followEmotion.dispatch( FACE_INFORMATION[ 'emotion' ] );
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

	return container;

};
