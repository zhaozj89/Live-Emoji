"use strict";

var NEDITOR_MOUSE_INFO = {
	currentInput: undefined
};

var NEDITOR_SVG_CANVAS = null;

var NODE_TYPE = {
	TRIGGER : 0,
	COMPOSITE : 1,
	ACTION : 2
};

var INPUT_TYPE = {
	CONNECTION : 0,
	INPUT_KEY : 1,
	SELECT_EMOTION : 2
};

// var NEDITOR_RETURN_TYPE = {
// 	SUCCESS : 0,
// 	FAILURE : 1
// };

var KEYBOARD_TRIGGER = {
	type : 'keyboard',
	keycode : null
};

var FACE_TRIGGER = {
	type : 'face',
	faceinfo : null
};


