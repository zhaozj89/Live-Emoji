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

	return container;

};
