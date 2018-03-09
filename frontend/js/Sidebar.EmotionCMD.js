var allUIThreeDOMInfo = {};

class EmotionCMDThreeDOM {
	constructor ( info, nodeString ) {
		this.keyDiv = new UI.Text( info.key );
		this.semanticDiv = new UI.Text( info.semantic );
		this.valenceDiv = new UI.Text( info.valence );
		this.arousalDiv = new UI.Text( info.arousal );
		this.editButton = new UI.Button( 'Edit' );
		this.deleteButton = new UI.Button( 'D' );
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

		this.deleteButton.onClick( function () {
			let key = that.keyDiv.getValue();
			delete editor.emotionCMDManager.allSerializedCMDs[ key ];
			delete editor.emotionCMDManager.allCMDs[ key ];

			that.rowDiv.dom.remove();

			delete allUIThreeDOMInfo[ key ];
		} );

		this.rowDiv = new UI.Div();
		this.rowDiv.setClass( 'EmotionTable' );
		this.rowDiv.add( this.keyDiv, this.semanticDiv, this.valenceDiv, this.arousalDiv, this.editButton, this.deleteButton );

		return this.rowDiv;
	}
}


Sidebar.EmotionCMD = function ( editor ) {

	let signals = editor.signals;
	let emotionCMDManager = editor.emotionCMDManager;

	let container = new UI.Panel();

	container.setBorderTop( '0' );
	container.setPaddingTop( '10px' );

	let newCMD = new UI.Button( 'New CMD' );
	let saveCMD = new UI.Button( 'Save CMD' );
	let cleanSVG = new UI.Button( 'Clean SVG' );
	let importCMD = new UI.Button( 'Import CMDs' );
	let exportCMD = new UI.Button( 'Export CMDs' );

	newCMD.onClick( function () {
		emotionCMDManager.newCMD();
	} );

	saveCMD.onClick( function () {
		emotionCMDManager.save();
	} );

	cleanSVG.onClick( function () {
		emotionCMDManager.cleanSVG();
		emotionCMDManager.newCMD();
	} );

	exportCMD.onClick (function (  ) {
		let text_file = JSON.stringify( emotionCMDManager );

		function download(text, name, type) {
			let a = document.createElement("a");
			let file = new Blob([text], {type: type});
			a.href = URL.createObjectURL(file);
			a.download = name;
			a.click();
		}
		download(text_file, 'test.json', 'text/plain');
	});

	importCMD.onClick(function (  ) {
		let LoadJSONFile = function ( filename ) {

			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					let jsonFile = JSON.parse(this.responseText);

					emotionCMDManager.fromJSON( jsonFile );

					emotionCMDManager.cleanSVG();

					for( let prop in emotionCMDManager.allSerializedCMDs ) {

						let info = emotionCMDManager.allCMDs[prop].getInfo();

						let msg = {
							'info': info,
							'nodeString': emotionCMDManager.allSerializedCMDs[prop]
						};

						signals.saveEmotionCMD.dispatch( msg );
					}
				}
			};

			xhr.open( 'GET', './asset/' + filename, true );
			xhr.send();
		}

		LoadJSONFile( 'test.json' );
	});

	let cmdHelper = new UI.Div();
	cmdHelper.setClass( 'EmotionCMD' );
	cmdHelper.add( newCMD, saveCMD, cleanSVG, importCMD, exportCMD );

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

			allUIThreeDOMInfo[ msg.info.key ].updateInfo( msg.info );
			allUIThreeDOMInfo[ msg.info.key ].updateNodeString( msg.nodeString );
		}
		else {
			allUIThreeDOMInfo[ msg.info.key ].updateInfo( msg.info );
			allUIThreeDOMInfo[ msg.info.key ].updateNodeString( msg.nodeString );
		}
	} );

	return container;

};
