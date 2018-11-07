import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';

class BidsBook extends Component {

  constructor(props) {
      super(props);
    
      this.state = {
         zoom: 1
      }
   }

  renderBidRows(){
    let self = this;
    if (!this.props.orderBookBids) {
      return <h2>Loading...</h2>
    }
    return this.props.orderBookBids.map(function(row, index){
      return (      <tr className="bids-row" key={row.price}>
                      <td style={{display: (index > 23 ? 'none' : 'initial'), position: 'absolute', right: '0px', background: 'rgba(82,108,46, 0.3)', width: `calc(${(100 * row.total/self.props.orderBookBids[self.props.orderBookBids.length - 1].total).toFixed(0)*self.state.zoom}% - 20px)`, height: '37px'}}></td>
                      <td className='text-center'>{row.count}</td>
                      <td className='text-right'>{row.amount}</td>
                      <td className='text-right'>{row.total}</td>
                      <td className='text-right'>{row.price}</td>
                    </tr>)
    });
  }

  componentDidMount(){
  }

  zoomOut(){
    this.setState({zoom: this.state.zoom - 0.20})
  }

  zoomIn(){
    this.setState({zoom: this.state.zoom + 0.20})
  }

  render() {
    return (
      <div>
        <ButtonToolbar style={{marginBottom: '20px'}}>
               <Button disabled={this.props.orderBookBids.length < 1 || this.state.zoom < 0.21} onClick={this.zoomOut.bind(this)}>Zoom Out</Button>
               <Button  disabled={this.props.orderBookBids.length < 1 || this.state.zoom === 1} onClick={this.zoomIn.bind(this)}>Zoom In</Button>
        </ButtonToolbar>
                        <Table responsive>
                        <thead>
                          <tr>
                            <th></th>
                            <th className='text-center'>COUNT</th>
                            <th className='text-right'>AMOUNT</th>
                            <th className='text-right'>TOTAL</th>
                            <th className='text-right'>PRICE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.renderBidRows()}
                        </tbody>
                      </Table>
      </div>
            
    );
  }
}

export default BidsBook;
