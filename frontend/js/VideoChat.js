/**
 * @author mrdoob / http://mrdoob.com/
 */

// easyrtc

var selfEasyrtcid = "";

class RecommendedCMD {
	constructor ( _key, _semantic ) {
		this.cell0 = document.createElement( 'td' );
		this.cell1 = document.createElement( 'td' );

		this.cell0.setAttribute( 'scope', 'col' );
		this.cell1.setAttribute( 'scope', 'col' );

		this.cell0.style.textAlign = 'center';
		this.cell1.style.textAlign = 'center';

		this.keyDiv = new UI.Text( _key );
		this.semanticDiv = new UI.Text( _semantic );

		this.cell0.appendChild( this.keyDiv.dom );
		this.cell1.appendChild( this.semanticDiv.dom );
	}

	updateInfo ( _key, _semantic ) {
		this.keyDiv.setValue( _key );
		this.semanticDiv.setValue( _semantic );
	}

	createDOM ( editor ) {

		this.row = document.createElement( 'tr' );
		this.row.appendChild( this.cell0 );
		this.row.appendChild( this.cell1 );

		return this.row;
	}
}

function performCall ( otherEasyrtcid ) {
	easyrtc.hangupAll();
	let successCB = function () {
		console.log( 'Calling ' + otherEasyrtcid + ' succeed!' );
	};
	let failureCB = function () {
		alert( 'Calling ' + otherEasyrtcid + ' fails!' );
	};
	easyrtc.call( otherEasyrtcid, successCB, failureCB );
}

function sendStuffWS ( otherEasyrtcid, info ) {
	easyrtc.sendDataWS( otherEasyrtcid, "message", info );
}

function loginSuccess ( easyrtcid ) {
	selfEasyrtcid = easyrtcid;
}

function loginFailure ( errorCode, message ) {
	easyrtc.showError( errorCode, message );
}

