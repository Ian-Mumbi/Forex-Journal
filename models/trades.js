const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
  description: String,
  currencyPair: String,
  profit: Number,
  orderType: String,
  lotSize: Number,
  date: String,
  trader: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model("Trade", tradeSchema);