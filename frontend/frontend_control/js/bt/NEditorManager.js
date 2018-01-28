class NodeManager {
	constructor ( svgCanvas, container, signals ) {
		NEDITOR_SVG_CANVAS = svgCanvas;
		this.container = container;

		this.tick_triggers = new Array ();
		this.key_triggers = new Array ();
		this.emotion_triggers = new Array ();
		this.AST_Tick = new Object ();
		this.AST_Key = new Object ();
		this.AST_Emotion = new Object ();

		this.signals = signals;
	}

	addNode ( type, currentCharacter ) {
		switch ( type ) {
			case 'key_trigger': {
				let node = new KeyTriggerNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				// this.nodes.push( node );
				this.key_triggers.push ( node );
				break;
			}

			case 'emotion_trigger': {
				let node = new EmotionTriggerNode ( type, this.signals );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				// this.nodes.push( node );
				this.emotion_triggers.push ( node );
				break;
			}

			case 'tick_trigger': {
				let node = new TickTriggerNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				this.tick_triggers.push ( node );
				break;
			}

			case 'selector':
			case 'sequence': {
				let node = new CompositeNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				// this.nodes.push( node );
				break;
			}

			case 'translation': {
				let node = new TranslationNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				// this.nodes.push( node );
				break;
			}

			case 'rotation': {
				let node = new RotationNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				// this.nodes.push( node );
				break;
			}

			case 'object': {
				let node = new CharacterNode ( type, currentCharacter );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				break;
			}

			default:
				break;
		}
	}

	// parseNode( node ) {
	// 	if(node===undefined || node===null) return;
	//
	// 	let args = node.getArgs();
	//
	// 	let res = {
	// 		'type' : node.type,
	// 		'args' : args,
	// 		'children' : []
	// 	};
	//
	// 	let children = node.getChildren();
	// 	for(let i=0; i<children.length; ++i) {
	// 		if( children[i]!==null ) {
	// 			res['children'].push( this.parseNode( children[i] ) );
	// 		}
	// 	}
	//
	// 	return res;
	// }

	// getAST_Tick() {
	// 	let that = this;
	// 	let parser = function () {
	// 		for( let i=0; i<that.tick_triggers.length; ++i ) {
	// 			that.AST_Tick['tick_trigger_'+i] = that.parseNode( that.tick_triggers[i] );
	// 		}
	// 		return that.AST_Tick;
	// 	}
	//
	// 	return parser();
	// }

	// getAST_Key() {
	// 	let that = this;
	// 	let parser = function () {
	// 		for( let i=0; i<that.key_triggers.length; ++i ) {
	// 			that.AST_Key['key_triggers'+i] = that.parseNode( that.key_triggers[i] );
	// 		}
	// 		return that.AST_Key;
	// 	}
	//
	// 	return parser();
	// }

	// getAST_Emotion() {
	// 	let that = this;
	// 	let parser = function () {
	// 		for( let i=0; i<that.emotion_triggers.length; ++i ) {
	// 			that.AST_Emotion['emotion_triggers'+i] = that.parseNode( that.emotion_triggers[i] );
	// 		}
	// 		return that.AST_Emotion;
	// 	}
	//
	// 	return parser();
	// }
	//
	//
	// getAST() {
	// 	let a = this.getAST_Tick();
	// 	let b = this.getAST_Key();
	// 	let c = this.getAST_Emotion();
	//
	// 	return {
	// 		'tick_triggers': a,
	// 		'key_triggers': b
	// 	};
	// }


	runKeyTrigger ( keycode ) {
		for ( let i = 0; i < this.key_triggers.length; ++i ) {

			let trigger_node = this.key_triggers[ i ];
			if ( trigger_node.getArg () === keycode ) {

				let trigger_node_children = trigger_node.getChildren ();
				for ( let i = 0; i < trigger_node_children.length; ++i ) {

					let child_0 = trigger_node_children[ i ];
					if ( child_0[ 'type' ] !== 'object' ) {
						alert ( 'Error in Behavior Tree!' );
						return;
					}
					else {

						let object = child_0.getArgs ();
						let child_0_children = child_0.getChildren ();
						for ( let i0 = 0; i0 < child_0_children.length; ++i0 ) {

							let child_1 = child_0_children[ i0 ];
							switch ( child_1[ 'type' ] ) {
								case 'sequence': {

									let child_1_children = child_1.getChildren ();
									for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
										let child_2 = child_1_children[ i1 ];
										child_2.run ( object );
									}
								}

								case 'selector': {

									let child_1_children = child_1.getChildren ();
									for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
										let child_2 = child_1_children[ i1 ];
										if ( child_2.run ( object ) === true ) return;
									}
								}

								default: {
									alert ( 'Error in Behavior Tree!' );
									return;
								}
							}
						}
					}
				}
			}
		}

		return false;
	}
}
