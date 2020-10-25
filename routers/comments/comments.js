const express = require('express')

const isLoggedinMiddleware = require('../../middleware/isLoggedIn')
const isOwnerOfCommentMiddleware = require('../../middleware/isOwnerOfComment')

const Trade = require('../../models/trades')
const Comment = require('../../models/comment')

const router = new express.Router()

router.get('/trades/:id/comments/new', isLoggedinMiddleware, async ( req, res ) => {
    try {
        const tradeToAddComment = await Trade.findById(req.params.id)
        res.render('comments/comment-form', { trade: tradeToAddComment })
    } catch (e) {
        res.status(400).send('Error rendering the comment form.')
    }
})

router.post('/trades/:id/comments', isLoggedinMiddleware, async ( req, res ) => {
    try {
      const text = req.body.text
      console.log(req.body)
      const { username, _id } = req.user
      const newComment = new Comment({ text, trader: { username, id: _id } })
      const trade = await Trade.findById(req.params.id)

      trade.comments.push(newComment)

      await trade.save().then(async () => {
          await newComment.save()
          res.redirect('/trades/'+req.params.id)
      })
    } catch (e) {
      res.status(400).send("Error in /POST comment route");
    }
})

router.get('/trades/:tradeId/comments/:commentId/edit', isOwnerOfCommentMiddleware, async ( req, res ) => {
    try {
        const { tradeId, commentId } = req.params
        const trade = await Trade.findById(tradeId)
        const commentToEdit = await Comment.findById(commentId)
        res.render('comments/comment-edit-form', { trade, comment: commentToEdit })
    } catch (e) {
     res.status(400).send('Error in edit comment route.')   
    }
})

router.patch("/trades/:tradeId/comments/:commentId", isOwnerOfCommentMiddleware, async ( req, res ) => {
    try {
        const updatedCommentText = req.body.text
        const commentToUpdate = req.params.commentId

        await (await Comment.findByIdAndUpdate(commentToUpdate, { text: updatedCommentText })).save()
        res.redirect('/trades/' + req.params.tradeId)
    } catch (e) {
        res.status(400).send('Error in /POST route to update the comment.')
    }
});

router.delete('/trades/:tradeId/comments/:commentId', isOwnerOfCommentMiddleware, async ( req, res ) => {
    try {
        await Comment.findOneAndDelete(req.params.commentId)
        res.redirect('/trades/' + req.params.tradeId)
    } catch (e) {
        res.status(400).send('Error in /DELETE comment route.')
    }
})

module.exports = router