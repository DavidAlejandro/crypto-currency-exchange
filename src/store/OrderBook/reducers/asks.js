export default function (state = [], action) {
	switch (action.type) {
		case 'UPDATE_ASKS_ORDER_BOOK': 
			let newState = action.newAsksData;
			let priceExists = false;

			if (state.length > 0) {
				state.map(function(row, index){
					if (state[index].price && newState.price && (state[index].price === newState.price)) {
						//Price already exists, so it should only update current row.
						priceExists = true;
						state[index].count = newState.count;
						state[index].amount = newState.amount;
					}
				})
			}
			
			if (priceExists === true) {
				priceExists = false;
				return state.slice()
			}
			else{
					let newStateCombined = [...state, newState];
					//Sort form lowest to highest price before returning.
					newStateCombined.sort(function(a, b){
					    return a.price - b.price;
					});

					if (newStateCombined.length > 50) {
						newStateCombined.pop();
					}

					if (newStateCombined.length > 0) {
						newStateCombined.map(function(row, index){
							if (!row || row.count === 0) {
								newStateCombined.splice(index, 1);
							}

							if (!row || row.amount > 0) {
								newStateCombined.splice(index, 1);
							}
							row.amount = row.amount;
						});

						newStateCombined.map(function(row, index){
							if (newStateCombined[index - 1] && newStateCombined[index - 1].total) {
								newStateCombined[index].total = (parseFloat(newStateCombined[index - 1].total) + Math.abs(parseFloat(row.amount))).toFixed(2);
							}
							else{
								newStateCombined[index].total = Math.abs(parseFloat(row.amount).toFixed(2));
							}
						});
					}
					
					return newStateCombined;
				}
			break;

			case 'CLEAR_ASKS': 
				return action.newAsksData;
			break;

		default:
      		return state.slice()
	}
}