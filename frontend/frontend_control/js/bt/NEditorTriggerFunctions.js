var KeyboardTriggerFunction = function ( event ) {
	KEYBOARD_TRIGGER.KEYCODE = event.keyCode;
	editor.signals.trigger.dispatch( KEYBOARD_TRIGGER );

	// console.log( 'KeyboardTriggerFunction works' );
};


var TickTriggerFunction = function ( interval ) {
	let function_handle = setInterval( function() {
		editor.signals.trigger.dispatch( TICK_TRIGGER );
		// console.log( 'TickTriggerFunction works' );
	}, interval );



	return function_handle;
};