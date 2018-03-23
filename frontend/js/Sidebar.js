/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'sidebar' );
	container.dom.style.zIndex = '4';

	editor.sidebar = container;

	//

	let scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		new Sidebar.Properties( editor )
	);

	let history = new UI.Span().add(
		new Sidebar.History( editor ),
		new Sidebar.Settings( editor )
	);

	let titleMode = new UI.Text( 'Mode' );
	titleMode.addClass( 'h4' );
	titleMode.setTextAlign( 'center' );
	titleMode.setColor( 'whitesmoke' );
	titleMode.setWidth( '300px' );
	titleMode.setBackgroundColor( 'blueviolet' );
	container.add( titleMode );

	// role radio buttons

	let roleSideButtons = new UI.Div();
	roleSideButtons.setMargin( '5px' );
	roleSideButtons.addClass( 'btn-group' );
	roleSideButtons.addClass( 'btn-group-toggle' );
	roleSideButtons.dom.setAttribute( 'data-toggle', 'buttons' );
	container.add( roleSideButtons );

	let studentLabel = new UI.Label();
	studentLabel.addClass( 'btn' );
	studentLabel.addClass( 'btn-secondary' );
	studentLabel.setWidth( '135px' );
	studentLabel.setFontSize( '10' );
	roleSideButtons.add( studentLabel );
	studentLabel.dom.innerHTML = 'Audience';

	let studentInput = new UI.Input( '' );
	studentInput.setPadding( '0px' );
	studentInput.setMargin( '0px' );
	studentInput.dom.setAttribute( 'type', 'radio' );
	studentInput.dom.setAttribute( 'name', 'options' );
	studentInput.dom.setAttribute( 'autocomplete', 'off' );
	studentLabel.add( studentInput );

	let teacherLabel = new UI.Label();
	teacherLabel.addClass( 'btn' );
	teacherLabel.addClass( 'btn-secondary' );
	teacherLabel.setWidth( '135px' );
	teacherLabel.addClass( 'active' );
	roleSideButtons.add( teacherLabel );
	teacherLabel.dom.innerHTML = 'Performer';

	let teacherInput = new UI.Input( '' );
	teacherInput.dom.setAttribute( 'type', 'radio' );
	teacherInput.dom.setAttribute( 'name', 'options' );
	teacherInput.dom.setAttribute( 'autocomplete', 'off' );
	teacherLabel.add( teacherInput );

	editor.studentLabel = studentLabel;
	editor.teacherLabel = teacherLabel;

	// usage radio buttons

	let usageButtons = new UI.Div();
	usageButtons.setMargin( '5px' );
	usageButtons.addClass( 'btn-group' );
	usageButtons.addClass( 'btn-group-toggle' );
	usageButtons.dom.setAttribute( 'data-toggle', 'buttons' );
	container.add( usageButtons );

	let liveAnimationLabel = new UI.Label();
	liveAnimationLabel.addClass( 'btn' );
	liveAnimationLabel.addClass( 'btn-secondary' );
	liveAnimationLabel.setWidth( '135px' );
	usageButtons.add( liveAnimationLabel );
	liveAnimationLabel.dom.innerHTML = 'Live Animation';

	let liveAnimationInput = new UI.Input( '' );
	liveAnimationInput.dom.setAttribute( 'type', 'radio' );
	liveAnimationInput.dom.setAttribute( 'name', 'options' );
	liveAnimationInput.dom.setAttribute( 'autocomplete', 'off' );
	liveAnimationLabel.add( liveAnimationInput );

	let preEditLabel = new UI.Label();
	preEditLabel.addClass( 'btn' );
	preEditLabel.addClass( 'btn-secondary' );
	preEditLabel.setWidth( '135px' );
	preEditLabel.addClass( 'active' );
	usageButtons.add( preEditLabel );
	preEditLabel.dom.innerHTML = 'Command Edit';

	let preEditInput = new UI.Input( '' );
	preEditInput.dom.setAttribute( 'type', 'radio' );
	preEditInput.dom.setAttribute( 'name', 'options' );
	preEditInput.dom.setAttribute( 'autocomplete', 'off' );
	preEditLabel.add( preEditInput );

	// auto trigger radio buttons

	let triggerButtons = new UI.Div();
	triggerButtons.setMargin( '5px' );
	triggerButtons.addClass( 'btn-group' );
	triggerButtons.addClass( 'btn-group-toggle' );
	triggerButtons.dom.setAttribute( 'data-toggle', 'buttons' );
	container.add( triggerButtons );

	let autoLabel = new UI.Label();
	autoLabel.addClass( 'btn' );
	autoLabel.addClass( 'btn-secondary' );
	autoLabel.setWidth( '135px' );
	triggerButtons.add( autoLabel );
	autoLabel.dom.innerHTML = 'Auto Trigger';

	let autoInput = new UI.Input( '' );
	autoInput.dom.setAttribute( 'type', 'radio' );
	autoInput.dom.setAttribute( 'name', 'options' );
	autoInput.dom.setAttribute( 'autocomplete', 'off' );
	autoLabel.add( autoInput );

	let manualLabel = new UI.Label();
	manualLabel.addClass( 'btn' );
	manualLabel.addClass( 'btn-secondary' );
	manualLabel.setWidth( '135px' );
	manualLabel.addClass( 'active' );
	triggerButtons.add( manualLabel );
	manualLabel.dom.innerHTML = 'Manual';

	let manualInput = new UI.Input( '' );
	manualInput.dom.setAttribute( 'type', 'radio' );
	manualInput.dom.setAttribute( 'name', 'options' );
	manualInput.dom.setAttribute( 'autocomplete', 'off' );
	manualLabel.add( manualInput );

	// choose boy or girl

	let characterButtons = new UI.Div();
	characterButtons.setMargin( '5px' );
	characterButtons.addClass( 'btn-group' );
	characterButtons.addClass( 'btn-group-toggle' );
	characterButtons.dom.setAttribute( 'data-toggle', 'buttons' );
	container.add( characterButtons );

	let boyLabel = new UI.Label();
	boyLabel.addClass( 'btn' );
	boyLabel.addClass( 'btn-secondary' );
	boyLabel.addClass( 'active' );
	boyLabel.setWidth( '135px' );
	characterButtons.add( boyLabel );
	boyLabel.dom.innerHTML = 'Boy';

	let boyInput = new UI.Input( '' );
	boyInput.dom.setAttribute( 'type', 'radio' );
	boyInput.dom.setAttribute( 'name', 'options' );
	boyInput.dom.setAttribute( 'autocomplete', 'off' );
	boyLabel.add( boyInput );

	let girlLabel = new UI.Label();
	girlLabel.addClass( 'btn' );
	girlLabel.addClass( 'btn-secondary' );
	girlLabel.setWidth( '135px' );
	characterButtons.add( girlLabel );
	girlLabel.dom.innerHTML = 'Girl';

	let girlInput = new UI.Input( '' );
	girlInput.dom.setAttribute( 'type', 'radio' );
	girlInput.dom.setAttribute( 'name', 'options' );
	girlInput.dom.setAttribute( 'autocomplete', 'off' );
	girlLabel.add( girlInput );

	studentLabel.dom.onclick = function () {
		editor.roleMode = 0;
		UpdateRoleMode( editor );

		studentLabel.setOpacity( '1' );
		teacherLabel.setOpacity( '0.2' );
	}

	teacherLabel.dom.onclick = function () {
		editor.roleMode = 1;
		UpdateRoleMode( editor );

		studentLabel.setOpacity( '0.2' );
		teacherLabel.setOpacity( '1' );
	}

	liveAnimationLabel.dom.onclick = function () {
		editor.usageMode = 0;
		UpdateUsageMode( editor );

		liveAnimationLabel.setOpacity( '1' );
		preEditLabel.setOpacity( '0.2' );
	}

	preEditLabel.dom.onclick = function () {
		editor.usageMode = 1;
		UpdateUsageMode( editor );

		liveAnimationLabel.setOpacity( '0.2' );
		preEditLabel.setOpacity( '1' );
	}

	autoLabel.dom.onclick = function () {
		editor.autoMode = 0;

		autoLabel.setOpacity( '1' );
		manualLabel.setOpacity( '0.2' );
	}

	manualLabel.dom.onclick = function () {
		editor.autoMode = 1;

		autoLabel.setOpacity( '0.2' );
		manualLabel.setOpacity( '1' );
	}

	boyLabel.dom.onclick = function () {
		if( editor.boy===null ) {
			alert( 'Please load the boy character first!' );
			return;
		}

		editor.selected = editor.boy;
		editor.boy.visible = true;

		if( editor.girl!==null )
			editor.girl.visible = false;

		boyLabel.setOpacity( '1' );
		girlLabel.setOpacity( '0.2' );
	}

	girlLabel.dom.onclick = function () {
		if( editor.girl===null ) {
			alert( 'Please load the girl character first!' );
			return;
		}

		editor.selected = editor.girl;
		editor.girl.visible = true;

		if( editor.boy!==null )
			editor.boy.visible = false;

		boyLabel.setOpacity( '0.2' );
		girlLabel.setOpacity( '1' );
	}

	teacherLabel.setOpacity( '1' );
	studentLabel.setOpacity( '0.2' );

	preEditLabel.dom.click();
	manualLabel.dom.click();

	boyLabel.setOpacity( '1' );
	girlLabel.setOpacity( '0.2' );

	//

	let titleEmotionCommand = new UI.Text( 'Emotion Command' );
	titleEmotionCommand.addClass( 'h4' );
	titleEmotionCommand.setTextAlign( 'center' );
	titleEmotionCommand.setColor( 'whitesmoke' );
	titleEmotionCommand.setMarginTop( '15px' );
	titleEmotionCommand.setWidth( '300px' );
	titleEmotionCommand.setBackgroundColor( 'blueviolet' );
	container.add( titleEmotionCommand );

	let emotionCommandView = new Sidebar.EmotionCMD( editor );
	container.add( emotionCommandView );

	return container;

};
