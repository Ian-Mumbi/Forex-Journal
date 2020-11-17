const express = require('express')
const passport = require('passport')
const User = require("../../../../models/user");
const signUpEmail = require("../../../../emails/accounts");

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
        console.log('SIGNUP ERROR', error)
        req.flash('error', error.message)
        return res.redirect("/signup");
      }

      passport.authenticate("local")(req, res, () => {
        // signUpEmail.signUpEmail(email, username)
        req.flash('success', 'Successfully signed up! Welcome ' + username)
        res.status(200).redirect("/trades");
      });
    });
  } catch (e) {
    res
      .status(400)
      .send({ error: "Error in the /POST route when signing up." });
  }
});

module.exports = router