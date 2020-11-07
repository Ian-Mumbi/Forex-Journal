module.exports = ( req, res, next ) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error', "Please Login first!")
    res.redirect('/login')
}