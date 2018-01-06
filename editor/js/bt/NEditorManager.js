
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
		this.triggers = new Array();
		this.AST = new Object();

		this.counter = 0;
	}

	addNode ( options ) {

		let type = options['type'];
		let value = options['value'];

		switch ( type ) {
			case NODE_TYPE.TRIGGER: {
				let node = new Trigger( value );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				this.triggers.push( node );
				break;
			}

			case NODE_TYPE.COMPOSITE: {
				let node = new Composite( value );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				break;
			}

			case NODE_TYPE.ACTION: {
				let node = new Action( value );
				node.moveTo({x: 300, y: 80});
				node.initUI(this.container);
				// this.nodes.push( node );
				break;
			}

			default:
				break;
		}
	}

	parseNode( node ) {
		let args = node.getArgs();
		let val = '';
		for(let i=0; i<args.length; ++i) val += args[i];

		let res = {
			type : node.name,
			value : val
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
			this.AST[`trigger_${this.counter++}`] = this.parseNode( this.triggers[i] );
		}
		return this.AST;
	}
}
