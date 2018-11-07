import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import Container from 'react-bootstrap/lib/Container';
import Sockette from 'sockette';

import BidsBook from '../components/OrderBook/BidsBook'
import AsksBook from '../components/OrderBook/AsksBook'
import TradesList from '../components/Trades/TradesList'

import {connect} from 'react-redux'
import updateBidsOrderBook from '../store/OrderBook/actions/update_bids'
import clearBidsOrderBook from '../store/OrderBook/actions/clear_bids'
import updateAsksOrderBook from '../store/OrderBook/actions/update_asks'
import clearAsksOrderBook from '../store/OrderBook/actions/clear_asks'
import updateTrades from '../store/Trades/actions/update_trades'
import {bindActionCreators} from 'redux'

import '../css/OrderBook.css';

let ws;
class OrderBook extends Component {

  constructor(props) {
      super(props);
    
      this.state = {
         connectionReady: true,
         isConnected: false,
         pres: 'P0',
         volume24h: 0,
         lastPrice: 0,
         priceChange: 0
      }
   }

  subscribeToAll(){
    const self = this;
    let payloadData = {};
    function onConnectionEstablished(e){
      console.log('connected');
      console.log(e);
      self.setState({connectionReady: true});
      let bookRequest = JSON.stringify({ 
        event: 'subscribe', 
        channel: 'book', 
        symbol: 'tBTCUSD',
        prec: self.state.pres
        // ,freq: 'F1' 
      })

      let tradesRequest = JSON.stringify({ 
        "event": "subscribe",
        "channel": "trades",
        "symbol": "tBTCUSD"
      })

      let tickerRequest = JSON.stringify({ 
        "event": "subscribe",
        "channel": "ticker",
        "symbol": "tBTCUSD"
      })

      ws.send(tickerRequest); 
      ws.send(tradesRequest); 
      ws.send(bookRequest); 
    }

    function onConnectionClosed(e){
      console.log('closed');
      console.log(e);
    }

    function onMessageRecieved(e){
        payloadData = JSON.parse(e.data);
        if (!payloadData.event && Array.isArray(payloadData[1]) && payloadData[1].length === 3) {
          //Is order book data
          let tmpbookOrderRow = {
            price: parseFloat(payloadData[1][0]).toFixed(1),
            count: payloadData[1][1],
            amount: parseFloat(payloadData[1][2]).toFixed(2),
            total: parseFloat(0).toFixed(2)
          }
          if (tmpbookOrderRow.amount > 0) {
            self.props.updateBidsOrderBook(tmpbookOrderRow);
          }
          else{
            self.props.updateAsksOrderBook(tmpbookOrderRow);
          }
        }

        if (!payloadData.event && Array.isArray(payloadData[2]) && payloadData.length === 3) {
          //Is trades data
          let tmpTradeArray = [];
          let tmpTrade = {
              price: parseFloat(payloadData[2][3]).toFixed(1),
              amount: payloadData[2][2],
              timestamp: payloadData[2][1],
              period: payloadData[2][0]
            }
            
            tmpTradeArray.push(tmpTrade);
            self.props.updateTrades(tmpTradeArray);
        }

        if (!payloadData.event && Array.isArray(payloadData[1]) && payloadData[1].length === 10) {
          //Is ticker data
          self.setState({
             //Volume in BTC.
             volume24h: payloadData[1][7],
             //Volume in USD.
             lastPrice: payloadData[1][0],
             priceChange: payloadData[1][5] * 100
          });
        }
    }
    ws = new Sockette('wss://api.bitfinex.com/ws/2', {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: onConnectionEstablished,
      onmessage: onMessageRecieved,
      onreconnect: e => console.log('Reconnecting...', e),
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => onConnectionClosed,
      onerror: e => console.log('Error:', e)
    });
    this.setState({isConnected: true});
  }

  closeConnection(){
    ws.close();
    this.setState({isConnected: false});
  }

