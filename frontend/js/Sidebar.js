/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.dom.style.zIndex = '4';

	//

	// var sceneTab = new UI.Text( 'Scene' ).onClick( onClick );
	// var cameraTab = new UI.Text( 'Camera' ).onClick( onClick );
	// var historyTab = new UI.Text( 'History' ).onClick( onClick );
	// var emotionTab = new UI.Text( 'Emotion' ).onClick( onClick );

	// var tabs = new UI.Div();
	// tabs.setId( 'tabs' );
	// tabs.add( cameraTab, historyTab, sceneTab, emotionTab );
	// tabs.add( emotionTab );
	// container.add( tabs );

	// function onClick( event ) {
	//
	// 	select( event.target.textContent );
	//
	// }

	//
	//
	var scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		new Sidebar.Properties( editor )
	);
	// container.add( scene );

	var camera = new UI.Span().add(
		new Sidebar.Camera( editor )
	);
	// container.add( camera );

	var history = new UI.Span().add(
		new Sidebar.History( editor ),
		new Sidebar.Settings( editor )
	);
	// container.add( history );

	let titleMode = new UI.Text( 'Mode Selection Panel' );
	titleMode.setColor( 'whitesmoke' );
	titleMode.setMarginTop( '15px' );
	titleMode.setWidth( '300px' );
	titleMode.setBackgroundColor( 'blueviolet' );
	container.add( titleMode );

	let roleSideButtons = new UI.Div();
	roleSideButtons.setMargin( '5px' );
	roleSideButtons.addClass( 'btn-group' );
	roleSideButtons.addClass('btn-group-toggle');
	roleSideButtons.dom.setAttribute( 'data-toggle', 'buttons' );
	container.add(roleSideButtons);

	let studentLabel = new UI.Label();
	studentLabel.addClass('btn');
	studentLabel.addClass('btn-secondary');
	studentLabel.addClass('active');
	studentLabel.setFontSize( '10' );
	roleSideButtons.add(studentLabel);
	studentLabel.dom.innerHTML = 'Student';

	let studentInput = new UI.Input( '' );
	studentInput.setPadding('0px');
	studentInput.setMargin('0px');
	studentInput.dom.setAttribute( 'type', 'radio' );
	studentInput.dom.setAttribute( 'name', 'options' );
	studentInput.dom.setAttribute( 'autocomplete', 'off' );
	studentInput.dom.checked = true;
	studentLabel.add(studentInput);

	let teacherLabel = new UI.Label();
	teacherLabel.addClass('btn');
	teacherLabel.addClass('btn-secondary');
	roleSideButtons.add(teacherLabel);
	teacherLabel.dom.innerHTML = 'Teacher';

	let teacherInput = new UI.Input( '' );
	teacherInput.dom.setAttribute( 'type', 'radio' );
	teacherInput.dom.setAttribute( 'name', 'options' );
	teacherInput.dom.setAttribute( 'autocomplete', 'off' );
	teacherLabel.add(teacherInput);


	let usageButtons = new UI.Div();
	usageButtons.setMargin( '5px' );
	usageButtons.addClass( 'btn-group' );
	usageButtons.addClass('btn-group-toggle');
	usageButtons.dom.setAttribute( 'data-toggle', 'buttons' );
	container.add(usageButtons);

	let liveAnimationLabel = new UI.Label();
	liveAnimationLabel.addClass('btn');
	liveAnimationLabel.addClass('btn-secondary');
	liveAnimationLabel.addClass('active');
	liveAnimationLabel.setFontSize( '10' );
	usageButtons.add(liveAnimationLabel);
	liveAnimationLabel.dom.innerHTML = 'Live Animation';

	let liveAnimationInput = new UI.Input( '' );
	liveAnimationInput.dom.setAttribute( 'type', 'radio' );
	liveAnimationInput.dom.setAttribute( 'name', 'options' );
	liveAnimationInput.dom.setAttribute( 'autocomplete', 'off' );
	liveAnimationInput.dom.checked = true;
	liveAnimationLabel.add(liveAnimationInput);

	let preEditLabel = new UI.Label();
	preEditLabel.addClass('btn');
	preEditLabel.addClass('btn-secondary');
	usageButtons.add(preEditLabel);
	preEditLabel.dom.innerHTML = 'Command Edit';

	let preEditInput = new UI.Input( '' );
	preEditInput.dom.setAttribute( 'type', 'radio' );
	preEditInput.dom.setAttribute( 'name', 'options' );
	preEditInput.dom.setAttribute( 'autocomplete', 'off' );
	preEditLabel.add(preEditInput);


	let titleEmotionCommand = new UI.Text( 'Emotion Command Panel' );
	titleEmotionCommand.setColor( 'whitesmoke' );
	titleEmotionCommand.setMarginTop( '15px' );
	titleEmotionCommand.setWidth( '300px' );
	titleEmotionCommand.setBackgroundColor( 'blueviolet' );
	container.add( titleEmotionCommand );

	let emotionCommandView = new Sidebar.EmotionCMD( editor );
	// emotionCommandView.setTop( '100px' );
	container.add( emotionCommandView );
	editor.emotion_command_view = emotionCommandView;

	//

	// function select( section ) {
	//
	// 	sceneTab.setClass( '' );
	// 	cameraTab.setClass( '' );
	// 	historyTab.setClass( '' );
	// 	emotionTab.setClass( '' );
	//
	// 	scene.setDisplay( 'none' );
	// 	camera.setDisplay( 'none' );
	// 	history.setDisplay( 'none' );
	// 	emotion.setDisplay( 'none' );
	//
	// 	switch ( section ) {
	// 		case 'Scene':
	// 			sceneTab.setClass( 'selected' );
	// 			scene.setDisplay( '' );
	// 			break;
	// 		case 'Camera':
	// 			cameraTab.setClass( 'selected' );
	// 			camera.setDisplay( '' );
	// 			break;
	// 		case 'History':
	// 			historyTab.setClass( 'selected' );
	// 			history.setDisplay( '' );
	// 			break;
	// 		case 'Emotion':
	// 			emotionTab.setClass( 'selected' );
	// 			emotion.setDisplay( '' );
	// 			break;
	// 	}
	//
	// }

	// select( 'Emotion' );

	return container;

};
