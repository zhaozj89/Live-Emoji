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
		let sidebar = document.getElementById('sidebar_overlay');
		sidebar.style.zIndex = 5;

		let sidebar_right = document.getElementById('sidebar_right_overlay');
		sidebar_right.style.zIndex = 5;
	}

	if ( editor.roleMode === 1 ) { // teacher
		let sidebar = document.getElementById('sidebar_overlay');
		sidebar.style.zIndex = 0;

		let sidebar_right = document.getElementById('sidebar_right_overlay');
		sidebar_right.style.zIndex = 0;
	}

	editor.signals.windowResize.dispatch();
}