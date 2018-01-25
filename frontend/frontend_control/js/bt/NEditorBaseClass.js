
class LeafInput {
	constructor(type) {
		this.type = type;
		this.arg = null;

		this.node = null;

		this.domElement = this.createInput( this );
	}

	createInput ( that ) {
		let dom = document.createElement('div');
		dom.textContent = that.type + ':  ';
		dom.title = that.type;
		dom.classList.add('x-leaf');

		dom.onclick = function(event){
			event.stopPropagation();
		};

		$( dom ).on( 'keydown', function ( evt ) {
			evt.stopPropagation();
		} );

		return dom;
	}

	addTextInput( title ) {
		let that = this;
		let input = document.createElement('input');
		this.domElement.textContent = title;
		input.setAttribute('type', 'text');
		this.domElement.textContent += '';
		this.domElement.appendChild(input);
		$(input).change(function () {
			that.arg = input.value;
		});
	}
}

class NodeInput {
	constructor( type ) {
		this.type = type;
		this.arg = null;

		this.node = null;

		this.domElement = CreateInput( this );
		this.path = CreatePath( NEDITOR_SVG_CANVAS );
	}

	addNumberInput() {
		let that = this;
		let input = document.createElement( 'input' );
		this.domElement.textContent = 'milliseconds (>0): ';
		input.setAttribute( 'type', 'text' );
		this.domElement.textContent += '';
		this.domElement.appendChild( input );
		$( input ).change( function() { that.arg = input.value; } );
	}

	addPlaceholder( name ) {
		let dom = document.createElement( 'div' );
		dom.textContent = name;
		this.domElement.appendChild( dom );
	}

	addTextInput() {
		let that = this;
		let input = document.createElement( 'input' );
		this.domElement.textContent = 'key: ';
		input.setAttribute( 'type', 'text' );
		this.domElement.textContent += '';
		this.domElement.appendChild( input );
		$( input ).change( function() { that.arg = input.value; } );
	}

	addEmotionInput() {
		let that = this;
		this.domElement.textContent = 'emotion: ';
		let selectMenu = new UI.Select();
		selectMenu.setOptions( {
			"Happy" : "happy",
			"Sad" : "sad",
			"Disgusted" : "disgusted",
			"Fearful" : "fearful",
			"Neutral" : "neutral",
			"Surprised" : "surprised",
			"Angry" : "angry"
		} );
		this.domElement.appendChild( selectMenu.dom );
		$( selectMenu.dom ).change( function() { that.arg = selectMenu.getValue(); } );
	}

	addCharacterInput( obj ) {
		this.arg = obj;

		this.domElement.textContent = 'object: ';

		let allObjNames = {};
		let allObjs = {}
		allObjNames[obj.name] = obj.name;
		allObjs[obj.name] = obj;

		for(let i=0; i<obj.children.length; ++i) {
			allObjNames[obj.children[i].name] = obj.children[i].name;
			allObjs[obj.children[i].name] = obj.children[i];
		}

		let that = this;
		let selectMenu = new UI.Select();
		selectMenu.setOptions( allObjNames );

		this.domElement.appendChild( selectMenu.dom );
		$( selectMenu.dom ).change( function() {
			that.arg = allObjs[selectMenu.getValue()];
			console.log( that.arg );
		} );
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
	constructor( type ) {
		this.type = type;
		// this.arg = null;

		this.inputs = [];
		this.output = null;

		this.attachedPaths = [];
		this.connected = false;

		this.domElement = CreateTitle( this.type );

		let removeButton = CreateRemoveButton( this.domElement );
		this.domElement.appendChild( removeButton );
	}

	addOutput() {
		let outputDom = CreateOutput( this );
		this.domElement.appendChild( outputDom );
		this.output = outputDom;
	}

	addPlaceholder() {
		let dom = CreatePlaceholder();
		this.domElement.appendChild( dom );
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
		for (let j = 0; j < this.inputs.length; ++j) {
			if (this.inputs[j].node === null) continue;

			let inputPt = this.inputs[j].getAttachedPoint();
			let outputPt = this.inputs[j].node.getOutputPoint();
			this.inputs[j].path.setAttributeNS(null, 'd', NEditorCreatePath(inputPt, outputPt));
		}

		if (this.output === null) return;
		var outputPt = this.getOutputPoint();

		for (let i = 0; i < this.attachedPaths.length; ++i) {
			let inputPt = this.attachedPaths[i].input.getAttachedPoint();
			this.attachedPaths[i].path.setAttributeNS(null, 'd', NEditorCreatePath(inputPt, outputPt));
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
			cancel: '.x-connection, .x-output, .x-input, .x-leaf',
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
			if(  this.inputs[k].node!==null ) res.push( this.inputs[k].node );
		}
		return res;
	}

	getArgs() {
		let res = [];
		for(let i=0; i<this.inputs.length; ++i) {
			if( this.inputs[i].arg!==null ) res.push( this.inputs[i].arg );
		}

		return res;
	}
}
