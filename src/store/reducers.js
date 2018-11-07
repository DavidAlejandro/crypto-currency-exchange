import { combineReducers } from 'redux';
import OrderBookBidsReducer from './OrderBook/reducers/bids'
import OrderBookAsksReducer from './OrderBook/reducers/asks'
import TradesReducer from './Trades/reducers/trades'

const rootReducer = combineReducers({
	orderBookBids: OrderBookBidsReducer,
	orderBookAsks: OrderBookAsksReducer,
	tradesList: TradesReducer
});

export default rootReducer;