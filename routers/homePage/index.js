const express = require('express')
const router = new express.Router()

router.get("/", async ( req, res ) => {
  try {
    res.render("home/index");
  } catch (e) {
    res.status(400).send({ error: "Error in rendering home page" });
  }
}); 

module.exports = router
