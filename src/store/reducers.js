import { combineReducers } from 'redux';
import OrderBookBidsReducer from './OrderBook/reducers/bids'
import OrderBookAsksReducer from './OrderBook/reducers/asks'
import TradesReducer from './Trades/reducers/trades'
// import ActiveContactReducer from './reducer_active_contact'

const rootReducer = combineReducers({
	orderBookBids: OrderBookBidsReducer,
	orderBookAsks: OrderBookAsksReducer,
	tradesList: TradesReducer
	// ,activeContact: ActiveContactReducer
});

export default rootReducer;