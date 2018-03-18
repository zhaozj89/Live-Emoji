var Sidebar2 = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar2' );

	let titleValence = new UI.Text( 'Valence Panel' );
	titleValence.setColor( 'whitesmoke' );
	titleValence.setMargin( '10px' );
	titleValence.setWidth( '200px' );
	titleValence.setBackgroundColor( 'blueviolet' );
	container.add( titleValence );

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
	valenceText.setBackgroundColor('yellow');
	valenceText.setMargin('5px');
	valenceText.setMarginLeft('90px');
	valenceText.setTextAlign('center');
	valenceText.dom.style.borderRadius = '10px';

	var valenceSlider = new UI.Div();
	valenceSlider.setId( 'valenceSlider' );

	container.add( valenceView );
	container.add( valenceText );
	container.add( valenceSlider );

	let titleArousal = new UI.Text( 'Arousal Panel' );
	titleArousal.setColor( 'whitesmoke' );
	titleArousal.setMargin( '10px' );
	titleArousal.setWidth( '200px' );
	titleArousal.setBackgroundColor( 'blueviolet' );
	container.add( titleArousal );

	var heartView = new UI.Div();
	heartView.setId( 'heartView' );
	heartView.setClass( 'heart animated' );

	var heartValueText = new UI.Div();
	heartValueText.setId( 'heartValueText' );
	heartValueText.setWidth( '40px' );
	heartValueText.setHeight( '20px' );
	heartValueText.setTextContent( '1' );
	heartValueText.setBackgroundColor('red');
	heartValueText.setMargin('5px');
	heartValueText.setMarginLeft('80px');
	heartValueText.setTextAlign('center');
	heartValueText.dom.style.borderRadius = '15px';

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

				if( editor.emotionCMDManager.currentNodeSession !== null && editor.emotionCMDManager.currentNodeSession.triggerNode !== null ) {
					editor.emotionCMDManager.currentNodeSession.triggerNode.arousal.setArg( ui.value );
				}
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

				if( editor.emotionCMDManager.currentNodeSession !== null && editor.emotionCMDManager.currentNodeSession.triggerNode !== null ) {
					editor.emotionCMDManager.currentNodeSession.triggerNode.valence.setArg( ui.value );
				}
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

	let titleRecommendation = new UI.Text( 'Recommendation Panel' );
	titleRecommendation.setColor( 'whitesmoke' );
	titleRecommendation.setMargin( '10px' );
	titleRecommendation.setWidth( '200px' );
	titleRecommendation.setBackgroundColor( 'blueviolet' );
	container.add( titleRecommendation );

	// recommendation panel
	let recommendationPanel = new UI.Panel();

	let table = document.createElement("TABLE");
	table.style.class = 'table table-dark';

	let header = table.createTHead();

	let headerRow = header.insertRow(0);

	let headerCell0 = document.createElement('th');
	let headerCell1 = document.createElement('th');

	headerCell0.setAttribute( 'scope', 'col');
	headerCell1.setAttribute( 'scope', 'col');

	headerRow.appendChild(headerCell0);
	headerRow.appendChild(headerCell1);

	recommendationPanel.dom.appendChild( table );

	let autoCheck = new UI.Checkbox( false );
	let autoCheckInfo = new UI.Text( 'Auto Triggering' );
	autoCheckInfo.setTextAlign( 'center' );

	headerCell0.appendChild( autoCheck.dom );
	headerCell1.appendChild(autoCheckInfo.dom);

	let body = table.createTBody();

	let bodyRow0 = body.insertRow(0);
	let bodyRow1 = body.insertRow(1);
	let bodyRow2 = body.insertRow(2);

	let top0 = new UI.Text( '(key: <-)' );
	let top1 = new UI.Text( '(key: v)' );
	let top2 = new UI.Text( '(key: ->)' );

	//

	let bodyRow0Cell0 = document.createElement('th');
	bodyRow0Cell0.innerHTML = "0";
	bodyRow0Cell0.setAttribute( 'scope', 'row');

	let bodyRow0Cell1 = document.createElement('td');
	bodyRow0Cell1.appendChild( top0.dom );
	bodyRow0Cell1.style.textAlign = 'center';

	bodyRow0.appendChild( bodyRow0Cell0 );
	bodyRow0.appendChild( bodyRow0Cell1 );

	//

	let bodyRow1Cell0 = document.createElement('th');
	bodyRow1Cell0.innerHTML = "1";
	bodyRow1Cell0.setAttribute( 'scope', 'row');

	let bodyRow1Cell1 = document.createElement('td');
	bodyRow1Cell1.appendChild( top1.dom );
	bodyRow1Cell1.style.textAlign = 'center';

	bodyRow1.appendChild( bodyRow1Cell0 );
	bodyRow1.appendChild( bodyRow1Cell1 );

	//

	let bodyRow2Cell0 = document.createElement('th');
	bodyRow2Cell0.innerHTML = "2";
	bodyRow2Cell0.setAttribute( 'scope', 'row');

	let bodyRow2Cell1 = document.createElement('td');
	bodyRow2Cell1.appendChild( top2.dom );
	bodyRow2Cell1.style.textAlign = 'center';

	bodyRow2.appendChild( bodyRow2Cell0 );
	bodyRow2.appendChild( bodyRow2Cell1 );

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

			top0.textContent = 'Top0: ' + all_distprop[ 0 ].other.key + '-' + all_distprop[ 0 ].other.semantic + ' (key: <-)';
			top1.textContent = 'Top1: ' + all_distprop[ 1 ].other.key + '-' + all_distprop[ 1 ].other.semantic + ' (key: v)';
			top2.textContent = 'Top2: ' + all_distprop[ 2 ].other.key + '-' + all_distprop[ 2 ].other.semantic + ' (key: ->)';

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