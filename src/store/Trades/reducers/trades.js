import moment from 'moment';

export default function (state = [], action) {
	switch (action.type) {
		case 'UPDATE_TRADES': 
			let newState = action.newTradesData;
			let priceExists = false;
			let newStateCombined = [...state, ...newState];
					//Sort from most recent to last order made.
					newStateCombined.sort(function(a, b){
					    return b.timestamp - a.timestamp;
					});

					if (newStateCombined.length > 50) {
						newStateCombined.pop();
					}

					newStateCombined.map(function(trade){				
				      let now = moment().format('HH:mm:ss');
				      trade.formattedTimestamp = now;

					});

					return newStateCombined;
			break;

		default:
		//returns a copy of the state object to trigger state change.
      		return state.slice()
	}
}