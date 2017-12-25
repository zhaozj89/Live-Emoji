
var AddNEditorCommand = function ( object, script ) {

	Command.call( this );

	this.type = 'AddNEditorCommand';
	this.name = 'Add NEditor';

	this.object = object;
	this.script = script;

};

AddNEditorCommand.prototype = {

	execute: function () {

		if ( this.editor.nEditor[ this.object.uuid ] === undefined ) {

			this.editor.nEditor[ this.object.uuid ] = [];

		}

		this.editor.nEditor[ this.object.uuid ].push( this.script );

		this.editor.signals.nEditorAdded.dispatch( this.script );

	},

	undo: function () {

		if ( this.editor.nEditor[ this.object.uuid ] === undefined ) return;

		var index = this.editor.nEditor[ this.object.uuid ].indexOf( this.script );

		if ( index !== - 1 ) {

			this.editor.nEditor[ this.object.uuid ].splice( index, 1 );

		}

		this.editor.signals.nEditorRemoved.dispatch( this.script );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.script = this.script;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.script = json.script;
		this.object = this.editor.objectByUuid( json.objectUuid );

	}

};
