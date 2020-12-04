module.exports = ( data ) => {
    let preprocessedData = []

    data.forEach( (trade) => {
      // Format the date to correct format
      trade.date = trade.date.split(" ")[0].split(".").join("-");
      trade.orderType = trade.orderType.toUpperCase()
      trade.currencyPair = trade.currencyPair.toUpperCase()

      preprocessedData.push(trade)
    })

    return preprocessedData
}