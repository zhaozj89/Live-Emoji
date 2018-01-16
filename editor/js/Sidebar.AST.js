
Sidebar.AST = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' ); // hide the entire element

	container.add( new UI.Text( 'Behavior' ) );
	container.add( new UI.Break() );
	container.add( new UI.Break() );

	//

	var astsContainer = new UI.Row();
	container.add( astsContainer );

	var newAST = new UI.Button( 'New' );
	newAST.onClick( function () {

		var ast = {};
		editor.execute( new AddASTCommand( editor.selected, ast ) );

	} );
	container.add( newAST );

	//

	function update() {

		astsContainer.clear();
		astsContainer.setDisplay( 'none' );

		var object = editor.selected;

		if ( object === null ) {

			return;

		}

		var asts = editor.asts[ object.uuid ];

		if ( asts !== undefined ) {

			astsContainer.setDisplay( 'block' );

			for ( var i = 0; i < asts.length; ++i ) {

				( function ( object, ast ) {

					var name = new UI.Input( ast.name ).setWidth( '130px' ).setFontSize( '12px' );
					name.onChange( function () {

						editor.execute( new SetASTValueCommand( editor.selected, ast, 'name', this.getValue() ) );

					} );
					astsContainer.add( name );

					var edit = new UI.Button( 'Edit' );
					edit.setMarginLeft( '4px' );
					edit.onClick( function () {

						// signals.editAST.dispatch( object, ast );

						signals.editAST.dispatch( object );
					} );
					astsContainer.add( edit );

					var remove = new UI.Button( 'Remove' );
					remove.setMarginLeft( '4px' );
					remove.onClick( function () {

						if ( confirm( 'Are you sure?' ) ) {

							editor.execute( new RemoveASTCommand( editor.selected, ast ) );

						}

					} );
					astsContainer.add( remove );

					astsContainer.add( new UI.Break() );

				} )( object, asts[ i ] )

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


	signals.astAdded.add( update );
	signals.astRemoved.add( update );
	signals.astChanged.add( update );

	return container;

};
