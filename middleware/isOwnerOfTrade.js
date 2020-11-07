const Trade = require('../models/trades')

module.exports = async ( req, res, next ) => {
    if (req.isAuthenticated()) {
        await Trade.findById(req.params.id).then(( trade ) => {
            // Check if the current user is the owner of the trade
            if (trade.trader.id.equals(req.user._id)) {
                next()
            } else {
                res.redirect('/trades')
            }
        }).catch( ( e ) => {
           res.redirect("/trades");
        })
    } else {
        res.redirect("/trades");
    }
}