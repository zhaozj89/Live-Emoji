var EMOTION_TYPE = {
	HAPPY: 0,
	SAD: 1,
	ANGRY: 2,
	FEARFUL: 3,
	SURPRISED: 4,
	DISGUSTED: 5,
	NEUTRAL: 6
};

var EYE_STATUS = {
	CLOSE: 0,
	OPEN: 1
};

// standard face status
var FACE_INFORMATION = {
	emotion: EMOTION_TYPE.NEUTRAL,
	x: null,
	y: null,
	angle: null,
	right_eye: EYE_STATUS.OPEN,
	left_eye: EYE_STATUS.OPEN
};