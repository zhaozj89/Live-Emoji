
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

		// this.nodes = new Array();
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

	parser () {
		for( let i=0; i<this.triggers.length; ++i ) {
			this.AST['trigger_'+i] = this.parseNode( this.triggers[i] );
		}
		return this.AST;
	}

/*
	generator( node ) {
		let res = '';
		if( node['type']==='keyboard' ) {
			res +=
			`
				function keydown ( event ) {
					var x = event.keyCode || event.which;
					var y = String.fromCharCode(x);
					if(y===${node['args']}.toUpperCase()) {

			`;

			for(let body in node) {
				if(body.slice(0, 4)==='body') {
					res += this.generator( node[body] );
				}
			}

			res +=
			`
					return 0;
				}
			`;
		}

		if( node['type'] === 'selector' ) {
			res +=
			`
				for( let i=0; i<${Object.keys(node).length}; ++i ) {

			`;

			for(let body in node) {
				if(body.slice(0, 4)==='body') {
					res += this.generator( node[body] );
				}
			}

			res +=
			`
					return 0;
				}
			`;
		}

		if( node['type'] === 'translation' ) {
			res +=
			`
				excute this node;
				return 0;
			`;
		}

		return res;
	}
*/

	getAST() {
		return this.parser();
		// for( let trigger in ast ) {
		// 	let code = this.generator( ast[trigger] );
		// 	console.log( code );
		// }
		// console.log( ast );
	}
}
