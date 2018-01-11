
var RemoveASTCommand = function ( object, ast ) {

	Command.call( this );

	this.type = 'RemoveASTCommand';
	this.name = 'Remove AST';

	this.object = object;
	this.ast = ast;
	if ( this.object && this.ast ) {

		this.index = this.editor.asts[ this.object.uuid ].indexOf( this.ast );

	}

};

RemoveASTCommand.prototype = {

	execute: function () {

		if ( this.editor.asts[ this.object.uuid ] === undefined ) return;

		if ( this.index !== - 1 ) {

			this.editor.asts[ this.object.uuid ].splice( this.index, 1 );

		}

		this.editor.signals.astRemoved.dispatch( this.ast );

	},

	undo: function () {

		if ( this.editor.ast[ this.object.uuid ] === undefined ) {

			this.editor.ast[ this.object.uuid ] = [];

		}

		this.editor.ast[ this.object.uuid ].splice( this.index, 0, this.script );

		this.editor.signals.astAdded.dispatch( this.script );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.ast = this.ast;
		output.index = this.index;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.ast = json.ast;
		this.index = json.index;
		this.object = this.editor.objectByUuid( json.objectUuid );

	}

};
