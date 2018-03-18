var allUIThreeDOMInfo = {};

class EmotionCMDThreeDOM {
	constructor ( info, nodeString ) {
		this.cell0 = document.createElement('td');
		this.cell1 = document.createElement('td');
		this.cell2 = document.createElement('td');
		this.cell3 = document.createElement('td');
		this.cell4 = document.createElement('td');
		this.cell5 = document.createElement('td');

		this.cell0.setAttribute( 'scope', 'col');
		this.cell1.setAttribute( 'scope', 'col');
		this.cell2.setAttribute( 'scope', 'col');
		this.cell3.setAttribute( 'scope', 'col');
		this.cell4.setAttribute( 'scope', 'col');
		this.cell5.setAttribute( 'scope', 'col');

		this.cell0.style.textAlign = 'center';
		this.cell1.style.textAlign = 'center';
		this.cell2.style.textAlign = 'center';
		this.cell3.style.textAlign = 'center';
		this.cell4.style.textAlign = 'center';
		this.cell5.style.textAlign = 'center';

		this.keyDiv = new UI.Text( info.key );
		this.semanticDiv = new UI.Text( info.semantic );
		this.valenceDiv = new UI.Text( info.valence );
		this.arousalDiv = new UI.Text( info.arousal );
		this.editButton = new UI.Button( 'Edit' );
		this.deleteButton = new UI.Button( 'X' );

		this.cell0.appendChild( this.keyDiv.dom );
		this.cell1.appendChild( this.semanticDiv.dom );
		this.cell2.appendChild( this.valenceDiv.dom );
		this.cell3.appendChild( this.arousalDiv.dom );
		this.cell4.appendChild( this.editButton.dom );
		this.cell5.appendChild( this.deleteButton.dom );

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

			that.row.remove();

			delete allUIThreeDOMInfo[ key ];
		} );

		this.row = document.createElement('tr');
		this.row.appendChild( this.cell0 );
		this.row.appendChild( this.cell1 );
		this.row.appendChild( this.cell2 );
		this.row.appendChild( this.cell3 );
		this.row.appendChild( this.cell4 );
		this.row.appendChild( this.cell5 );

		return this.row;
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
	let cleanSVG = new UI.Button( 'Clean' );
	let importCMD = new UI.Button( 'Import' );
	let exportCMD = new UI.Button( 'Export' );

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

	// let outliner = new UI.Outliner( editor );

	let table = document.createElement("TABLE");
	table.style.class = 'table table-hover table-dark';
	table.style.width = '100%';
	let header = table.createTHead();
	let headerRow = header.insertRow(0);

	let headerCell0 = document.createElement('th');
	let headerCell1 = document.createElement('th');
	let headerCell2 = document.createElement('th');
	let headerCell3 = document.createElement('th');

	headerCell0.setAttribute( 'scope', 'col');
	headerCell1.setAttribute( 'scope', 'col');
	headerCell2.setAttribute( 'scope', 'col');
	headerCell3.setAttribute( 'scope', 'col');

	headerCell0.style.textAlign = 'center';
	headerCell1.style.textAlign = 'center';
	headerCell2.style.textAlign = 'center';
	headerCell3.style.textAlign = 'center';

	headerRow.appendChild(headerCell0);
	headerRow.appendChild(headerCell1);
	headerRow.appendChild(headerCell2);
	headerRow.appendChild(headerCell3);

	let keyDiv = new UI.Text( 'Key' );
	let semanticDiv = new UI.Text( 'Semantic' );
	let valenceDiv = new UI.Text( 'Valence' );
	let arousalDiv = new UI.Text( 'Arousal' );

	headerCell0.appendChild( keyDiv.dom );
	headerCell1.appendChild( semanticDiv.dom );
	headerCell2.appendChild( valenceDiv.dom );
	headerCell3.appendChild( arousalDiv.dom );

	container.dom.appendChild( table );
	// container.add( outliner );

	let body = table.createTBody();

	signals.saveEmotionCMD.add( function ( msg ) {
		if ( allUIThreeDOMInfo[ msg.info.key ] === undefined ) {
			let threeDOM = new EmotionCMDThreeDOM( msg.info, msg.nodeString );
			body.appendChild( threeDOM.createEmotionCMDThreeDOM( editor ) );
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
