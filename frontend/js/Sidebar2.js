var Sidebar2 = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar2' );

	var valenceView = new UI.Div();
	valenceView.setId( 'valenceView' );
	valenceView.dom.style.textAlign = 'center';
	valenceView.dom.style.padding = '5px';

	var valenceImg = document.createElement( "img" );
	valenceImg.src = './asset/valence_new/1.png';
	valenceImg.style.verticalAlign = 'middle';
	valenceView.dom.appendChild( valenceImg );

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

	editor.msgInputArousal = 1;

	$( function () {

		let heart = document.getElementsByClassName( 'heart' )[ 0 ];

		$( "#heartSlider" ).slider( {
			value: 1,
			min: 1,
			max: 100,
			slide: function ( event, ui ) {
				editor.msgInputArousal = Number( ui.value );

				$( heartValueText.dom ).text( ui.value );
				let val = -19 * ui.value + 1981;
				heart.style.animation = val + 'ms pulsate infinite alternate ease-in-out';
			}
		} );

		$( "#valenceSlider" ).slider( {
			value: 0,
			min: 0,
			max: 8,
			slide: function ( event, ui ) {
				$( valenceText.dom ).text( ui.value );
				let res = ui.value + 1;
				valenceImg.src = './asset/valence_new/' + res + '.png';
			}
		} );
	} );

	editor.signals.updateRecommendation.add( function ( valence_level ) {
		if ( editor.isLiveAnimationMode === true ) {
			let valence = Math.floor( valence_level * 8 );

			$( valenceText.dom ).text( valence );
			$( "#valenceSlider" ).slider( 'value', valence );
			valence += 1;
			valenceImg.src = './asset/valence_new/' + valence + '.png';
		}
	} );


	// recommendation panel
	var recommendationPanel = new UI.Panel();
	// recommendationPanel.setId( 'recommendationPanel' );

	let autoCheck = new UI.Checkbox( false );
	recommendationPanel.add( autoCheck );

	let autoCheckInfo = new UI.Text( 'Use Auto Triggering' );
	recommendationPanel.add( autoCheckInfo );

	let recommendedInfo = new UI.Text( 'Top 3 Recommended Keys' );
	recommendationPanel.add( recommendedInfo );

	let recommendedList = new UI.UList();
	recommendedList.setLeft( '0px' );
	let top0 = recommendedList.addLi( 'Top0: (key: <-)' );
	let top1 = recommendedList.addLi( 'Top1: (key: v)' );
	let top2 = recommendedList.addLi( 'Top2: (key: ->)' );

	recommendationPanel.add( recommendedList );

	container.add( recommendationPanel );

	let pre_key = null;

	editor.signals.updateRecommendation.add( function ( valence_level ) { // 0 - 1

		if ( editor.isLiveAnimationMode === true ) {
			let arousal = editor.msgInputArousal; // 1 - 100
			let valence = valence_level; // 0 - 1

			let all_distprop = [];
			for ( let prop in editor.emotionCMDManager.allCMDs ) {
				let info = editor.emotionCMDManager.allCMDs[ prop ].getInfo();
				let prop_arousal = Number( info.arousal );
				let prop_valence = Number( info.valence );

				let dist = ( arousal - prop_arousal ) * ( arousal - prop_arousal ) + 10000 * ( valence - prop_valence ) * ( valence - prop_valence );

				all_distprop.push( { val: dist, other: info } );
			}

			let len = all_distprop.length;
			for ( let i = 1; i < len; ++i ) {
				let value = all_distprop[ i ].val;
				for ( let j = i - 1; j >= 0; --j ) {
					if ( all_distprop[ j ].val > value ) {
						let tmp = all_distprop[ j ];
						all_distprop[ j ] = all_distprop[ i ];
						all_distprop[ i ] = tmp;
						i = j;
					}
					else
						break;
				}
			}

			top0.firstChild.textContent = 'Top0: ' + all_distprop[ 0 ].other.key + '-' + all_distprop[ 0 ].other.semantic + ' (key: <-)';
			top1.firstChild.textContent = 'Top1: ' + all_distprop[ 1 ].other.key + '-' + all_distprop[ 1 ].other.semantic + ' (key: v)';
			top2.firstChild.textContent = 'Top2: ' + all_distprop[ 2 ].other.key + '-' + all_distprop[ 2 ].other.semantic + ' (key: ->)';

			if ( autoCheck.getValue() === true ) {
				let key = all_distprop[ 0 ].other.key;
				if ( pre_key !== key ) {
					// console.log( 'trigger' );
					// console.log(key);
					editor.emotionCMDManager.allCMDs[ key ].run( key );
					pre_key = key;
				}
			}
			else {
				editor.top3Keys.key0 = all_distprop[ 0 ].other.key;
				editor.top3Keys.key1 = all_distprop[ 1 ].other.key;
				editor.top3Keys.key2 = all_distprop[ 2 ].other.key;
			}
		}
	} );

	return container;
};