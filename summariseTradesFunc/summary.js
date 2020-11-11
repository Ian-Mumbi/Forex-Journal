const moment = require('moment')

module.exports = {
  sortTrades: (trades, sortBy = "profit") => {
    return trades.sort((a, b) => {
      if (sortBy === "date") {
        if (moment(a[sortBy]).valueOf() < moment(b[sortBy]).valueOf()) {
          return 1;
        } else {
          return -1;
        }
      }

      if (a[sortBy] < b[sortBy]) {
        return 1;
      } else {
        return -1;
      }
    });
  },

  getSum: (trades) =>
    trades
      .map((trade) => trade.profit)
      .reduce((prev, curr) => prev + curr, 0)
      .toFixed(2),

  getTradesOnSameDay: (trades) =>
    trades
      .map((trade) => trade.date)
      .filter((tradeDate) => moment(tradeDate).day() === moment().day()),

  getProfitOfTradesOnSameDay: (trades, tradesOnSameDay) => {
    // Find the trades that occurred on the same day and have a valid profit number i.e ot equal to 0
    const tradesSame = trades.filter((trade) => {
      if (trade.profit !== 0) {
        return tradesOnSameDay.includes(trade.date);
      }
    });

    const totalProfitOnSameDay = tradesSame
      .map((trade) => trade.profit)
      .reduce((prev, curr) => prev + curr, 0)
      .toFixed(2);

    return { tradesSame, totalProfitOnSameDay };
  },

  getNumberOfBuySellOrders: (trades) => {
    const buySellOrders = trades.map((trade) => trade.orderType);

    const buyCurrencyPairs = trades
      .filter((trade) => trade.orderType.toUpperCase() === "BUY")
      .map((trade) => trade.currencyPair);

    const sellCurrencyPairs = trades
      .filter((trade) => trade.orderType.toUpperCase() === "SELL")
      .map((trade) => trade.currencyPair);

    let buyOrders = buySellOrders
      .map((order) => order.toUpperCase() === "BUY")
      .reduce((prev, curr) => prev + curr, 0);
    if (buyOrders === true) {
      buyOrders = 1;
    } else if (buyOrders === false) {
      buyOrders = 0;
    }
    const sellOrders = buySellOrders.length - buyOrders;

    return {
      buyOrders,
      sellOrders,
      currencyPairs: { buyCurrencyPairs, sellCurrencyPairs },
    };
  },

  prettyPrintTrades: (trades) => {
    let myCounts = {};
    for (let i = 0; i < trades.length; i++) {
      let len = trades.filter((trade) => trade === trades[i]).length;
      myCounts[trades[i]] = len;
    }
    let summary = ``;
    Object.keys(myCounts).forEach((trade) => {
      summary += `${trade}(x ${myCounts[trade]}) `;
    });
    return summary;
  },

  checkProfitNotNull: (trades) => trades.filter((trade) => !trade.profit), // Check where profit is not present

  getDay: (date, noDate = false) => {
    const daysOfWeek = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };
    if (noDate && !date) {
      return daysOfWeek[moment(date).day()];
    }
    return daysOfWeek[moment().day()];
  },
  getNumberOfProfitOrLossTrades: (trades) => {
    const numberOfProfitTrades = trades.filter((trade) => trade.profit > 0)
      .length;
    const numberOfLossTrades = trades.filter((trade) => trade.profit <= 0)
      .length;
    return { profit: numberOfProfitTrades, loss: numberOfLossTrades };
  },
  getLotTotalAndAverage: (trades) => {
    const lots = trades.map((trade) => trade.lotSize);
    const totalLots = lots.reduce((prev, curr) => prev + curr, 0).toFixed(2);
    const avgLots = (totalLots / lots.length).toFixed(2);
    return {
      totalLots,
      avgLots: lots.length > 0 || totalLots > 0 ? avgLots : 0,
    };
  },
  // Get unique items from an array
  // getNumberOfUniqueTrades: (trades) => trades.map(( trade ) => trade.currencyPair ).filter( ( trade, index, array ) => array.indexOf(trade) === index ).length,
  getNumberOfUniqueTrades: (trades) =>
    new Set(trades.map((trade) => trade.currencyPair)).size,
};