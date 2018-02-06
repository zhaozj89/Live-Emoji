var EMOTION_TYPE = {
  HAPPY : 0,
  SAD : 1,
  ANGRY : 2,
  FEARFUL : 3,
  SURPRISED : 4,
  DISGUSTED : 5,
  NEUTRAL : 6
};

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