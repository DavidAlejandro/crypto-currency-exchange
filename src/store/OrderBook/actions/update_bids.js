function updateBidsOrderBook(newBidsData) {
  return {
    type: 'UPDATE_BIDS_ORDER_BOOK',
    newBidsData: newBidsData
  }
}
export default updateBidsOrderBook;