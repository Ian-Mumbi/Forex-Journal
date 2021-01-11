const path = require('path')
const fs = require('fs')

const express = require('express')
const multer = require('multer')

const Trade = require('../../../models/trades')

const isLoggedInMiddleware = require('../../../middleware/isLoggedIn')

const appendData = require('../../logHistoryDataProcessor/csvToArray')
const cleanData = require('../../logHistoryDataProcessor/cleanData')

const router = new express.Router()

const upload = multer({
  dest: 'uploads/',
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(|csv|txt)$/)) {
      return callback(
        new Error("Log file must be either a .csv or .txt file.")
      );
    }
    callback(undefined, true);
  },
});

router.get('/logs', isLoggedInMiddleware, ( req, res ) => {
    res.render('terminalHistoryLogs/terminalHistoryLogs')
})

router.post('/logs', isLoggedInMiddleware, upload.single('logFile'), async ( req, res ) => {
    const data = await appendData(req.file.path)
    console.log('DATA', data)
    const dataCleaned = cleanData(data)

    const trader = {
      id: req.user._id,
      username: req.user.username,
    };

    const trades = await Trade.find({ trader })

    // Delete the file in the upload folder after data has been saved
    fs.unlink(req.file.path, ( err ) => {
      err ? console.log('FAILED TO DELETE FILE') : console.log('FILE DELETED SUCCESSFULLY!!!!')
    })     
    const nonDuplicateTrades =  dataCleaned.filter((tradeLog) => {
      if (trades.length > 0) {
        // If there are some trades in the DB for the user, I want to check that the trade being passed 
        // in is not already in the DB.
        // Every trade in DB should not match the tradeLog
        return trades.every(( trade ) => {
          const duplicateCondition = String(tradeLog.date) === String(trade.date) &&
            Number(tradeLog.profit) === Number(trade.profit) &&
            String(tradeLog.currencyPair).toLowerCase() === String(trade.currencyPair).toLowerCase() &&
            String(tradeLog.description).toLowerCase() === String(trade.description).toLowerCase() &&
            Number(tradeLog.lotSize) === Number(trade.lotSize) &&
            String(tradeLog.orderType).toLowerCase() === String(trade.orderType).toLowerCase()

            return !duplicateCondition // Every trade in DB must not match excatly the tradeLog
        }, tradeLog)
      } else if ( trades.length === 0 ) {
        // If the user has no trades, then dataCleaned === nonDuplicateTrades
        return true
      }
    })

    console.log('DATA CLEANED: ', dataCleaned.length)
    console.log('USER TRADES: ', trades.length)
    console.log("NO DUPLICATE TRADES: ", nonDuplicateTrades.length);

    nonDuplicateTrades.forEach( async (trade) => {
      const logTrade = new Trade({ ...trade, trader });
      await logTrade.save();
    })
    
    req.flash('success', 'Your manual trades have been saved successfully')
    
    return res.redirect('/trades')
}, ( error, req, res, next ) => {
    req.flash("error", error.message);
    res.redirect('/profile')
})

// Provide user with downloadable mql4/mql5 file 
router.get('/download', ( req, res ) => {
  const file = path.resolve(__dirname, '../../../public/resources/History To CSV.ex4')
  res.download(file)
})

module.exports = router