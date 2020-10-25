const Comment = require('../models/comment')

module.exports = async ( req, res, next ) => {
    if (req.isAuthenticated()) {
        await Comment.findById(req.params.commentId).then( comment => {
            if (comment.trader.id.equals(req.user._id)) {
                next()
            } else {
                res.render('/trades/' + req.params.tradeId)
            }
        }).catch(( e ) => res.render('trades'))
    } else {
        res.render('/trades/' + req.params.tradeId)
    }
}