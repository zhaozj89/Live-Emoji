var KeyboardTriggerFunction = function ( event ) {
	var KEYBOARD_TRIGGER = {
		type: 'keyboard',
		keycode: null
	};

	KEYBOARD_TRIGGER.keycode = String.fromCharCode( event.keyCode ).toLowerCase();
	editor.signals.keyboardTriggering.dispatch( KEYBOARD_TRIGGER );
};