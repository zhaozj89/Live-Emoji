class NodeSession {
	constructor ( editor ) {
		this.triggerNode = null;

		this.editor = editor;
	}

	toJSON () {

		if ( this.triggerNode === null ) return {};

		let vertices = [];
		let adjacencyMatrix = [];

		let parentIdx = 0;
		let idxCounter = 1;

		vertices.push( this.triggerNode.toJSON() );

		let queue = [];
		queue.push( this.triggerNode );
		while ( queue.length !== 0 ) {
			let node = queue.shift();
			let node_children = node.getChildren();

			for ( let i = 0; i < node_children.length; ++i ) {
				let child_node = node_children[ i ];
				adjacencyMatrix.push( [ parentIdx, idxCounter ] );
				idxCounter++;
				vertices.push( child_node.toJSON() );

				queue.push( child_node );
			}
			parentIdx++;
		}

		return {
			key: this.getInfo().key,
			V: vertices,
			A: adjacencyMatrix
		}
	}

	fromJSON ( state ) {
		if ( state.V.length === 0 ) return;

		let nodes = []; // only used for indexing

		let node = this.addNode( state.V[ 0 ].type );
		this.triggerNode = node;
		node.fromJSON( state.V[ 0 ] );
		nodes.push( node );
		for ( let i = 1; i < state.V.length; ++i ) {
			let node = this.addNode( state.V[ i ].type );
			node.fromJSON( state.V[ i ] );
			nodes.push( node );
		}

		for ( let i = 0; i < state.A.length; ++i ) {
			nodes[ state.A[ i ][ 1 ] ].connectFrom( nodes[ state.A[ i ][ 0 ] ].getInputForSerializationOnly() );
		}
	}

	addNode ( type ) {
		let node = null;
		switch ( type ) {
			case 'trigger': {
				node = new TriggerNode( type );
				node.moveTo( { x: 300, y: 80 } );
				node.initUI();
				this.triggerNode = node;
				break;
			}

			case 'character': {
				node = new CharacterNode( type );
				node.moveTo( { x: 300, y: 80 } );
				node.initUI();
				break;
			}

			case 'texture': {
				node = new TextureNode( type );
				node.moveTo( { x: 300, y: 80 } );
				node.initUI();
				break;
			}

			// case 'text': {
			// 	let node = new TextNode ( type );
			// 	node.moveTo ( { x: 300, y: 80 } );
			// 	node.initUI ();
			// 	this.objectNode = node;
			// 	break;
			// }

			case 'sequence': {
				node = new CompositeNode( type );
				node.moveTo( { x: 300, y: 80 } );
				node.initUI();
				break;
			}

			case 'swap': {
				node = new SwapNode( type );
				node.moveTo( { x: 300, y: 80 } );
				node.initUI();
				break;
			}

			case 'particle': {
				node = new ParticleNode( type, this.editor );
				node.moveTo( { x: 300, y: 80 } );
				node.initUI();
				break;
			}
		}

		Global_All_DOM_In_SVG.push( node.domElement );

		return node;
	}

	getInfo () {
		let args = this.triggerNode.getArgs();
		return {
			semantic: args[ 0 ],
			valence: args[ 1 ],
			arousal: args[ 2 ],
			key: args[ 3 ]
		}
	}

	run ( keycode ) {
		let key = this.getInfo().key;

		if ( key === keycode ) {

			let trigger_node_children = this.triggerNode.getChildren();
			for ( let i = 0; i < trigger_node_children.length; ++i ) {

				let object_node = trigger_node_children[ i ];

				let obj = null;
				if ( object_node[ 'type' ] === 'Character: character' )
					obj = this.editor.characterStructure;
				else if ( object_node[ 'type' ] === 'Texture: texture' ) {
					// obj = backgroundStructure;
					// DO something better
				}
				else {
					alert( 'Error in Behavior Tree!' );
					return;
				}

				let info = object_node.getArg();
				let object_node_children = object_node.getChildren();
				for ( let j = 0; j < object_node_children.length; ++j ) {

					let sequence_node = object_node_children[ j ];
					let sequence_node_children = sequence_node.getChildren();

					for ( let k = 0; k < sequence_node_children.length; ++k ) {
						let action_node = sequence_node_children[ k ];
						action_node.run( obj, info );
					}
				}
			}
		}
		return false;
	}
}
