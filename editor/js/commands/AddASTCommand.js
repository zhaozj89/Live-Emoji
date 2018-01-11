
var AddNEditorCommand = function ( object, ast ) {

	Command.call( this );

	this.type = 'AddASTCommand';
	this.name = 'Add Abstract Syntax Tree';

	this.object = object;
	this.ast = ast;

};

AddNEditorCommand.prototype = {

	execute: function () {

		if ( this.editor.asts[ this.object.uuid ] === undefined ) {

			this.editor.asts[ this.object.uuid ] = [];

		}

		this.editor.asts[ this.object.uuid ].push( this.ast );

		this.editor.signals.astAdded.dispatch( this.ast );

	},

	undo: function () {

		if ( this.editor.asts[ this.object.uuid ] === undefined ) return;

		var index = this.editor.asts[ this.object.uuid ].indexOf( this.ast );

		if ( index !== - 1 ) {

			this.editor.asts[ this.object.uuid ].splice( index, 1 );

		}

		this.editor.signals.astRemoved.dispatch( this.ast );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.ast = this.ast;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.ast = json.ast;
		this.object = this.editor.objectByUuid( json.objectUuid );

	}

};
