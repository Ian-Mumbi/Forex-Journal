const express = require('express')
const passport = require('passport')
const User = require('../../../models/user')

const router = new express.Router()

router.get("/signup", (req, res) => {
  try {
    res.render("authorization/signup");
  } catch (e) {
    res.status(400).send({ error: "Error rendering the signup form." });
  }
});

router.post("/signup", (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = new User({ username, email });
    
    User.register(newUser, password, (error, user) => {
      if (error) {
        console.log(error)
        return res.render("authorization/signup");
      }

      passport.authenticate("local")(req, res, () => {
        res.redirect("/trades");
      });
    });
  } catch (e) {
    res
      .status(400)
      .send({ error: "Error in the /POST route when signing up." });
  }
});

module.exports = router