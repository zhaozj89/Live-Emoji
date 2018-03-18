Menubar.Mode = function ( editor ) {
	var config = editor.config;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Mode' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var selectLiveAnimationMode = new UI.Checkbox( false );
	options.add( selectLiveAnimationMode );

	var selectLiveAnimationModeInfo = new UI.Text( 'Live Animation' );
	selectLiveAnimationModeInfo.setClass( 'option' );
	options.add( selectLiveAnimationModeInfo );

	selectLiveAnimationMode.onChange(function (  ) {
		if( selectLiveAnimationMode.getValue()===true )
			editor.isLiveAnimationMode = true;
		else
			editor.isLiveAnimationMode = false;
	});

	return container;

};
