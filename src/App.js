import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Container from 'react-bootstrap/lib/Container';
import OrderBook from './containers/OrderBook';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './store/reducers';

import './App.css';

const createStoreWithMiddleware = applyMiddleware()(createStore);

class App extends Component {



  componentDidMount(){

    // let bookRequest = JSON.stringify({ 
    //   event: 'subscribe', 
    //   channel: 'book', 
    //   symbol: 'tBTCUSD' 
    // })
      
    // const ws = new Sockette('wss://api.bitfinex.com/ws/2', {
    //   timeout: 5e3,
    //   maxAttempts: 10,
    //   onopen: onConnectionEstablished,
    //   onmessage: onMessageRecieved,
    //   onreconnect: e => console.log('Reconnecting...', e),
    //   onmaximum: e => console.log('Stop Attempting!', e),
    //   onclose: e => onConnectionClosed,
    //   onerror: e => console.log('Error:', e)
    // });
    
    // function onConnectionEstablished(e){
    //   console.log('connected');
    //   console.log(e);
    //   ws.send(bookRequest);
    // }

    // function onConnectionClosed(e){
    //   console.log('closed');
    // }

    // function onMessageRecieved(e){
    //     console.log('got a new message!');
    //     console.log(e);
    // }

    // // ws.close(); // graceful shutdown

    // // Reconnect 10s later
    // setTimeout(ws.reconnect, 10e3);
  }

  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <div className="App">
          <OrderBook/>
        </div>
      </Provider>
    );
  }
}

export default App;
