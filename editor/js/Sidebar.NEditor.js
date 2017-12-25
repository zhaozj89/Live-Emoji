
Sidebar.NEditor = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' ); // hide the entire element

	container.add( new UI.Text( 'NEditor' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break() );
	container.add( new UI.Break() );

	//

	var nEditorContainer = new UI.Row();
	container.add( nEditorContainer );

	var newNEditor = new UI.Button( 'New' );
	newNEditor.onClick( function () {

		var script = { name: '', source: 'function update( event ) {}' }; // we should make an annotation method to represent node editor
		editor.execute( new AddNEditorCommand( editor.selected, script ) );

	} );
	container.add( newNEditor );

	/*
	var loadScript = new UI.Button( 'Load' );
	loadScript.setMarginLeft( '4px' );
	container.add( loadScript );
	*/

	//

	function update() {

		nEditorContainer.clear();
		nEditorContainer.setDisplay( 'none' );

		var object = editor.selected;

		if ( object === null ) {

			return;

		}

		var scripts = editor.nEditor[ object.uuid ];

		if ( scripts !== undefined ) {

			nEditorContainer.setDisplay( 'block' );

			for ( var i = 0; i < scripts.length; i ++ ) {

				( function ( object, script ) {

					var name = new UI.Input( script.name ).setWidth( '130px' ).setFontSize( '12px' );
					name.onChange( function () {

						editor.execute( new SetScriptValueCommand( editor.selected, script, 'name', this.getValue() ) );

					} );
					nEditorContainer.add( name );

					var edit = new UI.Button( 'Edit' );
					edit.setMarginLeft( '4px' );
					edit.onClick( function () {

						signals.editNEditor.dispatch( object, script );

					} );
					nEditorContainer.add( edit );

					var remove = new UI.Button( 'Remove' );
					remove.setMarginLeft( '4px' );
					remove.onClick( function () {

						if ( confirm( 'Are you sure?' ) ) {

							editor.execute( new RemoveNEditorCommand( editor.selected, script ) );

						}

					} );
					nEditorContainer.add( remove );

					nEditorContainer.add( new UI.Break() );

				} )( object, scripts[ i ] )

			}

		}

	}

	// signals

	signals.objectSelected.add( function ( object ) {

		if ( object !== null && editor.camera !== object ) {

			container.setDisplay( 'block' );

			update();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.nEditorAdded.add( update );
	signals.nEditorRemoved.add( update );
	signals.nEditorChanged.add( update );

	return container;

};
