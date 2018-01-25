var EMOTION_TYPE = {
  HAPPY : 0,
  SAD : 1,
  ANGRY : 2,
  FEARFUL : 3,
  SURPRISED : 4,
  DISGUSTED : 5,
  NEUTRAL : 6
};

var LEFT_EYE_TYPE = {
  OPEN : 0,
  CLOSED : 1
};

var RIGHT_EYE_TYPE = {
  OPEN : 0,
  CLOSED : 1
};

var MOUTH_TYPE = {
  OPEN : 0,
  CLOSED : 1
}

// standard face status
var FACE_INFORMATION = {
	emotion : EMOTION_TYPE.NEUTRAL,
	x: null,
	y: null,
	angle: null
	// leftEye : LEFT_EYE_TYPE.OPEN,
	// rightEye : RIGHT_EYE_TYPE.OPEN,
	// mouth : MOUTH_TYPE.CLOSED
};

var FACE_INFORMATION_PRE = ObjDeepCopy( FACE_INFORMATION );


// helper functions

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000/60);
		};
})();

/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
window.cancelRequestAnimFrame = (function() {
	return window.cancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		window.clearTimeout;
})();
