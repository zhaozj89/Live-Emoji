class NodeManager {
	constructor ( svgCanvas, container, signals ) {
		NEDITOR_SVG_CANVAS = svgCanvas;
		this.container = container;

		this.tick_triggers = new Array ();
		this.key_triggers = new Array ();

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
			if ( trigger_node.getArg () === keycode ) {

				let trigger_node_children = trigger_node.getChildren ();
				for ( let i = 0; i < trigger_node_children.length; ++i ) {

					let child_0 = trigger_node_children[ i ];
					if ( child_0[ 'type' ] !== 'object' ) {
						alert ( 'Error in Behavior Tree!' );
						return;
					}
					else {

						let object = child_0.getArg ();
						let child_0_children = child_0.getChildren ();
						for ( let i0 = 0; i0 < child_0_children.length; ++i0 ) {

							let child_1 = child_0_children[ i0 ];
							switch ( child_1[ 'type' ] ) {
								case 'sequence': {

									let child_1_children = child_1.getChildren ();
									for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
										let child_2 = child_1_children[ i1 ];
										child_2.run ( object );

										updateSignal.dispatch();
									}

									return;
								}

								case 'selector': {

									let child_1_children = child_1.getChildren ();
									for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
										let child_2 = child_1_children[ i1 ];
										if ( child_2.run ( object ) === true ) {
											updateSignal.dispatch();
											return;
										}
									}

									return;
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



	runTickTrigger ( updateSignal ) {
		for ( let i = 0; i < this.tick_triggers.length; ++i ) {

			let trigger_node = this.tick_triggers[ i ];
			let trigger_node_children = trigger_node.getChildren ();
			for ( let i = 0; i < trigger_node_children.length; ++i ) {

				let child_0 = trigger_node_children[ i ];
				if ( child_0[ 'type' ] !== 'object' ) {
					alert ( 'Error in Behavior Tree!' );
					return;
				}
				else {

					let object = child_0.getArg ();
					let child_0_children = child_0.getChildren ();
					for ( let i0 = 0; i0 < child_0_children.length; ++i0 ) {

						let child_1 = child_0_children[ i0 ];
						switch ( child_1[ 'type' ] ) {
							case 'sequence': {

								let child_1_children = child_1.getChildren ();
								for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
									let child_2 = child_1_children[ i1 ];
									child_2.run ( object );

									updateSignal.dispatch();
								}

								return;
							}

							case 'selector': {

								let child_1_children = child_1.getChildren ();
								for ( let i1 = 0; i1 < child_1_children.length; ++i1 ) {
									let child_2 = child_1_children[ i1 ];
									if ( child_2.run ( object ) === true ) {
										updateSignal.dispatch();
										return;
									}
								}

								return;
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

		return false;
	}
}
