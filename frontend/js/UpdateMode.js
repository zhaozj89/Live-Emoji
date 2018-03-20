function UpdateUsageMode ( editor ) {
	if ( editor.usageMode === 0 ) { // live animation
		editor.camera_viewport.setDisplay( '' );

		if( editor.emotion_cmd_tablebody!==null && editor.emotion_cmd_tablebody.rows.length > 3 ) {
			editor.emotion_cmd_tablebody.rows[0].style.backgroundColor = 'chartreuse';
			editor.emotion_cmd_tablebody.rows[1].style.backgroundColor = 'crimson';
			editor.emotion_cmd_tablebody.rows[2].style.backgroundColor = 'aliceblue';
		}
	}

	if ( editor.usageMode === 1 ) { // pre edit
		editor.camera_viewport.setDisplay( 'none' );

		if( editor.emotion_cmd_tablebody!==null && editor.emotion_cmd_tablebody.rows.length > 3 ) {
			editor.emotion_cmd_tablebody.rows[0].style.backgroundColor = 'black';
			editor.emotion_cmd_tablebody.rows[1].style.backgroundColor = 'black';
			editor.emotion_cmd_tablebody.rows[2].style.backgroundColor = 'black';
		}
	}
}

function UpdateRoleMode ( editor ) {
	if ( editor.roleMode === 0 ) { // student
		editor.sidebar.setDisplay( 'none' );
		editor.sidebar_right.setDisplay( 'none' );

		editor.viewport.setLeft('0px');
		editor.viewport.setRight('0px');

		editor.camera_viewport.setLeft('0px');
		editor.camera_viewport.setRight('0px');

		editor.node_editor.setLeft('0px');
		editor.node_editor.setRight('0px');

		editor.background_animation.setLeft('0px');
		editor.background_animation.setRight('0px');

		editor.danmaku_animation.setLeft('0px');
		editor.danmaku_animation.setRight('0px');
	}

	if ( editor.roleMode === 1 ) { // teacher
		editor.sidebar.setDisplay( '' );
		editor.sidebar_right.setDisplay( '' );

		editor.viewport.setLeft('300px');
		editor.viewport.setRight('200px');

		editor.camera_viewport.setLeft('300px');
		editor.camera_viewport.setRight('200px');

		editor.node_editor.setLeft('300px');
		editor.node_editor.setRight('200px');

		editor.background_animation.setLeft('300px');
		editor.background_animation.setRight('200px');

		editor.danmaku_animation.setLeft('300px');
		editor.danmaku_animation.setRight('200px');
	}
}