  morePrecision(){
    this.closeConnection();
    this.props.clearBidsOrderBook();
    this.props.clearAsksOrderBook();
    const currentPres = this.state.pres;
    switch(currentPres){
      case 'P0':
        this.setState({pres: 'P1'});
        break;

      case 'P1':
        this.setState({pres: 'P2'});
        break;

      case 'P2':
        this.setState({pres: 'P3'});
        break;

      default:

        return;
    }

    this.subscribeToAll();
  }

  lessPrecision(){
    this.closeConnection();
    this.props.clearBidsOrderBook();
    this.props.clearAsksOrderBook();
    const currentPres = this.state.pres;
    switch(currentPres){
      case 'P3':
        this.setState({pres: 'P2'});
        break;

      case 'P2':
        this.setState({pres: 'P1'});
        break;

      case 'P1':
        this.setState({pres: 'P0'});
        break;

      default:

        return;
    }

    this.subscribeToAll();
  }

  formmatNumberWithCommas(currentNumber){
    return currentNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    let priceChangeColor = this.state.priceChange >= 0 ? 'rgba(82,108,46)' : 'rgba(139,42,2)';
    priceChangeColor = this.state.priceChange === 0 ? 'white' : priceChangeColor;

    let priceChangeSign = this.state.priceChange >= 0 ? ' +' : ' -';
    priceChangeSign = this.state.priceChange === 0 ? '' : priceChangeSign;

    return (
      <Container fluid={true}>
      <Row>
        <Col lg={12} className="buttons-container text-left">
          <div className="ticker-container text-left">
                  <h3>BTC/USD</h3>
                  <p>Last Price (USD): {this.formmatNumberWithCommas(this.state.lastPrice.toFixed(1))} / 24h VOL (BTC): {this.formmatNumberWithCommas(this.state.volume24h.toFixed(0))}</p>
                  <p style={{color: priceChangeColor}}>Price Change:{priceChangeSign} {this.state.priceChange.toFixed(2)}%</p>
                </div>
          <ButtonToolbar>
                <Button disabled={!this.state.connectionReady || this.state.isConnected} onClick={this.subscribeToAll.bind(this)}>Connect</Button>
                <Button  disabled={!this.state.isConnected} onClick={this.closeConnection.bind(this)}>Disconnect</Button>
          </ButtonToolbar>
        </Col>
      </Row>
            <Row>
              <Col lg={9}>
                <Container fluid={true}>
                      <Row>
                        <Col lg={12}>
                          <h3 className="text-left">ORDER BOOK BTC/USD</h3>
                          <ButtonToolbar style={{marginBottom: '20px'}}>  
                                 <p className="text-left">Precision:</p>
                                 <Button disabled={(this.props.orderBookAsks.length < 1 && this.props.orderBookBids.length < 1) || this.state.pres === 'P3'} onClick={this.morePrecision.bind(this)}>+</Button>
                                 <Button  disabled={(this.props.orderBookAsks.length < 1 && this.props.orderBookBids.length < 1) || this.state.pres === 'P0'} onClick={this.lessPrecision.bind(this)}>-</Button>
                          </ButtonToolbar>
                        </Col>
                        <Col lg={6} className='bids-container'>
                         <BidsBook orderBookBids={this.props.orderBookBids}/>
                        </Col>
                        <Col lg={6} className='asks-container'>
                         <div className="depth-bars-asks-container"></div>
                         <AsksBook orderBookAsks={this.props.orderBookAsks}/>
                        </Col>
                      </Row>
                </Container>
              </Col>
              <Col lg={3}>
                <Row>
                    <Col lg={12}>
                        <h3 className="text-left">TRADES BTC/USD</h3>
                    </Col>
                    <Col lg={12}>
                      <TradesList tradesList={this.props.tradesList}/>
                    </Col>
                </Row>
              </Col>
            </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    orderBookBids: state.orderBookBids,
    orderBookAsks: state.orderBookAsks,
    tradesList: state.tradesList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateAsksOrderBook: updateAsksOrderBook, 
      updateBidsOrderBook: updateBidsOrderBook, 
      updateTrades: updateTrades,
      clearBidsOrderBook: clearBidsOrderBook,
      clearAsksOrderBook: clearAsksOrderBook
    }, dispatch);
  }

export default connect(mapStateToProps, mapDispatchToProps)(OrderBook)