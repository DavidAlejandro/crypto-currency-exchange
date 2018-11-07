import moment from 'moment';

export default function (state = [], action) {
	switch (action.type) {
		case 'UPDATE_TRADES': 
			let newState = action.newTradesData;
			let priceExists = false;
			let newStateCombined = [...state, ...newState];
					//Sort form most recent to last order made.
					newStateCombined.sort(function(a, b){
					    return b.timestamp - a.timestamp;
					});

					if (newStateCombined.length > 50) {
						newStateCombined.pop();
					}

					newStateCombined.map(function(trade){
						// get milliseconds by multiplying it by 1000
				      // let date = new Date(trade.timestamp*1000);
				      // let hours = date.getHours();
				      // let minutes = `0${date.getMinutes()}`;
				      // let seconds = `0${date.getSeconds()}`;
				      // let formattedTimestamp = (hours > 9 ? hours : `0${hours}`) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
				      let now = moment().format('HH:mm:ss');
				      // let formattedTimestamp = `${day.hours()}:${day.minutes()}:${day.seconds()}`
				      trade.formattedTimestamp = now;

					});

					return newStateCombined;
			break;

		default:
		//returns a copy of the state object to trigger state change.
      		return state.slice()
	}
}