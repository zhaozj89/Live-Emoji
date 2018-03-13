// var RecommendationPanel = function ( editor ) {
//
// 	let container = new UI.Panel();
// 	container.setId( 'recommendationPanel' );
//
// 	let autoCheck = new UI.Checkbox( false );
// 	container.add( autoCheck );
//
// 	let autoCheckInfo = new UI.Text( 'Use Auto Triggering' );
// 	container.add( autoCheckInfo );
//
// 	let recommendedInfo = new UI.Text( 'Top 3 Recommended Keys' );
// 	container.add( recommendedInfo );
//
// 	let recommendedList = new UI.UList();
// 	recommendedList.setLeft( '0px' );
// 	let top0 = recommendedList.addLi( 'Top0: (key: <-)' );
// 	let top1 = recommendedList.addLi( 'Top1: (key: v)' );
// 	let top2 = recommendedList.addLi( 'Top2: (key: ->)' );
//
// 	container.add( recommendedList );
//
// 	let pre_key = null;
//
// 	editor.signals.updateRecommendation.add(function ( valence_level ) { // 0 - 1
//
// 		let arousal = editor.msgInputArousal; // 1 - 100
// 		let valence = valence_level; // 0 - 1
//
// 		let all_distprop = [];
// 		for (let prop in editor.emotionCMDManager.allCMDs ) {
// 			let info = editor.emotionCMDManager.allCMDs[prop].getInfo();
// 			let prop_arousal = Number(info.arousal);
// 			let prop_valence = Number(info.valence);
//
// 			let dist = (arousal - prop_arousal)*(arousal - prop_arousal) + 10000 * (valence-prop_valence)*(valence-prop_valence);
//
// 			all_distprop.push( {val: dist, other: info} );
// 		}
//
// 		let len = all_distprop.length;
// 		for (let i=1; i<len; ++i) {
// 			let value = all_distprop[i].val;
// 			for (let j=i-1 ; j>=0; --j) {
// 				if(all_distprop[j].val > value) {
// 					let tmp = all_distprop[j];
// 					all_distprop[j] = all_distprop[i];
// 					all_distprop[i] = tmp;
// 					i = j;
// 				}
// 				else
// 					break;
// 			}
// 		}
//
// 		top0.firstChild.textContent = 'Top0: ' + all_distprop[0].other.key + '-' + all_distprop[0].other.semantic + ' (key: <-)';
// 		top1.firstChild.textContent = 'Top1: ' + all_distprop[1].other.key + '-' + all_distprop[1].other.semantic + ' (key: v)';
// 		top2.firstChild.textContent = 'Top2: ' + all_distprop[2].other.key + '-' + all_distprop[2].other.semantic + ' (key: ->)';
//
// 		if( autoCheck.getValue()===true ) {
// 			let key = all_distprop[0].other.key;
// 			if(pre_key!==key) {
// 				// console.log( 'trigger' );
// 				// console.log(key);
// 				editor.emotionCMDManager.allCMDs[key].run( key );
// 				pre_key = key;
// 			}
// 		}
// 		else {
// 			editor.top3Keys.key0 = all_distprop[0].other.key;
// 			editor.top3Keys.key1 = all_distprop[1].other.key;
// 			editor.top3Keys.key2 = all_distprop[2].other.key;
// 		}
// 	});
//
// 	return container;
// }