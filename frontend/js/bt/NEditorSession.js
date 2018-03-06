class NodeSession {
	constructor () {
		this.triggerNode = null;
		this.objectNode = null;
		this.sequenceNode = null;
		this.actionNode = null;
	}

	toJSON () {
		return {
			key: this.getInfo().key,
			triggerNode: this.triggerNode.toJSON(),
			objectNode: this.objectNode.toJSON(),
			sequenceNode: this.sequenceNode.toJSON(),
			actionNode: this.actionNode.toJSON()
		}
	}

	fromJSON ( state ) {
		this.addNode( 'trigger' );
		this.addNode( state.objectNode.type );
		this.addNode( 'sequence' );
		this.addNode( state.actionNode.type );

		this.triggerNode.fromJSON( state.triggerNode );
		this.objectNode.fromJSON( state.objectNode );
		this.sequenceNode.fromJSON( state.sequenceNode );
		this.actionNode.fromJSON( state.actionNode );

		this.objectNode.connectFrom( this.triggerNode.key );
		this.sequenceNode.connectFrom( this.objectNode.input );
		this.actionNode.connectFrom( this.sequenceNode.input );
	}

	addNode ( type ) {
		let node = null;
		switch ( type ) {
			case 'trigger': {
				node = new TriggerNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.triggerNode = node;
				break;
			}

			case 'character': {
				node = new CharacterNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.objectNode = node;
				break;
			}

			case 'texture': {
				node = new TextureNode ( type );
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
				node = new CompositeNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.sequenceNode = node;
				break;
			}

			case 'swap': {
				node = new SwapNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.actionNode = node;
				break;
			}

			case 'particle': {
				node = new ParticleNode( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ();
				this.actionNode = node;
				break;
			}
		}

		Global_All_DOM_In_SVG.push( node.domElement );
	}

	getInfo () {
		let args = this.triggerNode.getArgs ();
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

			let trigger_node_children = this.triggerNode.getChildren ();
			for ( let i = 0; i < trigger_node_children.length; ++i ) {

				let object_node = trigger_node_children[ i ];

				let obj = null;
				if(object_node['type']==='Character: character')
					obj = characterStructure;
				else if(object_node['type']==='Texture: texture') {
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
