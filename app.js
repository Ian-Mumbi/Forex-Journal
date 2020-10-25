const   path            = require('path'),
        express         = require('express'),
        bodyParser      = require('body-parser'),
        methodOverride  = require('method-override'),
        passport        = require('passport'),
        localStrategy   = require('passport-local');

const User              = require("./models/user");

require("./DB/db");

// ROUTER
const   homePageRouter  = require('./routers/homePage/index'),
        tradesRouter    = require('./routers/Trades/trades'),
        signupRouter    = require('./routers/authentication/signup/signup'),
        loginRouter     = require('./routers/authentication/login/login'),
        logoutRouter    = require('./routers/authentication/logout/logout'),
        commentRouter   = require('./routers/comments/comments'),
        profileRouter   = require('./routers/profile/profile'),
        summaryRouter   = require('./routers/Summary/summary');

const app = express()

const port = process.env.PORT || 3002

const publicDirectoryPath = path.resolve(__dirname, 'public')

app.use(express.static(publicDirectoryPath));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

app.use(methodOverride('_method'))

app.use(require('express-session')({
    secret: 'My mom and grandma are the best in the world. Lord help me take care of them financially soon.',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())

app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())

app.use(( req, res, next ) => {
    res.locals.currentUser = req.user
    next()
})

// WHOLE APPLICATION ROUTERS
app.use(homePageRouter)
app.use(tradesRouter)
app.use(signupRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(commentRouter)
app.use(profileRouter)
app.use(summaryRouter)

app.listen(port, ( ) => {
    console.log('App running on port ' + port + '!')
})