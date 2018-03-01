var Sidebar2 = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar2' );

	var heartView = new UI.Div();
	heartView.setClass( 'heart animated' );

	var heartValueText = new UI.Div();
	heartValueText.setId( 'heartValueText' );
	heartValueText.setWidth( '20px' );
	heartValueText.setHeight( '20px' );
	heartValueText.setTextContent( '1' );
	heartValueText.dom.style.backgroundColor = 'white';
	heartValueText.dom.style.marginBottom = '5px';
	heartValueText.dom.style.textAlign = 'center';

	var heartSlider = new UI.Div();
	heartSlider.setId( 'heartSlider' );

	container.add( heartView );
	container.add( heartValueText );
	container.add( heartSlider );

	$( function (  ) {

		let heart = document.getElementsByClassName('heart')[0];

		heart.onmouseout = function() {
			heart.style.webkitTransform = 'scale(1)';
			heart.style.MozTransform = 'scale(1)';
			heart.style.msTransform = 'scale(1)';
			heart.style.OTransform = 'scale(1)';
			heart.style.transform = 'scale(1)';
		};

		$( "#heartSlider" ).slider( {
			value: 1,
			min: 1,
			max: 100,
			slide: function ( event, ui ) {
				$( heartValueText.dom ).text( ui.value );
				let val = -19*ui.value + 1981;
				heart.style.animation = val + 'ms pulsate infinite alternate ease-in-out';
			}
		} );
	} );

	return container;
};