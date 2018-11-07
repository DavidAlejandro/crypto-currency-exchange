function updateAsksOrderBook(newAsksData) {
  return {
    type: 'UPDATE_ASKS_ORDER_BOOK',
    newAsksData: newAsksData
  }
}
export default updateAsksOrderBook;