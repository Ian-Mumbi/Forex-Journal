const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require("path");
const fs = require("fs");

const User = require('../../models/user')

const Trade = require('../../models/trades')

const Comment = require('../../models/comment')

const {getSum, 
    getNumberOfProfitOrLossTrades, 
    getLotTotalAndAverage,
    getNumberOfUniqueTrades
} = require('../../summariseTradesFunc/summary')

const isLoggedInMiddleware = require('../../middleware/isLoggedIn');

const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000000 
    },
    fileFilter( req, file, callback ) {
        if ( !file.originalname.match(/\.(|jpeg|png|jpg)$/) ) {
            return callback(new Error('Image file must be either a .jpg, .png or .jpeg file'))
        }
        callback(undefined, true)
    }
})

router.get('/profile', isLoggedInMiddleware, async ( req, res ) => {
    try {
        const trader = { id: req.user._id, username: req.user.username };
        const trades = await Trade.find({trader})
        const numberOfTrades = trades.length
        const profitOrLoss = getSum(trades)
        const numberOfProfitTrades = getNumberOfProfitOrLossTrades(trades).profit
        const numberOfLossTrades = getNumberOfProfitOrLossTrades(trades).loss
        const avgLotSize = getLotTotalAndAverage(trades).avgLots
        const totalLots = getLotTotalAndAverage(trades).totalLots
        const numberOfUniqueTrades = getNumberOfUniqueTrades(trades)

        res.render('user/profile-page', {user: req.user.username, userId: req.user._id, numberOfTrades, profitOrLoss,
        numberOfProfitTrades, numberOfLossTrades, avgLotSize, totalLots, numberOfUniqueTrades})
    } catch (e) {
        res.status(400).send('Error in /upload GET')
    }
})

router.post('/profile', isLoggedInMiddleware, upload.single('uploaded_file'), async ( req, res ) => {
    const bufferOfModifiedImage = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.profile = bufferOfModifiedImage;
    await req.user.save()
    req.flash('success', 'Profile updated successfully!')
    return res.redirect('/profile')
}, ( error, req, res, next ) => {
    req.flash("error", error.message);
    res.redirect('/profile')
})

router.get('/profile.png', async ( req, res ) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user || !user.profile) {
            if ( !user.profile ) {
                const imgPath = path.resolve(
                  __dirname,
                  "../../",
                  "public",
                  "images",
                  "default-profile.png"
                );
                const defaultImageBuffer = fs.readFileSync(imgPath);
                const defaultImageBufferModified = await sharp(defaultImageBuffer)
                  .resize({ width: 250, height: 250 })
                  .png()
                  .toBuffer();
                user.profile = defaultImageBufferModified;
                await user.save()

                res.set("Content-Type", "image/png");
                return res.send(user.profile)
            }
            throw new Error('User profile not found!')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.profile)
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
}) 

router.delete('/profile/delete', isLoggedInMiddleware, async ( req, res ) => {
    try {
        req.user.profile = undefined
        await req.user.save()
        res.redirect('/profile')
    } catch (e) {
        res.status(400).send('Error DELETING your profile photo. Please try again later.')
    }
})

router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)

    const trader = { id: deletedUser._id, username: deletedUser.username };

    const deletedTrades = await Trade.deleteMany({ trader })

    const deletedComments = await Comment.deleteMany({ trader })

    res.redirect("/");
  } catch (e) {
    res
      .status(400)
      .send({ error: "Error deleting the particular trade", message: e });
  }
});

module.exports = router