const express = require('express'),
      moment = require('moment')


const Trade = require('../../../models/trades'),
      Comment = require('../../../models/comment')

const isLoggedInMiddleware = require("../../../middleware/isLoggedIn"),
  isOwnerOfTradeMiddleware = require("../../../middleware/isOwnerOfTrade");

const { sortTrades } = require("../../summariseTradesFunc/summary");

const router = new express.Router()

router.get("/trades", isLoggedInMiddleware, async (req, res) => {
  try {

        const trader = { id: req.user._id, username: req.user.username };
        let trades = await Trade.find({ trader });

        if (req.query.sortBy) {
          trades = sortTrades(trades, req.query.sortBy);
        }
        res.render("trades/trades", {
          trades,
          user: req.user,
          sortBy: req.query.sortBy,
        });
      } catch (e) {
    res.status(400).send({ error: "Error rendering the trades." });
  }
});

router.post("/trades", isLoggedInMiddleware, async (req, res) => {
  try {
    const trader = {
      id: req.user._id,
      username: req.user.username,
    };

    // Control trade inputs before creating a new trade
    const tradeInputFromUser = { ...req.body }

    tradeInputFromUser.currencyPair = tradeInputFromUser.currencyPair.toUpperCase();
    tradeInputFromUser.orderType = tradeInputFromUser.orderType.toUpperCase();
    console.log('tradeInputFromUser', tradeInputFromUser)
    const trade = new Trade({ ...tradeInputFromUser, trader });
    console.log('Actual trade', trade)
    await trade.save();
    res.redirect("/trades");
  } catch (e) {
    res.status(400).send({ error: "Error in /trades route.", message: e });
  }
});

router.get("/trades/new", isLoggedInMiddleware, async (req, res) => {
  try {
    res.render("trades/tradeForm");
  } catch (e) {
    res.status(400).send({ error: "Error rendering trade form.", message: e });
  }
});

router.get("/trades/:id", isOwnerOfTradeMiddleware, async (req, res) => {
  try {
    let toggler = false;

    let tradeToView = await Trade.findById(req.params.id);

    const trader = { id: req.user._id, username: req.user.username };

    let trades = await Trade.find({ trader });

    let sortBy = undefined;

    if (req.query.sort) {
      trades = sortTrades(trades, req.query.sort);
      sortBy = req.query.sort;
    } else {
      trades = sortTrades(trades);

      sortBy = "profit";
    }

    const index = trades.findIndex((trade) => trade.equals(tradeToView));

    const date = moment(tradeToView.date).format('dddd, Do MMMM YYYY')

    const commentTime = moment().fromNow()

    await tradeToView.populate('comments').execPopulate().then((trade) => {
      
      console.log('TRADE', trade.comments.map(( c ) => moment(c.updatedAt).fromNow()))
      res.render("trades/trade-view", {
        trade,
        date,
        index: index + 1,
        sortBy,
        toggler: req.query.toggler,
        commentTime,
        commentTimeArray: trade.comments.map((c) =>
          moment(c.updatedAt).fromNow()
        ),
      });
    }).catch(e => console.log('error',e))

  } catch (e) {
    res
      .status(400)
      .send({ error: "Error finding that particular trade.", message: e });
  }
});

router.post("/trades/:id/summary", isOwnerOfTradeMiddleware, async (req, res) => {
  try {
    const sortBy = encodeURIComponent(req.body.sort);
    req.flash('success', 'Sorted by ' + sortBy.toUpperCase())
    res.redirect(
      "/trades/" + req.params.id + "?sort=" + sortBy + "&toggler=" + true
    );
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.get("/trades/:id/edit", isOwnerOfTradeMiddleware, async (req, res) => {
  try {
    const idOfTradeToEdit = req.params.id;
    const trade = await Trade.findById(idOfTradeToEdit);
    res.render("trades/trade-edit-form", { trade });
  } catch (e) {
    res
      .status(400)
      .send({
        error: "Error in /trades/" + req.params.id + "/edit route",
        message: e,
      });
  }
});

router.patch("/trades/:id/edit", isOwnerOfTradeMiddleware, async (req, res) => {
  try {
    const idOfTradeToBeUpdated = req.params.id;
    const updatedData = req.body;
    await Trade.findByIdAndUpdate(idOfTradeToBeUpdated, updatedData);
    req.flash('success', 'Trade updated!')
    res.redirect("/trades/" + req.params.id);
  } catch (e) {
    res
      .status(400)
      .send({
        error: "Error in /trades/" + req.params.id + "/edit POST route",
        message: e,
      });
  }
});

router.delete("/trades/:id", isOwnerOfTradeMiddleware, async (req, res) => {
  try {
    await Trade.findByIdAndDelete(req.params.id).then(( deletedTrade ) => {
      console.log('deletedTrade', deletedTrade)
      // Delete the associated comments for the trade being deleted.
      deletedTrade.comments.forEach(async ( comment ) => {
        await Comment.findByIdAndDelete(comment)
      })
    });
    res.redirect("/trades");
  } catch (e) {
    res
      .status(400)
      .send({ error: "Error deleting the particular trade", message: e });
  }
});

router.post('/trades/sortBy', ( req, res ) => {
  try {
    res.redirect('/trades?sortBy='+req.body.sort)
  } catch (e) {
    res.status(400).send('Error in the /trades/sortBy POST route.')
  }
})

module.exports = router