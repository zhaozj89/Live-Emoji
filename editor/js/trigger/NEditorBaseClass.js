
class NodeInput {
	constructor( options ) {
		this.name = '';
		this.type = '';

		for (var prop in options)
			if (this.hasOwnProperty(prop))
				this[prop] = options[prop];

		this.node = undefined;

		this.domElement = document.createElement('div');
		this.domElement.textContent = this.name;
		this.domElement.title = this.name;

		this.domElement.classList.add('x-connection');
		this.domElement.classList.add('empty');

		var that = this;
		if (this.type === NEDITOR_INPUT_TYPE.INPUT){
			var input = document.createElement('input');
			Object.defineProperty(that, 'value', {
				get: function(){ return input.value; },
				set: function(val){ input.value = val },
				enumerable: true
			});
			this.domElement.textContent += ' ';
			this.domElement.appendChild(input);
		}

		this.path = document.createElementNS(NEDITOR_SVG_CANVAS.ns, 'path');
		this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
		this.path.setAttributeNS(null, 'stroke-width', '2');
		this.path.setAttributeNS(null, 'fill', 'none');
		NEDITOR_SVG_CANVAS.appendChild(this.path);

		this.domElement.onclick = function(event){
			if (NEDITOR_MOUSE_INFO.currentInput){
				if (NEDITOR_MOUSE_INFO.currentInput.path.hasAttribute('d'))
					NEDITOR_MOUSE_INFO.currentInput.path.removeAttribute('d');
				if (NEDITOR_MOUSE_INFO.currentInput.node){
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
	}

	getAttachPoint() {
		var offset = NEditorGetFullOffset(this.domElement);
		return {
			x: offset.left + this.domElement.offsetWidth - 2,
			y: offset.top + this.domElement.offsetHeight / 2
		};
	}
}

class Node {
	constructor( name, isRoot, value ) {
		this.name = name;
		this.isRoot = isRoot;
		this.value = value;

		this.inputs = [];
		this.attachedPaths = [];
		this.connected = false;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('x-node');
		this.domElement.setAttribute('title', this.name);

		// here ONLY ONE output, refine it later
		let outputDom = document.createElement('span');
		outputDom.classList.add('x-output');
		outputDom.textContent = '';

		if ( this.isRoot )
			outputDom.classList.add('hide');

		this.domElement.appendChild(outputDom);

		var that = this;
		outputDom.onclick = function(event){
			if (NEDITOR_MOUSE_INFO.currentInput && !that.ownsInput(NEDITOR_MOUSE_INFO.currentInput)){
				that.connectTo(NEDITOR_MOUSE_INFO.currentInput);
				NEDITOR_MOUSE_INFO.currentInput = undefined;
			}
			event.stopPropagation();
		};
	}

	getOutputPoint() {
		var fchild = this.domElement.firstElementChild;
		var offset = NEditorGetFullOffset(fchild);
		return {
			x: offset.left + fchild.offsetWidth / 2,
			y: offset.top + fchild.offsetHeight / 2
		};
	}

	addInput( name, type ) {
		var options = {};
		options.name = name;
		type === undefined ? true : options.type = type;

		var input = new NodeInput( options );
		this.inputs.push( input );
		this.domElement.appendChild( input.domElement );

		return input;
	}

	removeInput( name ) {
		for(let i=0; i<this.inputs.length; ++i) {
			let input = this.inputs[i];
			if( input.name == name ) {
				this.inputs.splice( i, 1 );
				input.domElement.parentElement.removeChild( input.domElement );
			}
		}
		return null;
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

		for (var i = 0; i < this.attachedPaths.length; i++){
			var inputPt = this.attachedPaths[i].input.getAttachPoint();
			var pathStr = NEditorCreatePath(inputPt, outputPt);
			this.attachedPaths[i].path.setAttributeNS(null, 'd', pathStr);
		}

		for (var j = 0; j < this.inputs.length; j++){
			if (this.inputs[j].node === undefined) continue;

			var inputPt = this.inputs[j].getAttachPoint();
			var outputPt = this.inputs[j].node.getOutputPoint();

			var pathStr = NEditorCreatePath(inputPt, outputPt);
			this.inputs[j].path.setAttributeNS(null, 'd', pathStr);
		}
	}

	connectTo( input ) {
		input.node = this;
		this.connected = true;
		this.domElement.classList.add('connected');

		input.domElement.classList.remove('empty');
		input.domElement.classList.add('filled');

		this.attachedPaths.push({
			input: input,
			path: input.path
		});

		var inputPt = input.getAttachPoint();
		var outputPt = this.getOutputPoint();

		var pathStr = NEditorCreatePath( inputPt, outputPt );
		input.path.setAttributeNS(null, 'd', pathStr);
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
}
