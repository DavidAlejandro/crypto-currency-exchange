function updateTrades(newTradesData) {
  return {
    type: 'UPDATE_TRADES',
    newTradesData: newTradesData
  }
}
export default updateTrades;