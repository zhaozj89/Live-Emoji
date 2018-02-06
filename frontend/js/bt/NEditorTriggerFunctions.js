var KeyboardTriggerFunction = function ( event ) {
	var KEYBOARD_TRIGGER = {
		type : 'keyboard',
		keycode : null
	};

	KEYBOARD_TRIGGER.keycode = String.fromCharCode(event.keyCode).toLowerCase();
	editor.signals.trigger.dispatch( KEYBOARD_TRIGGER );

	// console.log( 'KeyboardTriggerFunction works' );
};


var TickTriggerFunction = function ( interval ) {
	let function_handle = setInterval( function() {
		var TICK_TRIGGER = {
			type : 'tick'
		};

		editor.signals.trigger.dispatch( TICK_TRIGGER );
		// console.log( 'TickTriggerFunction works' );
	}, interval );



	return function_handle;
};