class KeyInput extends NodeInput {
	constructor() {
		super( 'key_input' );

		let that = this;
		let input = document.createElement( 'input' );
		this.domElement.textContent += '';
		this.domElement.appendChild( input );
		$( input ).change( function() {that.arg = input.value;} );
	}
}


class EmotionInput extends NodeInput {
	constructor() {
		super( 'emotion_input' );

		let that = this;
		let selectMenu = new UI.Select();
		selectMenu.setOptions( {
			"Happy" : "happy",
			"Sad" : "sad",
			"Disgusted" : "disgusted",
			"Fearful" : "fearful",
			"Neutral" : "neutral",
			"Surprised" : "surprised",
			"Angry" : "angry"
		} );
		this.domElement.appendChild( selectMenu.dom );
		$( selectMenu.dom ).change( function() { that.arg = selectMenu.getValue(); } );
	}
}

class ConnectionInput extends NodeInput {
	constructor () {
		super( 'connection_input' );
	}
}

class CharacterInput extends NodeInput {
	constructor( obj ) {
		super( 'character_input' );

		this.arg = obj;

		let allObjNames = {};
		let allObjs = {}
		allObjNames[obj.name] = obj.name;
		allObjs[obj.name] = obj;

		for(let i=0; i<obj.children.length; ++i) {
			allObjNames[obj.children[i].name] = obj.children[i].name;
			allObjs[obj.children[i].name] = obj.children[i];
		}

		let that = this;
		let selectMenu = new UI.Select();
		selectMenu.setOptions( allObjNames );

		this.domElement.appendChild( selectMenu.dom );
		$( selectMenu.dom ).change( function() {
			that.arg = allObjs[selectMenu.getValue()];
			console.log( that.arg );
		} );
	}
}