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

		switch (state.objectNode.type) {
			case 'character': {
				let node = new CharacterNode( 'character' );
				node.fromJSON( state.objectNode );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				break;
			}

			case 'texture': {
				let node = new TextureNode ( 'texture' );
				node.fromJSON( state.objectNode );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				break;
			}
		}

		let node1 = new CompositeNode( 'sequence' );
		node1.fromJSON( state.sequenceNode );
		node1.moveTo ( { x: 300, y: 80 } );
		node1.initUI ();

		switch (state.actionNode.type) {
			case 'swap': {
				let node = new SwapNode( 'swap' );
				node.fromJSON( state.actionNode );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				break;
			}
			case 'particle': {
				let node = new ParticleNode( 'particle' );
				node.fromJSON( state.actionNode );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				break;
			}
		}
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
