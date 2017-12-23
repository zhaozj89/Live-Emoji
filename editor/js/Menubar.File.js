/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function (editor) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass('menu');

	var title = new UI.Panel();
	title.setClass('title');
	title.setTextContent('File');
	container.add(title);

	var options = new UI.Panel();
	options.setClass('options');
	container.add(options);

	// New

	var option = new UI.Row();
	option.setClass('option');
	option.setTextContent('New');
	option.onClick(function () {

		if (confirm('Any unsaved data will be lost. Are you sure?')) {

			editor.clear();

		}

	});
	options.add(option);

	// import

	var option = new UI.Panel();
	option.setClass('option');
	option.setTextContent('Import');
	option.onClick(Import);
	options.add(option);

	var fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.addEventListener('change', function (event) {

		var reader = new FileReader();
		console.log(this.files[0].name);
		// reader.addEventListener('load', function (event) {

			// editor.clear();
			// editor.fromJSON(JSON.parse(event.target.result));

			// console.log(event);

		// }, false);
		//
		// reader.readAsText(fileInput.files[0]);

		let loader = new THREE.ImageLoader();
		loader.load(
			'../test/' + this.files[0].name, // all imported files should be in ../test

			// onLoad callback
			function ( image ) {
				// use the image, e.g. draw part of it on a canvas
				var canvas = document.createElement( 'canvas' );
				var context = canvas.getContext( '2d' );
				context.drawImage( image, 10, 10 );

				document.body.appendChild(canvas);

				console.log(canvas.clientHeight);
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function () {
				console.error( 'An error happened.' );
			}
		);

	});

	function Import() {

		// if (confirm('Any unsaved data will be lost. Are you sure?'))
		fileInput.click();

	}

	// export

	var option = new UI.Panel();
	option.setClass('option');
	option.setTextContent('Export');
	option.onClick(Export);
	options.add(option);

	signals.exportState.add(Export);

	function Export() {

		var output = JSON.stringify(editor.toJSON(), null, '\t');

		var blob = new Blob([output], {type: 'text/plain'});
		var objectURL = URL.createObjectURL(blob);

		window.open(objectURL, '_blank');
		window.focus();

	}

	return container;

};
