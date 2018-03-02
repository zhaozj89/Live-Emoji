var Sidebar2 = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar2' );

	var heartView = new UI.Div();
	heartView.setId( 'heartView' );
	heartView.setClass( 'heart animated' );

	var heartValueText = new UI.Div();
	heartValueText.setId( 'heartValueText' );
	heartValueText.setWidth( '50px' );
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

	var valenceView = new UI.Div();
	valenceView.setId( 'valenceView' );
	valenceView.dom.style.textAlign = 'center';
	valenceView.dom.style.padding = '5px';

	var valenceImg = document.createElement("img");
	valenceImg.src = './asset/valence/SAM0.png';
	valenceImg.style.verticalAlign = 'middle';
	valenceView.dom.appendChild(valenceImg);

	var valenceText = new UI.Div();
	valenceText.setId( 'valenceText' );
	valenceText.setWidth( '20px' );
	valenceText.setHeight( '20px' );
	valenceText.setTextContent( '0' );
	valenceText.dom.style.backgroundColor = 'white';
	valenceText.dom.style.marginBottom = '5px';
	valenceText.dom.style.textAlign = 'center';

	var valenceSlider = new UI.Div();
	valenceSlider.setId( 'valenceSlider' );

	container.add( valenceView );
	container.add( valenceText );
	container.add( valenceSlider );

	$( function (  ) {

		let heart = document.getElementsByClassName('heart')[0];

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

		$( "#valenceSlider" ).slider( {
			value: 0,
			min: 0,
			max: 8,
			slide: function ( event, ui ) {
				$( valenceText.dom ).text( ui.value );
				valenceImg.src = './asset/valence/SAM' + ui.value + '.png';
			}
		} );
	} );

	return container;
};