const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: String,
  trader: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
}, {
  timestamps: true
});

commentSchema.virtual("trades", {
  ref: "Trade",
  localField: "_id",
  foreignField: "comments",
});

module.exports = mongoose.model('Comment', commentSchema)