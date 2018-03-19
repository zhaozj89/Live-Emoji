/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.dom.style.zIndex = '4';

	//

	var scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		new Sidebar.Properties( editor )
	);

	var camera = new UI.Span().add(
		new Sidebar.Camera( editor )
	);

	var history = new UI.Span().add(
		new Sidebar.History( editor ),
		new Sidebar.Settings( editor )
	);

	let titleMode = new UI.Text( 'Mode' );
	titleMode.addClass( 'h4' );
	titleMode.setTextAlign('center');
	titleMode.setColor( 'whitesmoke' );
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

	//

	let triggerButtons = new UI.Div();
	triggerButtons.setMargin( '5px' );
	triggerButtons.addClass( 'btn-group' );
	triggerButtons.addClass('btn-group-toggle');
	triggerButtons.dom.setAttribute( 'data-toggle', 'buttons' );
	container.add(triggerButtons);

	let autoLabel = new UI.Label();
	autoLabel.addClass('btn');
	autoLabel.addClass('btn-secondary');
	autoLabel.addClass('active');
	autoLabel.setFontSize( '10' );
	triggerButtons.add(autoLabel);
	autoLabel.dom.innerHTML = 'Auto Trigger';

	let autoInput = new UI.Input( '' );
	autoInput.dom.setAttribute( 'type', 'radio' );
	autoInput.dom.setAttribute( 'name', 'options' );
	autoInput.dom.setAttribute( 'autocomplete', 'off' );
	autoInput.dom.checked = true;
	autoLabel.add(autoInput);

	let manualLabel = new UI.Label();
	manualLabel.addClass('btn');
	manualLabel.addClass('btn-secondary');
	triggerButtons.add(manualLabel);
	manualLabel.dom.innerHTML = 'Manual';

	let manualInput = new UI.Input( '' );
	manualInput.dom.setAttribute( 'type', 'radio' );
	manualInput.dom.setAttribute( 'name', 'options' );
	manualInput.dom.setAttribute( 'autocomplete', 'off' );
	manualLabel.add(manualInput);


	let titleEmotionCommand = new UI.Text( 'Emotion Command' );
	titleEmotionCommand.addClass( 'h4' );
	titleEmotionCommand.setTextAlign('center');
	titleEmotionCommand.setColor( 'whitesmoke' );
	titleEmotionCommand.setMarginTop( '15px' );
	titleEmotionCommand.setWidth( '300px' );
	titleEmotionCommand.setBackgroundColor( 'blueviolet' );
	container.add( titleEmotionCommand );

	let emotionCommandView = new Sidebar.EmotionCMD( editor );
	container.add( emotionCommandView );
	editor.emotion_command_view = emotionCommandView;

	return container;

};
