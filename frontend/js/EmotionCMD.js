"use strict";

var Global_Graph_SVG = null;
var Global_NEditor_Container = null;

var Global_All_DOM_In_SVG = [];

class EmotionCMD {
	constructor (key, name, valence, arousal, nodeString) {
		this.key = key;
		this.name = name;
		this.valence = valence;
		this.arousal = arousal;
		this.nodeString = nodeString;
	}

	getDOM () {
		let rowDiv = new UI.Row();

		let keyDiv = new UI.Text( this.key );
		keyDiv.setPadding('5px');
		rowDiv.add( keyDiv );

		let semanticDiv = new UI.Text( this.name );
		semanticDiv.setPadding('5px');
		rowDiv.add( semanticDiv );

		let valenceDiv = new UI.Text( this.valence );
		valenceDiv.setPadding('5px');
		rowDiv.add( valenceDiv );

		let arousalDiv = new UI.Text( this.arousal );
		arousalDiv.setPadding('5px');
		rowDiv.add( arousalDiv );

		let editButton = new UI.Button( 'Edit' );
		editButton.setPadding('5px');
		rowDiv.add(editButton);

		let that = this;
		$( editButton.dom ).click(function (  ) {
			for(let i=0; i<Global_All_DOM_In_SVG.length; ++i) {
				Global_All_DOM_In_SVG[i].remove();
			}
			$(Global_Graph_SVG).empty();

			let nodeSession = new NodeSession();
			nodeSession.fromJSON( JSON.parse( that.nodeString ) );

		});

		return rowDiv;
	}
}

class EmotionCMDManager {
	constructor () {
		this.currentNodeSession = null;
		this.allSerializedCMDs = {};
		this.allCMDs = {};
	}

	newCMD () {
		this.cleanSVG ();

		let nodeSession = new NodeSession();
		this.currentNodeSession = nodeSession;
	}

	cleanSVG () {
		for(let i=0; i<Global_All_DOM_In_SVG.length; ++i) {
			Global_All_DOM_In_SVG[i].remove();
		}
		$(Global_Graph_SVG).empty();
	}

	addNode( type ) {
		this.currentNodeSession.addNode( type );
	}

	save () {
		let info = this.currentNodeSession.getInfo();
		let nodeString = JSON.stringify( this.currentNodeSession );

		if( this.allSerializedCMDs[info.key]!==null ) {
			let emotionCMD = new EmotionCMD( info.key, info.semantic, info.valence, info.arousal, nodeString );

			editor.signals.saveEmotionCMD.dispatch( emotionCMD.getDOM() );

			this.allSerializedCMDs[info.key] = nodeString;
			this.allCMDs[info.key] = this.currentNodeSession;
		}
	}

	toJSON () {
		return this.allSerializedCMDs;
	}

	fromJSON ( state ) {
		this.allSerializedCMDs = state;
		for(let prop in this.allSerializedCMDs ) {
			let currentState = this.allSerializedCMDs[prop];
			let nodeSession = new NodeSession();
			this.allCMDs[currentState.key] = nodeSession.fromJSON( currentState );
		}
	}
}
