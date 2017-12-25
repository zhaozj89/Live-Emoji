"use strict";

var mouse = {
	currentInput: undefined
};

function createPath(a, b) {
	var diff = {
		x: b.x - a.x,
		y: b.y - a.y
	};

	var pathStr = [
		'M' + a.x + ',' + a.y + ' C',
		a.x + diff.x / 3 * 2 + ',' + a.y + ' ',
		a.x + diff.x / 3 + ',' + b.y + ' ',
		b.x + ',' + b.y
	].join('');

	return pathStr;
}


var NEditor = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'nEditor' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '300px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.8 );
	container.setBackgroundColor( '#272822' );
	container.setDisplay( 'none' );


	var header = new UI.Panel();
	header.setPadding( '10px' );
	container.add( header );

	var title = new UI.Text( 'My Node Editor' ).setColor( '#fff' );
	header.add( title );

	var buttonSVG = ( function () {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'width', 32 );
		svg.setAttribute( 'height', 32 );
		var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		path.setAttribute( 'd', 'M 12,12 L 22,22 M 22,12 12,22' );
		path.setAttribute( 'stroke', '#fff' );
		svg.appendChild( path );
		return svg;
	} )();

	var close = new UI.Element( buttonSVG );
	close.setPosition( 'absolute' );
	close.setTop( '3px' );
	close.setRight( '1px' );
	close.setCursor( 'pointer' );
	close.onClick( function () {

		container.setDisplay( 'none' );

	} );
	header.add( close );


	var renderer;

	signals.rendererChanged.add( function ( newRenderer ) {

		renderer = newRenderer;

	} );

	var graphSVG = ( function () {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'position', 'absolute' );
		// svg.setAttribute( 'z-index', 1 );
		svg.setAttribute( 'width', '100%' );
		svg.setAttribute( 'height', '100%' );
		svg.setAttribute( 'id', 'node-graph' );
		svg.ns = svg.namespaceURI;
		return svg;
	} )();

	var canvas = new UI.Panel();
	var graph = new UI.Element( graphSVG );
	canvas.setPosition( 'absolute' );
	// canvas.setTop( '42px' );
	canvas.setTop( '37px' );
	// canvas.setBottom( '-32px' );
	canvas.setZIndex( 1 );
	canvas.setWidth( '100%' );
	canvas.setHeight( '100%' );
	canvas.add( graph );
	container.add(canvas);

	var getFullOffset = function(el){
		var offset = {
			top: el.offsetTop,
			left: el.offsetLeft
		};

		if (el.offsetParent){
			offset.top += el.offsetParent.offsetTop;
			offset.left += el.offsetParent.offsetLeft;
		}

		// if (el.offsetParent){
		// 	var parentOff = getFullOffset(el.offsetParent);
		// 	offset.top += parentOff.top;
		// 	offset.left += parentOff.left;
		// }

		return offset;
	};

	graphSVG.onmousemove = function(event) {
		if (mouse.currentInput){
			var path = mouse.currentInput.path;
			var inputPt = mouse.currentInput.getAttachPoint();
			var outputPt = {x: event.pageX, y: event.pageY};
			var val = createPath(inputPt, outputPt);
			path.setAttributeNS(null, 'd', val);
		}
	};

	graphSVG.onclick = function(event){
		if (mouse.currentInput){
			mouse.currentInput.path.removeAttribute('d');

			if (mouse.currentInput.node)
				mouse.currentInput.node.detachInput(mouse.currentInput);

			mouse.currentInput = undefined;
		}
	};

	function Node(options){
		this.name = '';
		this.value = '';
		this.isRoot = false;

		for (var prop in options)
			if (this.hasOwnProperty(prop))
				this[prop] = options[prop];

		this.inputs = [];
		this.attachedPaths = [];
		this.connected = false;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('x-node');
		this.domElement.setAttribute('title', this.name);

		var outputDom = document.createElement('span');
		outputDom.classList.add('x-output');
		outputDom.textContent = '';

		if (this.isRoot)
			outputDom.classList.add('hide');

		this.domElement.appendChild(outputDom);

		var that = this;
		outputDom.onclick = function(event){
			if (mouse.currentInput && !that.ownsInput(mouse.currentInput)){
				that.connectTo(mouse.currentInput);
				mouse.currentInput = undefined;
			}

			event.stopPropagation();
		};
	}

	Node.prototype = {
		getOutputPoint: function(){
			var fchild = this.domElement.firstElementChild;
			var offset = getFullOffset(fchild);
			return {
				x: offset.left + fchild.offsetWidth / 2,
				y: offset.top + fchild.offsetHeight / 2
			};
		},
		addInput: function(name, type){
			var options = {};
			options.name = name;
			type === undefined ? true : options.type = type;

			var input = new nodeInput(options);
			this.inputs.push(input);
			this.domElement.appendChild(input.domElement);

			return input;
		},
		detachInput: function(input){
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
		},
		ownsInput: function(input){
			for (var i = 0; i < this.inputs.length; i++){
				if (this.inputs[i] == input)
					return true;
			}

			return false;
		},
		updatePosition: function(){
			var outputPt = this.getOutputPoint();

			for (var i = 0; i < this.attachedPaths.length; i++){
				var inputPt = this.attachedPaths[i].input.getAttachPoint();
				var pathStr = createPath(inputPt, outputPt);
				this.attachedPaths[i].path.setAttributeNS(null, 'd', pathStr);
			}

			for (var j = 0; j < this.inputs.length; j++){
				if (this.inputs[j].node === undefined) continue;

				var inputPt = this.inputs[j].getAttachPoint();
				var outputPt = this.inputs[j].node.getOutputPoint();

				var pathStr = createPath(inputPt, outputPt);
				this.inputs[j].path.setAttributeNS(null, 'd', pathStr);
			}
		},
		connectTo: function(input){
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

			var pathStr = createPath(inputPt, outputPt);
			input.path.setAttributeNS(null, 'd', pathStr);
		},
		moveTo: function(point){
			this.domElement.style.top = point.y + 'px';
			this.domElement.style.left = point.x + 'px';
			this.updatePosition();
		},
		initUI: function(my_container){
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
	};


	function nodeInput(options){
		this.name = '';
		this.type = 'connection';

		for (var prop in options)
			if (this.hasOwnProperty(prop))
				this[prop] = options[prop];

		this.node = undefined;

		this.domElement = document.createElement('div');
		this.domElement.textContent = this.name;
		this.domElement.title = this.name;

		this.domElement.classList.add('x-' + this.type);
		this.domElement.classList.add('empty');

		var that = this;
		if (this.type == 'input'){
			var input = document.createElement('input');
			Object.defineProperty(that, 'value', {
				get: function(){ return input.value; },
				set: function(val){ input.value = val },
				enumerable: true
			});
			this.domElement.textContent += ' ';
			this.domElement.appendChild(input);
		}

		this.path = document.createElementNS(graphSVG.ns, 'path');
		this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
		this.path.setAttributeNS(null, 'stroke-width', '2');
		this.path.setAttributeNS(null, 'fill', 'none');
		graphSVG.appendChild(this.path);

		if (this.type == 'connection'){
			this.domElement.onclick = function(event){
				if (mouse.currentInput){
					if (mouse.currentInput.path.hasAttribute('d'))
						mouse.currentInput.path.removeAttribute('d');
					if (mouse.currentInput.node){
						mouse.currentInput.node.detachInput(mouse.currentInput);
						mouse.currentInput.node = undefined;
					}
				}

				mouse.currentInput = that;
				if (that.node){
					that.node.detachInput(that);
					that.domElement.classList.remove('filled');
					that.domElement.classList.add('empty');
				}

				event.stopPropagation();
			};
		}
	}

	nodeInput.prototype = {
		getAttachPoint: function(){
			var offset = getFullOffset(this.domElement);
			return {
				x: offset.left + this.domElement.offsetWidth - 2,
				y: offset.top + this.domElement.offsetHeight / 2
			};
		}
	};


	// Node 1
	var node = new Node({name: 'Node 1'});
	node.addInput('Value1');
	node.addInput('Value2');
	node.addInput('Value3');

	// Node 2
	var node2 = new Node({name: 'Node 2'});
	node2.addInput('Text In');
	node2.addInput('Value 5');

	// Node 3
	var node3 = new Node({name: 'Something Else'});
	node3.addInput('Color4');
	node3.addInput('Position');
	node3.addInput('Noise Octaves');

	// Node 4
	var node4 = new Node({name: 'TextString'});
	node4.addInput('Value', 'input');

	// Move to initial positions
	node.moveTo({x: 300, y: 80});
	node2.moveTo({x: 20, y: 70});
	node3.moveTo({x:150, y:150});
	node4.moveTo({x:150, y:20});



	// Add to DOM
	node.initUI(canvas.dom);
	node2.initUI(canvas.dom);
	node3.initUI(canvas.dom);
	node4.initUI(canvas.dom);

	// node.updatePosition();
	// node2.updatePosition();
	// node3.updatePosition();
	// node4.updatePosition();

	// Connect Nodes
	node.connectTo(node3.inputs[0]);
	node3.connectTo(node2.inputs[1]);
	node4.connectTo(node2.inputs[0]);

	node4.inputs[0].value = 'Some String';

	/*
		var delay;
		var currentMode;
		var currentScript;
		var currentObject;

		var codemirror = CodeMirror( container.dom, {
			value: '',
			lineNumbers: true,
			matchBrackets: true,
			indentWithTabs: true,
			tabSize: 4,
			indentUnit: 4,
			hintOptions: {
				completeSingle: false
			}
		} );
		codemirror.setOption( 'theme', 'monokai' );
		codemirror.on( 'change', function () {

			if ( codemirror.state.focused === false ) return;

			clearTimeout( delay );
			delay = setTimeout( function () {

				var value = codemirror.getValue();

				if ( ! validate( value ) ) return;

				if ( typeof( currentScript ) === 'object' ) {

					if ( value !== currentScript.source ) {

						editor.execute( new SetScriptValueCommand( currentObject, currentScript, 'source', value ) );

					}
					return;
				}

				if ( currentScript !== 'programInfo' ) return;

				var json = JSON.parse( value );

				if ( JSON.stringify( currentObject.material.defines ) !== JSON.stringify( json.defines ) ) {

					var cmd = new SetMaterialValueCommand( currentObject, 'defines', json.defines );
					cmd.updatable = false;
					editor.execute( cmd );

				}
				if ( JSON.stringify( currentObject.material.uniforms ) !== JSON.stringify( json.uniforms ) ) {

					var cmd = new SetMaterialValueCommand( currentObject, 'uniforms', json.uniforms );
					cmd.updatable = false;
					editor.execute( cmd );

				}
				if ( JSON.stringify( currentObject.material.attributes ) !== JSON.stringify( json.attributes ) ) {

					var cmd = new SetMaterialValueCommand( currentObject, 'attributes', json.attributes );
					cmd.updatable = false;
					editor.execute( cmd );

				}

			}, 300 );

		});

		// prevent backspace from deleting objects
		var wrapper = codemirror.getWrapperElement();
		wrapper.addEventListener( 'keydown', function ( event ) {

			event.stopPropagation();

		} );

		// validate

		var errorLines = [];
		var widgets = [];

		var validate = function ( string ) {

			var valid;
			var errors = [];

			return codemirror.operation( function () {

				while ( errorLines.length > 0 ) {

					codemirror.removeLineClass( errorLines.shift(), 'background', 'errorLine' );

				}

				while ( widgets.length > 0 ) {

					codemirror.removeLineWidget( widgets.shift() );

				}

				//

				switch ( currentMode ) {

					case 'javascript':

						try {

							var syntax = esprima.parse( string, { tolerant: true } );
							errors = syntax.errors;

						} catch ( error ) {

							errors.push( {

								lineNumber: error.lineNumber - 1,
								message: error.message

							} );

						}

						for ( var i = 0; i < errors.length; i ++ ) {

							var error = errors[ i ];
							error.message = error.message.replace(/Line [0-9]+: /, '');

						}

						break;

					case 'json':

						errors = [];

						jsonlint.parseError = function ( message, info ) {

							message = message.split('\n')[3];

							errors.push( {

								lineNumber: info.loc.first_line - 1,
								message: message

							} );

						};

						try {

							jsonlint.parse( string );

						} catch ( error ) {

							// ignore failed error recovery

						}

						break;

					case 'glsl':

						try {

							var shaderType = currentScript === 'vertexShader' ?
								glslprep.Shader.VERTEX : glslprep.Shader.FRAGMENT;

							glslprep.parseGlsl( string, shaderType );

						} catch( error ) {

							if ( error instanceof glslprep.SyntaxError ) {

								errors.push( {

									lineNumber: error.line,
									message: "Syntax Error: " + error.message

								} );

							} else {

								console.error( error.stack || error );

							}

						}

						if ( errors.length !== 0 ) break;
						if ( renderer instanceof THREE.WebGLRenderer === false ) break;

						currentObject.material[ currentScript ] = string;
						currentObject.material.needsUpdate = true;
						signals.materialChanged.dispatch( currentObject.material );

						var programs = renderer.info.programs;

						valid = true;
						var parseMessage = /^(?:ERROR|WARNING): \d+:(\d+): (.*)/g;

						for ( var i = 0, n = programs.length; i !== n; ++ i ) {

							var diagnostics = programs[i].diagnostics;

							if ( diagnostics === undefined ||
								diagnostics.material !== currentObject.material ) continue;

							if ( ! diagnostics.runnable ) valid = false;

							var shaderInfo = diagnostics[ currentScript ];
							var lineOffset = shaderInfo.prefix.split(/\r\n|\r|\n/).length;

							while ( true ) {

								var parseResult = parseMessage.exec( shaderInfo.log );
								if ( parseResult === null ) break;

								errors.push( {

									lineNumber: parseResult[ 1 ] - lineOffset,
									message: parseResult[ 2 ]

								} );

							} // messages

							break;

						} // programs

				} // mode switch

				for ( var i = 0; i < errors.length; i ++ ) {

					var error = errors[ i ];

					var message = document.createElement( 'div' );
					message.className = 'esprima-error';
					message.textContent = error.message;

					var lineNumber = Math.max( error.lineNumber, 0 );
					errorLines.push( lineNumber );

					codemirror.addLineClass( lineNumber, 'background', 'errorLine' );

					var widget = codemirror.addLineWidget( lineNumber, message );

					widgets.push( widget );

				}

				return valid !== undefined ? valid : errors.length === 0;

			});

		};

		// tern js autocomplete

		var server = new CodeMirror.TernServer( {
			caseInsensitive: true,
			plugins: { threejs: null }
		} );

		codemirror.setOption( 'extraKeys', {
			'Ctrl-Space': function(cm) { server.complete(cm); },
			'Ctrl-I': function(cm) { server.showType(cm); },
			'Ctrl-O': function(cm) { server.showDocs(cm); },
			'Alt-.': function(cm) { server.jumpToDef(cm); },
			'Alt-,': function(cm) { server.jumpBack(cm); },
			'Ctrl-Q': function(cm) { server.rename(cm); },
			'Ctrl-.': function(cm) { server.selectName(cm); }
		} );

		codemirror.on( 'cursorActivity', function( cm ) {

			if ( currentMode !== 'javascript' ) return;
			server.updateArgHints( cm );

		} );

		codemirror.on( 'keypress', function( cm, kb ) {

			if ( currentMode !== 'javascript' ) return;
			var typed = String.fromCharCode( kb.which || kb.keyCode );
			if ( /[\w\.]/.exec( typed ) ) {

				server.complete( cm );

			}

		} );


		//

		signals.editorCleared.add( function () {

			container.setDisplay( 'none' );

		} );

		signals.editScript.add( function ( object, script ) {

			var mode, name, source;

			if ( typeof( script ) === 'object' ) {

				mode = 'javascript';
				name = script.name;
				source = script.source;
				title.setValue( object.name + ' / ' + name );

			} else {

				switch ( script ) {

					case 'vertexShader':

						mode = 'glsl';
						name = 'Vertex Shader';
						source = object.material.vertexShader || "";

						break;

					case 'fragmentShader':

						mode = 'glsl';
						name = 'Fragment Shader';
						source = object.material.fragmentShader || "";

						break;

					case 'programInfo':

						mode = 'json';
						name = 'Program Properties';
						var json = {
							defines: object.material.defines,
							uniforms: object.material.uniforms,
							attributes: object.material.attributes
						};
						source = JSON.stringify( json, null, '\t' );

				}
				title.setValue( object.material.name + ' / ' + name );

			}

			currentMode = mode;
			currentScript = script;
			currentObject = object;

			container.setDisplay( '' );
			codemirror.setValue( source );
			codemirror.clearHistory();
			if ( mode === 'json' ) mode = { name: 'javascript', json: true };
			codemirror.setOption( 'mode', mode );

		} );

		signals.scriptRemoved.add( function ( script ) {

			if ( currentScript === script ) {

				container.setDisplay( 'none' );

			}

		} );
	*/

	signals.editScript.add( function ( object, script ) {

		container.setDisplay( '' );


	} );


	return container;

};
