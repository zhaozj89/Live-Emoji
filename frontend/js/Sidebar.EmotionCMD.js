class EmotionCMDThreeDOM {
	constructor ( info, nodeString ) {
		this.keyDiv = new UI.Text( info.key );
		this.semanticDiv = new UI.Text( info.semantic );
		this.valenceDiv = new UI.Text( info.valence );
		this.arousalDiv = new UI.Text( info.arousal );
		this.editButton = new UI.Button( 'Edit' );
		this.nodeString = nodeString;
	}

	updateInfo ( info ) {
		this.keyDiv.setValue( info.key );
		this.semanticDiv.setValue( info.semantic );
		this.valenceDiv.setValue( info.valence );
		this.arousalDiv.setValue( info.arousal );
	}

	updateNodeString ( nodeString ) {
		this.nodeString = nodeString;
	}

	createEmotionCMDThreeDOM ( editor ) {

		this.editButton.setClass( 'EmotionTableEditor' );

		let that = this;
		this.editButton.onClick( function () {
			for ( let i = 0; i < Global_All_DOM_In_SVG.length; ++i ) {
				Global_All_DOM_In_SVG[ i ].remove();
			}
			$( Global_Graph_SVG ).empty();

			let nodeSession = new NodeSession( editor );
			nodeSession.fromJSON( JSON.parse( that.nodeString ) );
			editor.emotionCMDManager.currentNodeSession = nodeSession;
		} );

		let rowDiv = new UI.Div();
		rowDiv.setClass( 'EmotionTable' );
		rowDiv.add( this.keyDiv, this.semanticDiv, this.valenceDiv, this.arousalDiv, this.editButton );

		return rowDiv;
	}
}


Sidebar.EmotionCMD = function ( editor ) {

	let signals = editor.signals;
	let emotionCMDManager = editor.emotionCMDManager;

	let container = new UI.Panel();

	container.setBorderTop( '0' );
	container.setPaddingTop( '10px' );

	let newCMD = new UI.Button( 'New' );
	let saveCMD = new UI.Button( 'Save' );
	let cleanCMD = new UI.Button( 'Clean' );
	let stopCMD = new UI.Button( 'Stop' );

	let allUIThreeDOMInfo = {};

	newCMD.onClick( function () {
		emotionCMDManager.newCMD();

		let msg = {
			sourceStrokes: null,
			travelStrokes: null,
			textureName: null
		};
	} );

	saveCMD.onClick( function () {
		emotionCMDManager.save();
	} );

	cleanCMD.onClick( function () {
		emotionCMDManager.cleanSVG();
		emotionCMDManager.newCMD();
	} );

	stopCMD.onClick(function (  ) {
		let msg = {
			sourceStrokes: null,
			travelStrokes: null,
			textureName: null
		};
	});

	let cmdHelper = new UI.Div();
	cmdHelper.setClass( 'EmotionCMD' );
	cmdHelper.add( newCMD, saveCMD, cleanCMD, stopCMD );

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

	signals.saveEmotionCMD.add( function ( msg ) {
		if ( allUIThreeDOMInfo[ msg.info.key ] === undefined ) {
			let threeDOM = new EmotionCMDThreeDOM( msg.info, msg.nodeString );
			outliner.add( threeDOM.createEmotionCMDThreeDOM( editor ) );
			allUIThreeDOMInfo[ msg.info.key ] = threeDOM;
		}
		else {
			allUIThreeDOMInfo[ msg.info.key ].updateInfo( msg.info );
			allUIThreeDOMInfo[ msg.info.key ].updateNodeString( msg.nodeString );
		}
	} );

	return container;

};
