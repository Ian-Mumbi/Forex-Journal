const express = require('express')

const isLoggedInMiddleware = require('../../../middleware/isLoggedIn')

const router = new express.Router()

router.get("/logout", isLoggedInMiddleware, (req, res) => {
  try {
    req.logout();
    res.redirect("/trades");
  } catch (e) {
    res.status(400).send("Error in /logout route");
  }
});

module.exports = router