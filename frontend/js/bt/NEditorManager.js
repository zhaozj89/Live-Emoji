class NodeManager {
	constructor ( svgCanvas, container, signals ) {
		NEDITOR_SVG_CANVAS = svgCanvas;
		this.container = container;

		this.tick_triggers = new Array ();
		this.key_triggers = new Array ();

		this.signals = signals;
	}

	addNode ( type ) {
		switch ( type ) {
			case 'key_trigger': {
				let node = new KeyTriggerNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				// this.nodes.push( node );
				this.key_triggers.push ( node );
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


			case 'swap': {
				let node = new SwapNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				// this.nodes.push( node );
				break;
			}

			case 'character': {
				let node = new CharacterNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				break;
			}

			case 'texture': {
				let node = new TextureNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				break;
			}

			case 'text': {
				let node = new TextNode ( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				break;
			}

			case 'sleep': {
				let node = new SleepNode( type );
				node.moveTo ( { x: 300, y: 80 } );
				node.initUI ( this.container );
				break;
			}

			default:
				alert( type + ', no such node, need to create one!' );
				break;
		}
	}

	runKeyTrigger ( keycode, updateSignal ) {
		for ( let i = 0; i < this.key_triggers.length; ++i ) {

			let trigger_node = this.key_triggers[ i ];
			let args = trigger_node.getArgs ();
			let bindedKey = new BindedKeyElement( args[0], args[1], args[2], args[3] );
			ALLBINDEDKEYS[ bindedKey.getKey() ] = bindedKey;

			if ( bindedKey.getKey() === keycode ) {

				let trigger_node_children = trigger_node.getChildren ();
				for ( let i = 0; i < trigger_node_children.length; ++i ) {

					let child_0 = trigger_node_children[ i ];

					let obj = null;
					if(child_0['type']==='Character: character')
						obj = characterStructure;
					else if(child_0['type']==='Texture: texture')
						obj = backgroundStructure;
					else {
						alert ( 'Error in Behavior Tree!' );
						return;
					}



					let info = child_0.getArg ();
					let child_0_children = child_0.getChildren ();
					for ( let i0 = 0; i0 < child_0_children.length; ++i0 ) {
						let child_1 = child_0_children[ i0 ];
						switch ( child_1[ 'type' ] ) {
							case 'Composite: sequence': {

								let child_1_children = child_1.getChildren();

								for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
									let child_2 = child_1_children[ i1 ];

									let res = child_2.run( obj, info );

								}

								break;
							}

							default: {
								alert ( 'Error in Behavior Tree!' );
								return;
							}

						}

					}
					//
					// 				let child_2 = child_1_children[ 0 ];
					// 				let pose = {
					// 					x: object.position.x,
					// 					y: object.position.y,
					// 					z: object.position.z,
					// 					angle: object.rotation.z
					// 				};
					//
					// 				let res = child_2.run ( object, pose );
					// 				let pre_action = res['tween'];
					// 				let pre_pose = res['pose'];
					// 				let first_action = pre_action;
					// 				let cur_action = null;
					// 				for ( let i1 = 1; i1 < child_1_children.length; ++i1 ) {
					// 					let child_2 = child_1_children[ i1 ];
					//
					// 					let res = child_2.run ( object, pre_pose );
					// 					pre_pose = res['pose'];
					// 					cur_action = res['tween'];
					//
					// 					pre_action.chain( cur_action );
					// 					pre_action = cur_action;
					// 				}
					//
					// 				first_action.start();
					//
					// 				first_action.onComplete( function (  ) {
					// 					TWEEN.removeAll();
					// 				} );
					// 				return;
					// 			}
					//
					// 			case 'Composite: selector': {
					//
					// 				alert( 'selector is deprecated currently!' );
					//
					// 				// let child_1_children = child_1.getChildren ();
					// 				//
					// 				// let action = null;
					// 				// for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
					// 				// 	let child_2 = child_1_children[ i1 ];
					// 				// 	action = child_2.run ( object );
					// 				// 	if( action!==false ) {
					// 				// 		actions.start();
					// 				// 		return;
					// 				// 	}
					// 				// }
					// 			}
					//
					// 			default: {
					// 				alert ( 'Error in Behavior Tree!' );
					// 				return;
					// 			}
					// 		}
					// 	}
					// }
				}
			}
		}

		return false;
	}



	// runKeyTrigger ( keycode, updateSignal ) {
	// 	for ( let i = 0; i < this.key_triggers.length; ++i ) {
	//
	// 		let trigger_node = this.key_triggers[ i ];
	// 		if ( trigger_node.getArg () === keycode ) {
	//
	// 			let trigger_node_children = trigger_node.getChildren ();
	// 			for ( let i = 0; i < trigger_node_children.length; ++i ) {
	//
	// 				let child_0 = trigger_node_children[ i ];
	// 				if ( child_0[ 'type' ] !== 'Object: object' ) {
	// 					alert ( 'Error in Behavior Tree!' );
	// 					return;
	// 				}
	// 				else {
	//
	//
	// 					let object = child_0.getArg ();
	// 					let child_0_children = child_0.getChildren ();
	// 					for ( let i0 = 0; i0 < child_0_children.length; ++i0 ) {
	//
	// 						let child_1 = child_0_children[ i0 ];
	// 						switch ( child_1[ 'type' ] ) {
	// 							case 'Composite: sequence': {
	//
	// 								let child_1_children = child_1.getChildren ();
	//
	// 								let child_2 = child_1_children[ 0 ];
	// 								let pose = {
	// 									x: object.position.x,
	// 									y: object.position.y,
	// 									z: object.position.z,
	// 									angle: object.rotation.z
	// 								};
	//
	// 								let res = child_2.run ( object, pose );
	// 								let pre_action = res['tween'];
	// 								let pre_pose = res['pose'];
	// 								let first_action = pre_action;
	// 								let cur_action = null;
	// 								for ( let i1 = 1; i1 < child_1_children.length; ++i1 ) {
	// 									let child_2 = child_1_children[ i1 ];
	//
	// 									let res = child_2.run ( object, pre_pose );
	// 									pre_pose = res['pose'];
	// 									cur_action = res['tween'];
	//
	// 									pre_action.chain( cur_action );
	// 									pre_action = cur_action;
	// 								}
	//
	// 								first_action.start();
	//
	// 								first_action.onComplete( function (  ) {
	// 									TWEEN.removeAll();
	// 								} );
	// 								return;
	// 							}
	//
	// 							case 'Composite: selector': {
	//
	// 								alert( 'selector is deprecated currently!' );
	//
	// 								// let child_1_children = child_1.getChildren ();
	// 								//
	// 								// let action = null;
	// 								// for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
	// 								// 	let child_2 = child_1_children[ i1 ];
	// 								// 	action = child_2.run ( object );
	// 								// 	if( action!==false ) {
	// 								// 		actions.start();
	// 								// 		return;
	// 								// 	}
	// 								// }
	// 							}
	//
	// 							default: {
	// 								alert ( 'Error in Behavior Tree!' );
	// 								return;
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	//
	// 	return false;
	// }
	//


	runTickTrigger ( updateSignal ) {
		alert( 'run tick trigger is deprecated currently!' );

		// for ( let i = 0; i < this.tick_triggers.length; ++i ) {
		//
		// 	let trigger_node = this.tick_triggers[ i ];
		// 	let trigger_node_children = trigger_node.getChildren ();
		// 	for ( let i = 0; i < trigger_node_children.length; ++i ) {
		//
		// 		let child_0 = trigger_node_children[ i ];
		// 		if ( child_0[ 'type' ] !== 'Object: object' ) {
		// 			alert ( 'Error in Behavior Tree!' );
		// 			return;
		// 		}
		// 		else {
		//
		// 			let object = child_0.getArg ();
		// 			let child_0_children = child_0.getChildren ();
		// 			for ( let i0 = 0; i0 < child_0_children.length; ++i0 ) {
		//
		// 				let child_1 = child_0_children[ i0 ];
		// 				switch ( child_1[ 'type' ] ) {
		// 					case 'Composite: sequence': {
		//
		// 						let child_1_children = child_1.getChildren ();
		//
		// 						let child_2 = child_1_children[ 0 ];
		// 						let actions = child_2.run ( object );
		//
		// 						for ( let i1 = 1; i1 < child_1_children.length; ++i1 ) {
		// 							let child_2 = child_1_children[ i1 ];
		// 							actions.chain( child_2.run ( object ) );
		// 						}
		//
		// 						actions.start();
		// 						return;
		// 					}
		//
		// 					case 'Composite: selector': {
		//
		// 						let child_1_children = child_1.getChildren ();
		//
		// 						let action = null;
		// 						for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
		// 							let child_2 = child_1_children[ i1 ];
		// 							action = child_2.run ( object );
		// 							if( action!==false ) {
		// 								actions.start();
		// 								return;
		// 							}
		// 						}
		// 					}
		//
		// 					default: {
		// 						alert ( 'Error in Behavior Tree!' );
		// 						return;
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		//
		// return false;
	}
}
