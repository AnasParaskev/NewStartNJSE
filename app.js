
//Necessary required tools
const express = require('express');
const app = express();
const path = require ('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
//const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');

//const cookie = require('cookie-parser);
//app.use(cookieParser());


mongoose.connect('mongodb://localhost:27017/aek', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});





app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'))






app.use(express.urlencoded({ extended: true }));
//app.use(methodOverride('_method'));
//app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);




app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})












//const User = require('./models/user');
//const userRoutes = require('./routes/users');
//const { search } = require('./routes/users');


//Database connection
//mongoose.connect('mongodb://localhost:27017/aek', {useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true});
//const db = mongoose.connection;
//db.on("error", console.error.bind(console,"connection error:"))
//db.once("open", () => {
  //  console.log("Database connected");
//})




//app.use('/', userRoutes);




//Passport libraries
//app.use(passport.initialize());
//app.use(passport.session());
//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());




//const sessionConfig = {
  //  secret: 'thisshouldbeabettersecret!',
  //  resave: false,
  //  saveUnitialized: true,
  //  cookie: {
  //      httpOnly: true,
  //      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  //      maxAge: 1000 * 60 * 60 * 24 * 7
 //   }
//}
//app.use(session(sessionConfig))

//app.use(flash());


//middleware for every single request
//app.use((req,res,next) => {
  //  res.locals.success = req.flash('success');
   // res.locals.error = req.flash('error');
  //  next();
//})


//app.get('/', (req,res) => {
  //  res.render('home')
//})


//app.use((err,req,res,next)=>{
 //   res.send('Something went wrong!')
//})

//application listening to server
//app.listen(3000, (req,res)=> {
  //  console.log('Serving on port 3000')
//})