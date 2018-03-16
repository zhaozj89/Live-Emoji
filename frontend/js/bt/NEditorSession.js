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
			let parentInput = nodes[ state.A[ i ][ 0 ] ].getAnInputForSerializationOnly();
			nodes[ state.A[ i ][ 1 ] ].connectFrom( parentInput );
			nodes[ state.A[ i ][ 1 ] ].parentInput = parentInput;
		}
	}

	addNode ( type ) {
		let node = null;
		switch ( type ) {
			case 'trigger': {
				node = new TriggerNode( type );
				node.initUI();
				this.triggerNode = node;
				break;
			}

			case 'sequence': {
				node = new CompositeNode( type );
				node.initUI();
				break;
			}

			case 'swap': {
				node = new SwapNode( type, this.editor );
				node.initUI();
				break;
			}

			case 'particle': {
				node = new ParticleNode( type, this.editor );
				node.initUI();
				break;
			}

			case 'danmaku': {
				node = new DanmakuNode( type, this.editor );
				node.initUI();
				break;
			}
		}

		Global_All_DOM_In_SVG.push( node.domElement );

		return node;
	}

	getInfo () {
		let that = this;
		return {
			semantic: that.triggerNode.semanticName.getArg(),
			valence: that.triggerNode.valence.getArg(),
			arousal: that.triggerNode.arousal.getArg(),
			key: that.triggerNode.key.getArg()
		}
	}

	run ( keycode ) {
		let key = this.getInfo().key;

		if ( key === keycode ) {

			let trigger_node_children = this.triggerNode.getChildren();
			for ( let i = 0; i < trigger_node_children.length; ++i ) {

				let composite_node = trigger_node_children[ i ];

				let component = composite_node.component.getArg();
				let composite_node_children = composite_node.getChildren();
				for ( let j = 0; j < composite_node_children.length; ++j ) {

					let action_node = composite_node_children[ j ];

					action_node.run( component );
				}
			}
		}
		return;
	}
}
