
// class Queue {
// 	constructor() { this.data = new Array(); }
// 	push( val ) { this.data.push(val); }
// 	pop() { return this.data.shift(); }
// 	top() { return (this.data.length>0 ? this.data[0] : null); }
// }
//
// class Stack {
// 	constructor() { this.data = new Array(); };
// 	push( val ) { this.data.push(val); }
// 	pop() { return this.data.pop(); }
// 	top() { return (this.data.length>0 ? this.data[this.data.length-1] : null); }
// }

class NodeManager {
	constructor ( svgCanvas, container ) {
		NEDITOR_SVG_CANVAS = svgCanvas;
		this.container = container;

		this.tick_triggers = new Array();
		this.key_triggers = new Array();
		this.emotion_triggers = new Array();
		this.AST_Tick = new Object();
		this.AST_Key = new Object();
		this.AST_Emotion = new Object();
	}

	addNode ( type, currentCharacter ) {
		switch ( type ) {
			case 'key_trigger': {
				let node = new KeyTriggerNode( type );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				this.key_triggers.push( node );
				break;
			}

			case 'emotion_trigger': {
				let node = new EmotionTriggerNode( type );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				this.emotion_triggers.push( node );
				break;
			}

			case 'tick_trigger': {
				let node = new TickTriggerNode( type );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				this.tick_triggers.push( node );
				break;
			}

			case 'selector':
			case 'sequence': {
				let node = new CompositeNode( type );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				break;
			}

			case 'translation': {
				let node = new TranslationNode( type );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				break;
			}

			case 'rotation': {
				let node = new RotationNode( type );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				break;
			}

			case 'object': {
				let node = new CharacterNode( type, currentCharacter );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				break;
			}

			default:
				break;
		}
	}

	parseNode( node ) {
		if(node===undefined || node===null) return;

		let args = node.getArgs();

		let res = {
			'type' : node.type,
			'args' : args
		}

		let children = node.getChildren();
		for(let i=0; i<children.length; ++i) {
			if( children[i]!==null ) {
				res['body_' + i] = this.parseNode( children[i] );
			}
		}

		return res;
	}



	getAST_Tick() {
		let that = this;
		let parser = function () {
			for( let i=0; i<that.tick_triggers.length; ++i ) {
				that.AST_Tick['tick_trigger_'+i] = that.parseNode( that.tick_triggers[i] );
			}
			return that.AST_Tick;
		}

		return parser();
	}

	getAST_Key() {
		let that = this;
		let parser = function () {
			for( let i=0; i<that.key_triggers.length; ++i ) {
				that.AST_Key['key_triggers'+i] = that.parseNode( that.key_triggers[i] );
			}
			return that.AST_Key;
		}

		return parser();
	}

	getAST_Emotion() {
		let that = this;
		let parser = function () {
			for( let i=0; i<that.emotion_triggers.length; ++i ) {
				that.AST_Emotion['emotion_triggers'+i] = that.parseNode( that.emotion_triggers[i] );
			}
			return that.AST_Emotion;
		}

		return parser();
	}


	getAST() {
		let a = this.getAST_Tick();
		let b = this.getAST_Key();
		let c = this.getAST_Emotion();

		return [a,b,c];
	}
}
