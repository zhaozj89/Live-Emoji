"use strict";

let NEDITOR_MOUSE_INFO = {
	currentInput: undefined
};

let NEDITOR_SVG_CANVAS = null;

let NODE_TYPE = {
	TRIGGER : 0,
	COMPOSITE : 1,
	ACTION : 2
};

let INPUT_TYPE = {
	CONNECTION : 0,
	INPUT_KEY : 1,
	SELECT_EMOTION : 2
};

let NEDITOR_RETURN_TYPE = {
	SUCCESS : 0,
	FAILURE : 1
};

let KEYBOARD_TRIGGER = {
	type : 'keyboard',
	KEYCODE : null
};

let MOUSE_TRIGGER = {
	type : 'mouse',
	MOUSECODE : null
};
