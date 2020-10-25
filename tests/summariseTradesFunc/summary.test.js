const {
  getDay,
  checkProfitNotNull,
  getNumberOfBuySellOrders,
  getTradesOnSameDay,
  getProfitOfTradesOnSameDay,
  getSum,
  sortTrades
} = require("../../summariseTradesFunc/summary");
const { trades, tradesComplete } = require('../dummyTradeData')


test('Should get correct day', ( ) => {
    const day = getDay('2020-07-16', false)
    expect(day).toBe('Thursday')
})

test('Should get correct date is not given', ( ) => {
    const day = getDay(undefined, true)
    expect(day).toBe("Thursday")
})

test('Should return trade with null profit', ( ) => {
    const tradesWithProfit = checkProfitNotNull(trades)
    expect(tradesWithProfit.length).toBe(2)
})

test('Should get the number of buy orders', ( ) => {
    const { buyOrders } = getNumberOfBuySellOrders(trades)
    console.log(buyOrders)
    expect(buyOrders).toBe(3)
})

test('Should get the number of sell orders', ( ) => {
    const { sellOrders } = getNumberOfBuySellOrders(trades)
    expect(sellOrders).toBe(2);
})

test('Should get the currency pairs of buy trades', ( ) => {
    const { currencyPairs } = getNumberOfBuySellOrders(trades)
    expect(currencyPairs.buyCurrencyPairs).toEqual(['goldmicro', 'eurjpymicro', 'eurusdmicro'])
})

test('Should get the currency pairs of sell trades', ( ) => {
    const { currencyPairs } = getNumberOfBuySellOrders(trades)
    expect(currencyPairs.sellCurrencyPairs).toEqual(['nzdjpymicro', 'audusdmicro'])
})

test('Should get dates of trades occurring on this day', ( ) => {
    const tradesDate = getTradesOnSameDay(trades)
    expect(tradesDate).toEqual(["2020-07-16", "2020-07-16"]);
})

test('Should get trades occurring on this day', ( ) => {
    const tradesOnSameDay = getTradesOnSameDay(trades)
    const { tradesSame } = getProfitOfTradesOnSameDay(trades, tradesOnSameDay);
    console.log(tradesSame)
    expect(tradesSame).toEqual([
      {
        _id: "jnkvrhcbvyurgcjh898grhc",
        comments: ["Good trade"],
        date: "2020-07-16",
        orderType: "sell",
        lotSize: 0.3,
        currencyPair: "nzdjpymicro",
        profit: 1.23,
        description: "ian & kush idea",
      },
      {
        _id: "5f0ee741836fe33480a537da",
        comments: [],
        date: "2020-07-16",
        orderType: "buy",
        lotSize: 0.14,
        currencyPair: "eurjpymicro",
        profit: 0.12,
        description: "babypips",
      },
    ])
    expect(tradesSame.length).toBe(2)
})

test("Should get trades occurring on this day", () => {
  const tradesOnSameDay = getTradesOnSameDay(trades);
  const { totalProfitOnSameDay } = getProfitOfTradesOnSameDay(trades, tradesOnSameDay);
  expect(totalProfitOnSameDay).toEqual(1.35)
});

test("Should get sum of all trades", () => {
  expect(getSum(trades)).toEqual(1.25)
});

test('Should sort trades', ( ) => {
    console.log(sortTrades(trades, "profit"))
    expect(sortTrades(tradesComplete, "profit")).toEqual([
      {
        _id: "jnkvrhcbvyurgcjh898grhc",
        comments: ["Good trade"],
        date: "2020-07-16",
        orderType: "sell",
        lotSize: 0.3,
        currencyPair: "nzdjpymicro",
        profit: 1.23,
        description: "ian & kush idea",
      },
      {
        _id: "5f0ee741836fe33480a537da",
        comments: [],
        date: "2020-06-17",
        orderType: "buy",
        lotSize: 0.2,
        currencyPair: "goldmicro",
        profit: 0.67,
        description: "No comment",
      },
      {
        _id: "bduyfrgvcyrfg8473889r",
        comments: [],
        date: "2020-07-14",
        orderType: "sell",
        lotSize: 0.14,
        currencyPair: "audusdmicro",
        profit: 0.26,
        description: "Harmonic Patterns",
      },
      {
        _id: "5f0ee741836fe33480a537da",
        comments: [],
        date: "2020-07-16",
        orderType: "buy",
        lotSize: 0.14,
        currencyPair: "eurjpymicro",
        profit: 0.12,
        description: "babypips",
      },
      {
        _id: "y3rfgrfng87t5885ngyvf",
        comments: [],
        date: "2020-07-14",
        orderType: "buy",
        lotSize: 0.09,
        currencyPair: "eurusdmicro",
        profit: -0.1,
        description: "No comment",
      },
    ]);
})

test("Should sort trades by lotSize", () => {
  console.log(sortTrades(tradesComplete, "lotSize"));
  expect(sortTrades(tradesComplete, "lotSize")).toEqual([
    {
      _id: "jnkvrhcbvyurgcjh898grhc",
      comments: ["Good trade"],
      date: "2020-07-16",
      orderType: "sell",
      lotSize: 0.3,
      currencyPair: "nzdjpymicro",
      profit: 1.23,
      description: "ian & kush idea",
    },
    {
      _id: "5f0ee741836fe33480a537da",
      comments: [],
      date: "2020-06-17",
      orderType: "buy",
      lotSize: 0.2,
      currencyPair: "goldmicro",
      profit: 0.67,
      description: "No comment",
    },
    {
      _id: "bduyfrgvcyrfg8473889r",
      comments: [],
      date: "2020-07-14",
      orderType: "sell",
      lotSize: 0.14,
      currencyPair: "audusdmicro",
      profit: 0.26,
      description: "Harmonic Patterns",
    },
    {
      _id: "5f0ee741836fe33480a537da",
      comments: [],
      date: "2020-07-16",
      orderType: "buy",
      lotSize: 0.14,
      currencyPair: "eurjpymicro",
      profit: 0.12,
      description: "babypips",
    },
    {
      _id: "y3rfgrfng87t5885ngyvf",
      comments: [],
      date: "2020-07-14",
      orderType: "buy",
      lotSize: 0.09,
      currencyPair: "eurusdmicro",
      profit: -0.1,
      description: "No comment",
    },
  ]);
});

