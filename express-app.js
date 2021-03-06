const path = require("path"),
  express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  flash = require("connect-flash"),
  localStrategy = require("passport-local");

const User = require("./models/user");

require("./DB/db");

// ROUTER
const homePageRouter = require("./src/routers/homePage/index"),
  tradesRouter = require("./src/routers/Trades/trades"),
  signupRouter = require("./src/routers/authentication/signup/signup"),
  loginRouter = require("./src/routers/authentication/login/login"),
  logoutRouter = require("./src/routers/authentication/logout/logout"),
  commentRouter = require("./src/routers/comments/comments"),
  profileRouter = require("./src/routers/profile/profile"),
  paymentRouter = require("./src/routers/payments/payments"),
  summaryRouter = require("./src/routers/Summary/summary"),
  terminalHistoryLogsRouter = require('./src/routers/terminalHistoryLogs/terminalHistoryLogs');

const app = express();

const publicDirectoryPath = path.resolve(__dirname, "public");

app.use(express.static(publicDirectoryPath));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(
  require("express-session")({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// WHOLE APPLICATION ROUTERS
app.use(homePageRouter);
app.use(tradesRouter);
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(commentRouter);
app.use(profileRouter);
app.use(summaryRouter);
app.use(paymentRouter);
app.use(terminalHistoryLogsRouter);

module.exports = app
