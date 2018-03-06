
Sidebar.EmotionCMD = function ( editor ) {

	let signals = editor.signals;
	let emotionCMDManager = editor.emotionCMDManager;

	let container = new UI.Panel();

	container.setBorderTop( '0' );
	container.setPaddingTop( '10px' );

	let newCMD = new UI.Button( 'New' );
	let saveCMD = new UI.Button( 'Save' );
	let cleanCMD = new UI.Button( 'Clean' );

	let cmdHelper = new UI.Div();
	cmdHelper.setClass( 'EmotionCMD' );
	cmdHelper.add( newCMD, saveCMD, cleanCMD );

	container.add( cmdHelper );

	let outliner = new UI.Outliner( editor );

	let keyDiv = new UI.Text( 'Key' );
	let semanticDiv = new UI.Text( 'Meaning' );
	let valenceDiv = new UI.Text( 'Valence' );
	let arousalDiv = new UI.Text( 'Arousal' );

	let rowDiv = new UI.Div();
	rowDiv.setClass( 'EmotionHeader' );
	rowDiv.add( keyDiv, semanticDiv, valenceDiv, arousalDiv );

	container.add( outliner );
	outliner.add( rowDiv );

	signals.saveEmotionCMD.add( function ( dom ) {
		outliner.add( dom );
	} );

	return container;

};
