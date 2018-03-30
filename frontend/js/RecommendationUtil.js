function GetPositiveOrNegative(name) {
	let max_pm = null;
	switch ( name ) {
		case 'angry':
			max_pm = 'negative';
			break;
		case 'disgusted':
			max_pm = 'negative';
			break;
		case 'fearful':
			max_pm = 'negative';
			break;
		case 'happy':
			max_pm = 'positive';
			break;
		case 'sad':
			max_pm = 'negative';
			break;
		case 'surprised':
			max_pm = 'positive';
			break;
		case 'neutral':
			max_pm = 'positive';
			break;
	}
	return max_pm;
}

function MostPossibleEmotion( list ) {
	let max_val = -Number.MAX_VALUE;
	let max_prop = null;
	for( let prop in list ) {
		if( list[prop]>max_val ) {
			max_val = list[prop];
			max_prop = prop;
		}
	}

	let max_pm = null;
	switch ( max_prop ) {
		case 'angry':
			max_pm = 'negative';
			break;
		case 'disgusted':
			max_pm = 'negative';
			break;
		case 'fearful':
			max_pm = 'negative';
			break;
		case 'happy':
			max_pm = 'positive';
			break;
		case 'sad':
			max_pm = 'negative';
			break;
		case 'surprised':
			max_pm = 'positive';
			break;
		case 'neutral':
			max_pm = 'positive';
			break;
	}

	return {
		prop: max_prop,
		val: max_val,
		pm: max_pm
	};
}