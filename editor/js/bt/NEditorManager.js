
class NodeManager {
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
				let node = new Trigger( 'Keyboard' );
				node.addInput( 'Key', NEDITOR_INPUT_TYPE.INPUT );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);

				this.nodes.push( node );
				break;
			}

			case NEDITOR_NODE_TYPE.EMOTION_TRIGGER: {
				let node = new Trigger( 'Emotion' );
				node.addInput( name, NEDITOR_INPUT_TYPE.CONNECTION );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);

				this.nodes.push( node );
				break;
			}

			case NEDITOR_NODE_TYPE.SELECTOR: {
				let node = new Selector();
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);

				this.nodes.push( node );
				break;
			}

			case NEDITOR_NODE_TYPE.SEQUENCE: {
				let node = new Sequence();
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
		for( let i=0; i<this.nodes.length; ++i ) {
			if( this.nodes[i] instanceof Trigger ) {
				for( let j=0; j<this.nodes[i].inputs.length; ++j ) {
					console.log( this.nodes[i].inputs[j].node.name );
				}
			}
		}
	}
}
