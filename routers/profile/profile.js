const express = require('express')
const multer = require('multer')

const User = require('../../models/user')

const isLoggedInMiddleware = require('../../middleware/isLoggedIn')

const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter( req, file, callback ) {
        if ( !file.originalname.match(/\.(|jpeg|png|jpg)$/) ) {
            return callback(new Error('Image file must be either a .jpg, .png or .jpeg file'))
        }
        callback(undefined, true)
    }
})

router.get('/upload', ( res, req ) => {
    try {
        res.send('user/profile-page')
    } catch (e) {
        res.status(400).send('Error in /upload GET')
    }
})

router.post('/upload', isLoggedInMiddleware, upload.single('uploaded_file'), async ( req, res ) => {
    try {
        console.log(currentUser)
        // console.log(req.file)
        res.send()
    } catch (e) {
        res.status(400).send()
    }
}, ( error, req, res, next ) => {
    res.status(400).send({ error: error.message })
})

router.get('/profile',  isLoggedInMiddleware, ( req, res ) => {
    try {
        res.render('user/profile-page')
    } catch (e) {
        res.status(400).send('Error loading your profile page! We will fix this now!!')
    }
}) 

module.exports = router