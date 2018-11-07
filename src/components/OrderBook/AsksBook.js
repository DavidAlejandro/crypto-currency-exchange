import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';

class AsksBook extends Component {

  constructor(props) {
      super(props);
    
      this.state = {
         zoom: 1
      }
   }

  renderAskRows(){
    let self = this;
    if (!this.props.orderBookAsks) {
      return <h2>Loading...</h2>
    }
    return this.props.orderBookAsks.map(function(row, index){
      let amountAbs = Math.abs(row.amount);
      return (      <tr key={row.price}>
                      <td style={{display: (index > 23 ? 'none' : 'initial'), position: 'absolute', left: '0px', background: 'rgba(139,42,2, 0.3)', width: `calc(${(100 * row.total/self.props.orderBookAsks[self.props.orderBookAsks.length - 1].total).toFixed(0)*self.state.zoom}% - 20px)`, height: '37px'}}></td>
                      <td className='text-right'>{row.price}</td>
                      <td className='text-right'>{row.total}</td>
                      <td className='text-right'>{amountAbs}</td>
                      <td className='text-center'>{row.count}</td>
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
               <Button disabled={this.props.orderBookAsks.length < 1 || this.state.zoom < 0.21} onClick={this.zoomOut.bind(this)}>Zoom Out</Button>
               <Button  disabled={this.props.orderBookAsks.length < 1 || this.state.zoom === 1} onClick={this.zoomIn.bind(this)}>Zoom In</Button>
        </ButtonToolbar>
            <Table responsive>
                  <thead>
                    <tr>
                      <th></th>
                      <th className='text-right' style={{width: '50px'}}>PRICE</th>
                      <th className='text-right'>TOTAL</th>
                      <th className='text-right'>AMOUNT</th>
                      <th className='text-center'>COUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderAskRows()}
                  </tbody>
                </Table>
        </div>
    );
  }
}

export default AsksBook;
