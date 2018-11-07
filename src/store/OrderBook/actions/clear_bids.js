function clearBidsOrderBook(newBidsData) {
  return {
    type: 'CLEAR_BIDS',
    newBidsData: []
  }
}
export default clearBidsOrderBook;