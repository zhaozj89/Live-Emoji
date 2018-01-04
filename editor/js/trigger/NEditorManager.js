
class NEditorNodeManager {
	constructor ( svgCanvas, container ) {
		NEDITOR_SVG_CANVAS = svgCanvas;
		this.container = container;

		this.nodes = new Array();
	}

	addNode ( options ) {

		let name = options['name'];
		let isRoot = options['isRoot'];
		let type = options['type'];

		switch ( type ) {
			case NEDITOR_NODE_TYPE.KEYBOARD_TRIGGER: {
				let node = new Node( 'Keyboard', true, null );
				node.addInput( 'Key', NEDITOR_INPUT_TYPE.INPUT );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);

				this.nodes.push( node );
				break;
			}

			case NEDITOR_NODE_TYPE.EMOTION_TRIGGER: {
				let node = new Node( 'Emotion', true, name );
				node.addInput( name, NEDITOR_INPUT_TYPE.CONNECTION );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);

				this.nodes.push( node );
				break;
			}

			default:
				break;
		}
	}

	infer () {
		for(let i=0; i<this.nodes.length; ++i) {
			console.log( this.nodes[i].value );
			console.log('----------------------');
			for(let j=0; j<this.nodes[i].inputs.length; ++j) {
				console.log( this.nodes[i].inputs[j].value );
			}
		}
	}
}
