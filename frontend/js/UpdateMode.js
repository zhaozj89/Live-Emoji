function UpdateUsageMode ( editor ) {
	if ( editor.usageMode === 0 ) { // live animation
		editor.camera_viewport.setDisplay( '' );

		if( editor.camera_view_which_side === 'pre_edit' ) {
			editor.node_editor.remove( editor.camera_view );
			editor.camera_viewport.add( editor.camera_view );
			editor.video_stream.play();
			editor.camera_view_which_side = 'live_animation';
		}
	}

	if ( editor.usageMode === 1 ) { // pre edit
		editor.camera_viewport.setDisplay( 'none' );
		if( editor.camera_view_which_side === 'live_animation' ) {
			editor.camera_viewport.remove( editor.camera_view );
			editor.node_editor.add( editor.camera_view );
			editor.video_stream.play();
			editor.camera_view_which_side = 'pre_edit';
		}

		if( editor.emotion_cmd_tablebody!==null && editor.emotion_cmd_tablebody.rows!==null ) {
			let len = editor.emotion_cmd_tablebody.rows.length;
			for( let i=0; i<len; ++i ) {
				editor.emotion_cmd_tablebody.rows[i].style.backgroundColor = 'black';
			}
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

		editor.danmaku_animation.style.left = '0px';
		editor.danmaku_animation.style.right = '0px';
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

		editor.danmaku_animation.style.left = '300px';
		editor.danmaku_animation.style.right = '200px';
	}

	editor.signals.windowResize.dispatch();
}