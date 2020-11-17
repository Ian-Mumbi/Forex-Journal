const express = require('express')
const moment = require('moment')


const Trade = require("../../../models/trades");
const hasTrades = require("../../../middleware/hasTrades");

const isLoggedInMiddleware = require("../../../middleware/isLoggedIn");
const {
  getSum,
  getTradesOnSameDay,
  getProfitOfTradesOnSameDay,
  getNumberOfBuySellOrders,
  checkProfitNotNull,
  getDay,
  prettyPrintTrades,
} = require("../../summariseTradesFunc/summary");

const router = new express.Router()

router.get('/summary', isLoggedInMiddleware, hasTrades, async ( req, res ) => {
    try {
        const trader = { id: req.user._id, username: req.user.username };

        let trades = await Trade.find({ trader });
        console.log(trades)

        const numberOfZeroProfitTrades = checkProfitNotNull(trades).length;

        const validTrades = trades.length - numberOfZeroProfitTrades

        const totalProfit = getSum(trades)

        const tradesOccurredToday = getTradesOnSameDay(trades)

        let numberOftradesOnSameDay,
          dayOfTrade,
          totalProfitOnSameDay,
          tradesOnSameDay,
          buyOrders,
          sellOrders,
          currencyPairs,
          buyPairs,
          sellPairs;

        if ( tradesOccurredToday.length !== 0 ) {
          numberOftradesOnSameDay = tradesOccurredToday.length;

          dayOfTrade = getDay(tradesOccurredToday[0].date)

          totalProfitOnSameDay = getProfitOfTradesOnSameDay(
            trades,
            tradesOccurredToday
          ).totalProfitOnSameDay;
        
          tradesOnSameDay = getProfitOfTradesOnSameDay( trades, tradesOccurredToday ).tradesSame

          buyOrders = getNumberOfBuySellOrders(tradesOnSameDay).buyOrders
          sellOrders = getNumberOfBuySellOrders(tradesOnSameDay).sellOrders
          currencyPairs = getNumberOfBuySellOrders(tradesOnSameDay).currencyPairs
          buyPairs = prettyPrintTrades(currencyPairs.buyCurrencyPairs)
          sellPairs = prettyPrintTrades(currencyPairs.sellCurrencyPairs);

        } else {
          dayOfTrade = getDay(undefined, true)
        }

        res.render("summaryViews/summary", {
          numTrades: trades.length,
          numberOfZeroProfitTrades,
          validTrades,
          totalProfit,
          numberOftradesOnSameDay,
          totalProfitOnSameDay,
          buyOrders, 
          sellOrders,
          dayOfTrade,
          currencyPairs,
          buyPairs,
          sellPairs
        });
    } catch (e) {
        res.status(400).send('Error in summary page.')
    }
})


module.exports = router