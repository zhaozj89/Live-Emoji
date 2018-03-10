var RecommendationPanel = function ( editor ) {

	let container = new UI.Panel();
	container.setId( 'recommendationPanel' );

	let autoCheck = new UI.Checkbox( false );
	container.add( autoCheck );

	let autoCheckInfo = new UI.Text( 'Use Auto Triggering' );
	container.add( autoCheckInfo );

	let recommendedInfo = new UI.Text( 'Top 3 Recommended Keys' );
	container.add( recommendedInfo );

	let recommendedList = new UI.UList();
	recommendedList.setLeft( '0px' );
	let top0 = recommendedList.addLi( 'Top0 (key: <-)' );
	let top1 = recommendedList.addLi( 'Top1 (key: v)' );
	let top2 = recommendedList.addLi( 'Top2 (key: ->)' );

	container.add( recommendedList );

	return container;
}