const express = require('express')
const passport = require('passport')

const router = new express.Router()

router.get("/login", (req, res) => {
  try {
    res.render("./authorization/login");
  } catch (e) {
    res.status(400).send("Error loading login form.");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/trades",
  })
);

module.exports = router