"use strict";

var Global_Graph_SVG = null;
var Global_NEditor_Container = null;

var Global_All_DOM_In_SVG = [];

class EmotionCMDManager {
	constructor ( editor ) {
		this.currentNodeSession = null;
		this.allSerializedCMDs = {};
		this.allCMDs = {};

		this.editor = editor;
	}

	newCMD () {
		this.cleanSVG();

		let nodeSession = new NodeSession( this.editor );
		this.currentNodeSession = nodeSession;

		this.editor.currentEmitter = null;
	}

	cleanSVG () {
		for ( let i = 0; i < Global_All_DOM_In_SVG.length; ++i ) {
			Global_All_DOM_In_SVG[ i ].remove();
		}
		$( Global_Graph_SVG ).empty();

		this.currentNodeSession = null;
	}

	deleteCMD ( key ) {
		if ( this.currentNodeSession !== null && key === this.currentNodeSession.getInfo().key )
			this.cleanSVG();

		delete this.allSerializedCMDs[ key ];
		delete this.allCMDs[ key ];
	}

	addNode ( type ) {
		this.currentNodeSession.addNode( type );
	}

	save () {
		if ( this.currentNodeSession === null || this.currentNodeSession.triggerNode===null ) {
			return;
		}
		else {
			let info = this.currentNodeSession.getInfo();
			let nodeString = JSON.stringify( this.currentNodeSession );

			let msg = {
				'info': info,
				'nodeString': nodeString
			};

			this.editor.signals.saveEmotionCMD.dispatch( msg );

			this.allSerializedCMDs[ info.key ] = nodeString;
			this.allCMDs[ info.key ] = this.currentNodeSession;
		}
	}

	toJSON () {
		return this.allSerializedCMDs;
	}

	fromJSON ( state ) {
		this.allSerializedCMDs = state;
		for ( let prop in this.allSerializedCMDs ) {
			let currentState = JSON.parse( this.allSerializedCMDs[ prop ] );
			let nodeSession = new NodeSession( this.editor );
			nodeSession.fromJSON( currentState );
			this.allCMDs[ currentState.key ] = nodeSession;
		}
	}
}
