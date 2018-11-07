function clearAsksOrderBook(newAsksData) {
  return {
    type: 'CLEAR_ASKS',
    newAsksData: []
  }
}
export default clearAsksOrderBook;