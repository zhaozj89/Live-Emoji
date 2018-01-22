
let CreateNodeInputDOM = function ( that ) {
	let dom = document.createElement('div');
	dom.textContent = that.type;
	dom.title = that.type;
	dom.classList.add('x-connection');
	dom.classList.add('empty');

	dom.onclick = function(event){
		if (NEDITOR_MOUSE_INFO.currentInput) {
			if (NEDITOR_MOUSE_INFO.currentInput.path.hasAttribute('d'))
				NEDITOR_MOUSE_INFO.currentInput.path.removeAttribute('d');
			if (NEDITOR_MOUSE_INFO.currentInput.node) {
				NEDITOR_MOUSE_INFO.currentInput.node.detachInput(NEDITOR_MOUSE_INFO.currentInput);
				NEDITOR_MOUSE_INFO.currentInput.node = undefined;
			}
		}

		NEDITOR_MOUSE_INFO.currentInput = that;
		if (that.node){
			that.node.detachInput(that);
			that.domElement.classList.remove('filled');
			that.domElement.classList.add('empty');
		}

		event.stopPropagation();
	};

	return dom;
}

let CreateNodeInputPath = function ( canvas ) {
	let path = document.createElementNS(canvas.ns, 'path');
	path.setAttributeNS(null, 'stroke', '#8e8e8e');
	path.setAttributeNS(null, 'stroke-width', '2');
	path.setAttributeNS(null, 'fill', 'none');
	canvas.appendChild(path);
	return path;
}


let CreateNodeDOM = function ( name ) {
	let dom = document.createElement('div');
	dom.classList.add('x-node');
	dom.setAttribute('title', name);
	return dom;
}

let CreateOutputDOM = function ( that ) {
	let dom = document.createElement('span');
	dom.classList.add('x-output');
	dom.textContent = '';

	if ( that.isRoot )
		dom.classList.add('hide');

	dom.onclick = function( event ){
		if ( NEDITOR_MOUSE_INFO.currentInput && !that.ownsInput(NEDITOR_MOUSE_INFO.currentInput) ) {
			that.connectFrom(NEDITOR_MOUSE_INFO.currentInput);
			NEDITOR_MOUSE_INFO.currentInput = undefined;
		}
		event.stopPropagation();
	};

	return dom;
}

class NodeInput {
	constructor( type ) {
		this.type = type;
		this.arg = null;

		this.node = null;

		let that = this;
		this.domElement = CreateNodeInputDOM( that );
		this.path = CreateNodeInputPath( NEDITOR_SVG_CANVAS );
	}

	getAttachedPoint() {
		var offset = NEditorGetFullOffset(this.domElement);
		return {
			x: offset.left + this.domElement.offsetWidth - 2,
			y: offset.top + this.domElement.offsetHeight / 2
		};
	}
}


class Node {
	constructor( type, isRoot ) {
		this.type = type;
		this.isRoot = isRoot;

		this.inputs = [];
		this.attachedPaths = [];
		this.connected = false;

		this.domElement = CreateNodeDOM( this.type );

		let outputDom = CreateOutputDOM( this );
		this.domElement.appendChild( outputDom );
		this.output = outputDom;
	}

	addInput( input ) {
		this.inputs.push( input );
		this.domElement.appendChild( input.domElement );
	}

	removeInput() {
		if( this.inputs.length===0 ) return;
		let input = this.inputs[this.inputs.length-1];
		this.inputs.splice( this.inputs.length-1, 1 );
		input.domElement.parentElement.removeChild( input.domElement );
		return;
	}

	getOutputPoint() {
		var offset = NEditorGetFullOffset( this.output );
		return {
			x: offset.left + this.output.offsetWidth / 2,
			y: offset.top + this.output.offsetHeight / 2
		};
	}

	detachInput( input ){
		var index = -1;
		for (var i = 0; i < this.attachedPaths.length; i++){
			if (this.attachedPaths[i].input == input)
				index = i;
		}

		if (index >= 0){
			this.attachedPaths[index].path.removeAttribute('d');
			this.attachedPaths[index].input.node = undefined;
			this.attachedPaths.splice(index, 1);
		}

		if (this.attachedPaths.length <= 0)
			this.domElement.classList.remove('connected');
	}

	ownsInput( input ) {
		for (var i = 0; i < this.inputs.length; ++i){
			if (this.inputs[i] == input)
				return true;
		}
		return false;
	}

	updatePosition() {
		var outputPt = this.getOutputPoint();

		for (let i = 0; i < this.attachedPaths.length; ++i) {
			let inputPt = this.attachedPaths[i].input.getAttachedPoint();
			this.attachedPaths[i].path.setAttributeNS(null, 'd', NEditorCreatePath(inputPt, outputPt));
		}

		for (let j = 0; j < this.inputs.length; ++j) {
			if (this.inputs[j].node === null) continue;

			let inputPt = this.inputs[j].getAttachedPoint();
			let outputPt = this.inputs[j].node.getOutputPoint();
			this.inputs[j].path.setAttributeNS(null, 'd', NEditorCreatePath(inputPt, outputPt));
		}
	}

	connectFrom( input ) {
		input.node = this;
		this.connected = true;

		this.domElement.classList.add('connected');
		input.domElement.classList.remove('empty');
		input.domElement.classList.add('filled');

		this.attachedPaths.push({
			input: input,
			path: input.path
		});

		let inputPt = input.getAttachedPoint();
		let outputPt = this.getOutputPoint();

		input.path.setAttributeNS( null, 'd', NEditorCreatePath( inputPt, outputPt ) );
	}

	moveTo( point ) {
		this.domElement.style.top = point.y + 'px';
		this.domElement.style.left = point.x + 'px';
		this.updatePosition();
	}

	initUI( my_container ) {
		var that = this;

		$(this.domElement).draggable({
			containment: 'window',
			cancel: '.x-connection, .x-output, .x-input',
			drag: function(e, ui){
				that.updatePosition();
			}
		});

		this.domElement.style.position = 'absolute';
		my_container.appendChild(this.domElement);
		this.updatePosition();
	}









	// currently, one input can ONLY connect to one output (but one output can have multiple inputs)
	// AND, no method is provied for getting parent
	// stay tuned
	getChildren() {
		let res = [];
		for (let k=0; k<this.inputs.length; ++k) {
			res.push( this.inputs[k].node );
		}
		return res;
	}

	getArgs() {
		let res = new Array();
		for(let i=0; i<this.inputs.length; ++i) {
			if( this.inputs[i].arg!==null ) res.push( this.inputs[i].arg );
		}
		return res;
	}
}
