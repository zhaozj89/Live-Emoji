
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
			'type' : node.name,
			'args' : val
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
