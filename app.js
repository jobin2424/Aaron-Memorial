if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate") // this is another npm package seperate from ejs. it is  useful for boilerplates instead of just using partials
const ExpressError = require('./utils/expressError')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const userRoutes = require('./routes/users')
const teamsRoutes = require('./routes/teams')
const playersRoutes = require('./routes/players');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
// const dbUrl = process.env.DB_URL
 const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/basketball-tournament'

// 'mongodb://localhost:27017/basketball-tournament'
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})



const app = express();

app.engine('ejs', ejsMate)  // multiple engines for ejs to run or parse, we used ejs-mate
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
  replaceWidth: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {

})

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const validateTeam = (req, res, next) => {
  const {error} = teamSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
  throw new ExpressError(msg, 400)
  } else {
  next()
}
}

app.use((req, res, next) => {
  if (![ '/login', '/' ].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})

app.use('/', userRoutes)
app.use('/teams', teamsRoutes)  
app.use('/teams/:id/players', playersRoutes)


app.get("/", (req, res) => {
  res.render("home");
});

app.get('/sponsors', async (req, res) => {
  res.render('sponsors')
})

app.get("/voting", async (req, res) => {
  res.render("voting/teamOne");
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = "Oh No, Something Went Wrong!"
  res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servicing on port ${port}`);
});
