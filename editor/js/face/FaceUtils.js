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
	type : 'face',
	emotion : EMOTION_TYPE.NEUTRAL,
	leftEye : LEFT_EYE_TYPE.OPEN,
	rightEye : RIGHT_EYE_TYPE.OPEN,
	mouth : MOUTH_TYPE.CLOSED
};

var FACE_INFORMATION_PRE = ObjDeepCopy( FACE_INFORMATION );
