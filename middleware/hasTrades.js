const Trade = require('../models/trades')

module.exports = async ( req, res, next ) => {
    const trades = await Trade.find({})
    if (trades.length !== 0) {
        return next()
    }
    res.redirect('/')
}