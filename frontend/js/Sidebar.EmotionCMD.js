
Sidebar.EmotionCMD = function ( editor ) {

	var signals = editor.signals;
	var emotionCMDManager = editor.emotionCMDManager;

	var container = new UI.Panel();

	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	container.add( new UI.Text( '' ) );

	container.add( new UI.Break(), new UI.Break() );


	let rowDiv = new UI.Row();

	let keyDiv = new UI.Text( 'Key' );
	keyDiv.setPadding('5px');
	rowDiv.add( keyDiv );

	let semanticDiv = new UI.Text( 'Meaning' );
	semanticDiv.setPadding('5px');
	rowDiv.add( semanticDiv );

	let valenceDiv = new UI.Text( 'Valence' );
	valenceDiv.setPadding('5px');
	rowDiv.add( valenceDiv );

	let arousalDiv = new UI.Text( 'Arousal' );
	arousalDiv.setPadding('5px');
	rowDiv.add( arousalDiv );

	container.add( rowDiv );


	signals.saveEmotionCMD.add( function ( dom ) {
		container.add( dom );
	} );

	return container;

};
