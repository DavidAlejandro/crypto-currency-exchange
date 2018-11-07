import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table';

class TradesList extends Component {

  renderTradesRows(){

    let self = this;
    let counter = 0;

    if (!this.props.tradesList) {
      return <h2>Loading...</h2>
    }
    return this.props.tradesList.map(function(row, index){
      let uniqueId = row.period + row.timestamp + row.amount + counter;
      uniqueId = uniqueId;
      if (self.props.tradesList[index - 1]) {
        uniqueId = uniqueId + (parseFloat(self.props.tradesList[index - 1].amount) + parseFloat(self.props.tradesList[index - 1].period) + self.props.tradesList[index - 1].timestamp);
        uniqueId = uniqueId + counter;
      }
      counter++;

      let amountAbs = Math.abs(row.amount).toFixed(4);
      let tradeType = row.amount > 0 ? 'buy' : 'sell';

      return (      <tr key={uniqueId} className={tradeType}>
                      <td className='text-right'>{row.formattedTimestamp}</td>
                      <td className='text-right'>{row.price}</td>
                      <td className='text-right'>{amountAbs}</td>
                    </tr>)
    });
  }

  componentDidMount(){
  }

  render() {
    return (
            <Table responsive>
                  <thead>
                    <tr>
                      <th className='text-right'>TIME</th>
                      <th className='text-right'>PRICE</th>
                      <th className='text-right'>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderTradesRows()}
                  </tbody>
                </Table>
    );
  }
}

export default TradesList;