function addToConversation ( who, msgType, info ) {
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

		case 'emotionCMD': {
			let puppet = editor.selected;

			if ( puppet !== null ) {
				let nodeSession = new NodeSession( editor );
				nodeSession.fromJSON( JSON.parse( info.cmd ) );

				nodeSession.run( info.key );
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

function convertListToButtons ( roomName, data, isPrimary ) {
	let rtcid = Object.keys( data )[ 0 ]; // Only allowing ONE client

	editor.rtcid = rtcid;

	editor.signals.teacherSendInfo2Students.add( function ( info ) {
		sendStuffWS( rtcid, info );
	} );
}

var VideoChat = function ( editor ) {

	signals = editor.signals;

	//

	let wave = null;

	// audio detection
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	let audioContext = new AudioContext();
	let mediaStreamSource = null;
	let meter = null;

	try {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		navigator.getUserMedia(
			{
				"audio": {
					"mandatory": {
						"googEchoCancellation": "false",
						"googAutoGainControl": "false",
						"googNoiseSuppression": "false",
						"googHighpassFilter": "false"
					},
					"optional": []
				},
			}, gotStream, didntGetStream);
	} catch (e) {
		alert('getUserMedia threw exception :' + e);
	}

	function didntGetStream() {
		alert('Stream generation failed.');
	}

	function gotStream(stream) {
		mediaStreamSource = audioContext.createMediaStreamSource(stream);

		meter = createAudioMeter(audioContext);
		mediaStreamSource.connect(meter);
	}

	//define canvas for image processing
	let captureCanvas = document.createElement( 'canvas' );		// internal canvas for capturing full images from video stream
	captureCanvas.width = 250;  //should be the same as videoStream.dom.width in Camera.js
	captureCanvas.height = 200; //should be the same as videoStream.dom.height in Camera.js
	let captureContext = captureCanvas.getContext( '2d' );

	let FaceCanvas = document.createElement( 'canvas' );
	FaceCanvas.width = 48;
	FaceCanvas.height = 48;
	let FaceContext = FaceCanvas.getContext( '2d' );

	let LeftEyeCanvas = document.createElement( 'canvas' );
	LeftEyeCanvas.width = 24;
	LeftEyeCanvas.height = 24;
	let LeftEyeContext = LeftEyeCanvas.getContext( '2d' );

	let RightEyeCanvas = document.createElement( 'canvas' );
	RightEyeCanvas.width = 24;
	RightEyeCanvas.height = 24;
	let RightEyeContext = RightEyeCanvas.getContext( '2d' );

	//

	let faceLandmarkPosition = null;

	//

	let cameraView = new UI.Panel();
	cameraView.setTop( '0px' );
	cameraView.setLeft( '0px' );
	cameraView.setPosition( 'absolute' );
	cameraView.setDisplay( 'none' );
	editor.camera_view = cameraView;

	editor.camera_viewport.add( cameraView );

	let cameraViewHeader = new UI.Text( 'Performer View' );
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

	editor.video_stream = videoStream.dom;

	let videoStreamOverlay = new UI.Canvas();
	videoStreamOverlay.setPosition( 'absolute' );
	videoStreamOverlay.setId( 'videoStreamOverlay' );
	videoStreamOverlay.dom.width = 250;
	videoStreamOverlay.dom.height = 200;
	overlayedPanel.add( videoStreamOverlay );

	let startButton = new UI.Button( 'Start' );
	// startButton.setValue( 'wait, loading video' );
	startButton.setId( 'startButton' );
	startButton.setType( 'button' );
	startButton.setWidth( '100%' );
	startButton.dom.style.borderRadius = '5px';
	// startButton.setDisabled( 'disabled' );

	$( startButton.dom ).click( function () {
		TurnONOFFFaceTracking();
	} );

	cameraView.add( startButton );

	// caller

	let studentView = new UI.Panel();
	studentView.setTop( '0px' );
	// studentView.setRight( '0px' );
	studentView.setPosition( 'absolute' );
	studentView.setDisplay( 'none' );
	editor.student_view = studentView;

	editor.camera_viewport.add( studentView );

	let studentViewHeader = new UI.Text( 'Audience View' );
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
	callerPanel.setBackgroundColor( 'rgba(120, 120, 120, 0.6)' );

	studentView.add( callerPanel );

	let callerVideoStream = new UI.Video();
	callerVideoStream.setPosition( 'absolute' );
	callerVideoStream.setId( 'callerVideo' );
	callerVideoStream.dom.width = 250;
	callerVideoStream.dom.height = 200;
	callerVideoStream.setAutoplay( true );

	callerPanel.add( callerVideoStream );

	let recommendationPanel = new UI.Panel();
	recommendationPanel.setPosition( 'absolute' );
	recommendationPanel.setRight( '0px' );
	recommendationPanel.setBottom( '28px' );
	recommendationPanel.dom.width = 125;
	recommendationPanel.setBackgroundColor( 'rgba(0,0,0,0)' );

	// let voicePanel = new UI.Panel();
	// voicePanel.setPosition( 'absolute' );
	// voicePanel.setLeft( '0px' );
	// voicePanel.setBottom( '28px' );
	// voicePanel.setWidth( '40px' );
	// voicePanel.setHeight( '30px' );
	// voicePanel.dom.style.borderRadius = '5px';
	// voicePanel.setBackgroundColor( 'rgba(100,100,100,0.5)' );
	//
	// callerPanel.add( voicePanel );
	callerPanel.add( recommendationPanel );

	//

	let waveform = new UI.Panel();
	waveform.setId( 'waveform' );
	waveform.setWidth( '100%' );
	waveform.setHeight( '30%' );
	waveform.setPosition( 'absolute' );
	waveform.setLeft( '0' );
	waveform.setTop( '50%' );
	waveform.setMargin( '-15% auto' );
	waveform.setOpacity( '0.8' );

	let bar = new UI.Panel();
	bar.setId( 'bar' );
	bar.setPosition( 'absolute' );
	bar.setTop( '50%' );
	bar.setWidth( '100%' );
	bar.setHeight( '1px' );
	bar.setBackgroundColor( 'rgba(255,255,255,0.9)' );
	bar.dom.style.boxShadow = '1px 1px 2px rgba(0, 0, 0, 0.33)';
	bar.setOpacity( '0.6' );

	studentView.add( waveform );
	studentView.add( bar );

	$(function (  ) {
		wave = new SiriWave({
			container: waveform.dom,
			width: studentView.dom.innerWidth,
			height: studentView.dom.innerHeight * 0.3,
			cover: true,
			// speed: 0.03,
			speed: 0.2,
			amplitude: 0.000001,
			// amplitude: 0.7,
			frequency: 2
		});

		wave.start();
	});

	//

	let table = document.createElement( "TABLE" );
	table.style.class = 'table table-hover table-dark';
	table.style.width = '100%';
	table.style.borderRadius = '10px';
	// let header = table.createTHead();
	// let headerRow = header.insertRow( 0 );
	//
	// let headerCell0 = document.createElement( 'th' );
	// let headerCell1 = document.createElement( 'th' );
	//
	// headerCell0.setAttribute( 'scope', 'col' );
	// headerCell1.setAttribute( 'scope', 'col' );
	//
	// headerCell0.style.textAlign = 'center';
	// headerCell1.style.textAlign = 'center';
	//
	// headerRow.appendChild( headerCell0 );
	// headerRow.appendChild( headerCell1 );
	//
	// let keyDiv = new UI.Text( 'Key' );
	// let semanticDiv = new UI.Text( 'Semantic' );
	//
	// keyDiv.setOpacity( '0.8' );
	// semanticDiv.setOpacity( '0.8' );
	//
	// headerCell0.appendChild( keyDiv.dom );
	// headerCell1.appendChild( semanticDiv.dom );

	recommendationPanel.dom.appendChild( table );

	let body = table.createTBody();

	let top0 = new RecommendedCMD( '', '' );
	let top1 = new RecommendedCMD( '', '' );
	let top2 = new RecommendedCMD( '', '' );

	let dom0 = top0.createDOM();
	let dom1 = top1.createDOM();
	let dom2 = top2.createDOM();

	dom0.style.color = 'chartreuse';
	dom1.style.color = 'crimson';
	dom2.style.color = 'aliceblue';

	dom0.style.opacity = '0.8';
	dom1.style.opacity = '0.8';
	dom2.style.opacity = '0.8';

	dom0.style.backgroundColor = 'rgba(100,100,100,0.1)';
	dom1.style.backgroundColor = 'rgba(100,100,100,0.1)';
	dom2.style.backgroundColor = 'rgba(100,100,100,0.1)';

	body.appendChild( dom0 );
	body.appendChild( dom1 );
	body.appendChild( dom2 );

	let connectButton = new UI.Button( 'Connect' );
	connectButton.setId( 'connectButton' );
	connectButton.setType( 'button' );
	connectButton.setWidth( '100%' );
	connectButton.dom.style.borderRadius = '5px';

	$( connectButton.dom ).click( function () {
		if ( editor.rtcid === null || editor.rtcid === undefined ) {
			alert( 'Peer computer is not set up!' );
			return;
		}
		else {
			console.log( 'calling: ' + editor.rtcid );
			performCall( editor.rtcid );
		}
	} );

	studentView.add( connectButton );

	editor.signals.displayRecommendationInAudienceView.add( function () {
		let row0 = editor.emotion_cmd_tablebody.rows[ 0 ];
		let row1 = editor.emotion_cmd_tablebody.rows[ 1 ];
		let row2 = editor.emotion_cmd_tablebody.rows[ 2 ];
		top0.updateInfo( row0.cells[ 0 ].innerText, row0.cells[ 1 ].innerText );
		top1.updateInfo( row1.cells[ 0 ].innerText, row1.cells[ 1 ].innerText );
		top2.updateInfo( row2.cells[ 0 ].innerText, row2.cells[ 1 ].innerText );
	} );

	//

	$( function () {
		$( cameraView.dom ).draggable();
		$( studentView.dom ).draggable();
	} );

	//

	let videoStreamOverlayContext = videoStreamOverlay.getContext( '2d' );

	//

	let faceTrackingStarted = false;

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
				let proportion = videoStream.dom.videoWidth / videoStream.dom.videoHeight;
				videoStreamWidth = Math.round( videoStreamHeight * proportion );
				videoStream.dom.width = videoStreamWidth;
				videoStreamOverlay.dom.width = videoStreamWidth;
				callerVideoStream.dom.width = videoStreamWidth;

				captureCanvas.width = videoStreamWidth;

				overlayedPanel.setWidth( videoStreamWidth + 'px' );
				callerPanel.setWidth( videoStreamWidth + 'px' );
				recommendationPanel.setWidth( videoStreamWidth/2 + 'px' );
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


	// setup model
	let ctrack = new clm.tracker( { useWebGL: true } );
	ctrack.init();

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

		// predict
		pred = FaceTracker.predict();

		// measure
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

		// console.log( meter.volume );
		wave.setAmplitude( meter.volume * 10 );
		editor.voiceMeter = meter.volume * 10;

		if ( meter.volume > 0.02 ) {
			// wave.start();
			signals.followMouth.dispatch( 'open' );
		}
		else {
			// wave.stop();
			signals.followMouth.dispatch( 'close' );
		}

		if( editor.runningEmotionCMDState.running===false )
			GetFaceEmotion();

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

			let fps = 10;
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

		editor.facetracking_running = faceTrackingStarted;
	}

	//load models
	let KerasJS = require( "keras-js" );
	let ndarray = require( "ndarray" );
	let ops = require( "ndarray-ops" );
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

	function GetFaceEmotion () { // kerasjs
		if ( faceLandmarkPosition !== null ) {
			let positions = faceLandmarkPosition;

			// // open mouth detection
			// let mousedist = positions[ 57 ][ 1 ] - positions[ 60 ][ 1 ];
			// let mouthwidth = positions[ 50 ][ 0 ] - positions[ 44 ][ 0 ];
			// if ( mousedist > mouthwidth * 0.18 ) {
			// 	signals.followMouth.dispatch( 'open' );
			// }
			// else {
			// 	signals.followMouth.dispatch( 'close' );
			// }

			//Blink & Emotion detection
			eyeRectRight.x = positions[ 23 ][ 0 ] - 5;
			eyeRectRight.y = positions[ 24 ][ 1 ] - 7;
			eyeRectRight.w = positions[ 25 ][ 0 ] - positions[ 23 ][ 0 ] + 10;
			eyeRectRight.h = positions[ 26 ][ 1 ] - positions[ 24 ][ 1 ] + 14;

			eyeRectLeft.x = positions[ 30 ][ 0 ] - 5;
			eyeRectLeft.y = positions[ 29 ][ 1 ] - 7;
			eyeRectLeft.w = positions[ 28 ][ 0 ] - positions[ 30 ][ 0 ] + 10;
			eyeRectLeft.h = positions[ 31 ][ 1 ] - positions[ 29 ][ 1 ] + 14;

			FaceRect.x = positions[ 0 ][ 0 ] - 20;
			FaceRect.y = positions[ 20 ][ 1 ] - 30;
			//FaceRect.w = positions[14][0] - positions[0][0] + 10;
			FaceRect.w = FaceRect.h = positions[ 7 ][ 1 ] - positions[ 20 ][ 1 ] + 30;

			let width = 24;
			let height = 24;
			captureContext.drawImage( videoStream.dom, 0, 0, videoStreamWidth, videoStreamHeight );

			LeftEyeContext.drawImage( captureCanvas, eyeRectLeft.x, eyeRectLeft.y, eyeRectLeft.w, eyeRectLeft.h, 0, 0, LeftEyeCanvas.width, LeftEyeCanvas.height );
			let LeftImageData = LeftEyeContext.getImageData( 0, 0, LeftEyeCanvas.width, LeftEyeCanvas.height );
			let LeftImageGray = grayscale( LeftImageData, 0.5 );
			let LeftEyedata = LeftImageGray.data;

			RightEyeContext.drawImage( captureCanvas, eyeRectRight.x, eyeRectRight.y, eyeRectRight.w, eyeRectRight.h, 0, 0, RightEyeCanvas.width, RightEyeCanvas.height );
			let RightImageData = RightEyeContext.getImageData( 0, 0, RightEyeCanvas.width, RightEyeCanvas.height );
			let RightImageGray = grayscale( RightImageData, 0.5 );
			let RightEyedata = RightImageGray.data;

			FaceContext.drawImage( captureCanvas, FaceRect.x, FaceRect.y, FaceRect.w, FaceRect.h, 0, 0, FaceCanvas.width, FaceCanvas.height );
			let FaceImageData = FaceContext.getImageData( 0, 0, FaceCanvas.width, FaceCanvas.height );
			let FaceImageGray = grayscale( FaceImageData, 0 );
			let Facedata = FaceImageGray.data;

			blinkmodelLeft.ready()
			.then( () => {
				let dataTensor = ndarray( new Float32Array( LeftEyedata ), [ width, height, 4 ] )
				let dataProcessedTensor = ndarray( new Float32Array( width * height * 3 ), [ width, height, 3 ] )
				ops.divseq( dataTensor, 255 )
				ops.subseq( dataTensor, 0.5 )
				ops.mulseq( dataTensor, 2 )
				ops.assign( dataProcessedTensor.pick( null, null, 0 ), dataTensor.pick( null, null, 0 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 1 ), dataTensor.pick( null, null, 1 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 2 ), dataTensor.pick( null, null, 2 ) )
				let preprocessedData = dataProcessedTensor.data;
				let inputData = { "input": preprocessedData }
				return blinkmodelLeft.predict( inputData )
			} )
			.then( outputData => {
				if ( outputData.output < 0.2 ) {
					signals.followLeftEye.dispatch( 'close' );
				}
				else {
					signals.followLeftEye.dispatch( 'open' );
				}
			} )
			.catch( err => {
				console.log( err )
			} )

			blinkmodelRight.ready()
			.then( () => {
				let dataTensor = ndarray( new Float32Array( RightEyedata ), [ width, height, 4 ] )
				let dataProcessedTensor = ndarray( new Float32Array( width * height * 3 ), [ width, height, 3 ] )
				ops.divseq( dataTensor, 255 )
				ops.subseq( dataTensor, 0.5 )
				ops.mulseq( dataTensor, 2 )
				ops.assign( dataProcessedTensor.pick( null, null, 0 ), dataTensor.pick( null, null, 0 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 1 ), dataTensor.pick( null, null, 1 ) )
				ops.assign( dataProcessedTensor.pick( null, null, 2 ), dataTensor.pick( null, null, 2 ) )
				let preprocessedData = dataProcessedTensor.data;
				let inputData = { "input": preprocessedData }
				return blinkmodelRight.predict( inputData )
			} )
			.then( outputData => {
				if ( outputData.output < 0.2 ) {
					signals.followRightEye.dispatch( 'close' );
				}
				else {
					signals.followRightEye.dispatch( 'open' );
				}
			} )
			.catch( err => {
				console.log( err )
			} )

			emotionmodel.ready()
			.then( () => {
				let dataTensor = ndarray( new Float32Array( Facedata ), [ FaceCanvas.width, FaceCanvas.height, 4 ] );
				let dataProcessedTensor = ndarray( new Float32Array( FaceCanvas.width * FaceCanvas.height * 1 ), [ FaceCanvas.width, FaceCanvas.height, 1 ] );

				ops.divseq( dataTensor, 255 )
				ops.subseq( dataTensor, 0.5 )
				ops.mulseq( dataTensor, 2 )
				ops.assign( dataProcessedTensor.pick( null, null, 0 ), dataTensor.pick( null, null, 0 ) )
				let preprocessedData = dataProcessedTensor.data
				let inputData = { "input": preprocessedData }
				return emotionmodel.predict( inputData )
			} )
			.then( outputData => {
				let valence_level = {
					'angry': outputData.output[ 0 ],
					'disgusted': outputData.output[ 1 ],
					'fearful': outputData.output[ 2 ],
					'happy': outputData.output[ 3 ],
					'sad': outputData.output[ 4 ],
					'surprised': outputData.output[ 5 ],
					'neutral': outputData.output[ 6 ]
				};

				signals.updateRecommendation.dispatch( valence_level );
			} )
			.catch( err => {
				console.log( err )
			} );
		}
	}

	function GetFaceLandmark () {
		let positions = ctrack.getCurrentPosition();

		if ( positions ) {
			faceLandmarkPosition = positions;

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
