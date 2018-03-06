class NodeSession {
	constructor () {
		this.triggerNode = null;
		this.objectNode = null;
		this.sequenceNode = null;
		this.actionNode = null;
	}

	toJSON () {
		return {
			triggerNode: this.triggerNode.toJSON(),
			objectNode: this.objectNode.toJSON(),
			sequenceNode: this.sequenceNode.toJSON(),
			actionNode: this.actionNode.toJSON()
		}
	}

	fromJSON ( state ) {

		let node0 = new TriggerNode( 'trigger' );
		node0.fromJSON( state.triggerNode );
		node0.moveTo ( { x: 300, y: 80 } );
		node0.initUI ();

		let node1 = null;
		switch (state.objectNode.type) {
			case 'character': {
				node1 = new CharacterNode( 'character' );
				node1.fromJSON( state.objectNode );
				node1.moveTo ( { x: 300, y: 80 } );
				node1.initUI ();
				break;
			}

			case 'texture': {
				node1 = new TextureNode ( 'texture' );
				node1.fromJSON( state.objectNode );
				node1.moveTo ( { x: 300, y: 80 } );
				node1.initUI ();
				break;
			}
		}

		let node2 = new CompositeNode( 'sequence' );
		node2.fromJSON( state.sequenceNode );
		node2.moveTo ( { x: 300, y: 80 } );
		node2.initUI ();

		let node3 = null;
		switch (state.actionNode.type) {
			case 'swap': {
				node3 = new SwapNode( 'swap' );
				node3.fromJSON( state.actionNode );
				node3.moveTo ( { x: 300, y: 80 } );
				node3.initUI ();
				break;
			}
			case 'particle': {
				node3 = new ParticleNode( 'particle' );
				node3.fromJSON( state.actionNode );
				node3.moveTo ( { x: 300, y: 80 } );
				node3.initUI ();
				break;
			}
		}

		node1.connectFrom( node0.key );
		node2.connectFrom( node1.input );
		node3.connectFrom( node2.input );
	}

	addNode ( type ) {
		switch ( type ) {
			case 'trigger': {
				let node = new TriggerNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.triggerNode = node;
				break;
			}

			case 'character': {
				let node = new CharacterNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.objectNode = node;
				break;
			}

			case 'texture': {
				let node = new TextureNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.objectNode = node;
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
				let node = new CompositeNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.sequenceNode = node;
				break;
			}

			case 'swap': {
				let node = new SwapNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.actionNode = node;
				break;
			}

			case 'particle': {
				let node = new ParticleNode( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.actionNode = node;
				break;
			}
		}
	}

	getInfo () {
		let args = this.trigger.getArgs ();
		return {
			semantic: args[0],
			valence: args[1],
			arousal: args[2],
			key: args[3]
		}
	}

	run ( keycode ) {
		let key = this.getInfo ().key;

		if ( key === keycode ) {

			let trigger_node_children = this.trigger.getChildren ();
			for ( let i = 0; i < trigger_node_children.length; ++i ) {

				let object_node = trigger_node_children[ i ];

				let obj = null;
				if(object_node['type']==='Character: character')
					obj = characterStructure;
				else if(child_0['type']==='Texture: texture') {
					// obj = backgroundStructure;
					// DO something better
				}
				else {
					alert ( 'Error in Behavior Tree!' );
					return;
				}

				let info = object_node.getArg ();
				let object_node_children = object_node.getChildren ();
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
