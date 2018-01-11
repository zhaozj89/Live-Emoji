var SetASTValueCommand = function ( object, ast, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetASTValueCommand';
	this.name = 'Set AST.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.ast = ast;

	this.attributeName = attributeName;
	this.oldValue = ( ast !== undefined ) ? ast[ this.attributeName ] : undefined;
	this.newValue = newValue;

};

SetScriptValueCommand.prototype = {

	execute: function () {

		this.ast[ this.attributeName ] = this.newValue;

		this.editor.signals.astChanged.dispatch();

	},

	undo: function () {

		this.ast[ this.attributeName ] = this.oldValue;

		this.editor.ast.astChanged.dispatch();

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.index = this.editor.asts[ this.object.uuid ].indexOf( this.ast );
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
		this.attributeName = json.attributeName;
		this.object = this.editor.objectByUuid( json.objectUuid );
		this.ast = this.editor.asts[ json.objectUuid ][ json.index ];

	}

};
