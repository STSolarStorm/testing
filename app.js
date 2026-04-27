// Load environment variables first
require('dotenv').config();
// app.js - Okay, this is the main setup file. Gotta get the server running.
// Need these basic Node modules for the server to function:
var createError = require('http-errors');   // Just helps throw standard errors like 404s easily
var express = require('express');           // The core framework, obviously
var path = require('path');
var cookieParser = require('cookie-parser'); // If we ever need to use cookies, this is essential
var logger = require('morgan');

// Bringing in the actual logic files
var indexRouter = require('./routes/index'); // This will handle the home page ('/')
var usersRouter = require('./routes/users'); // Placeholder for user-related stuff ('/users')
const session = require('express-session');

var app = express();

// Setting up the views:
app.set('views', path.join(__dirname, 'views')); // Tells Express "Look in the 'views' folder for templates."
app.set('view engine', 'pug');

//stuff that runs on every request
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Serve static files
// This line makes everything in 'public' like CSS, JS, images available to the browser.
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboardCat',
  resave: true,
  saveUninitialized: false,
  cookie:{
    secure: false,
    maxAge: 6*60*60*1000
  }
}));
const {passport} = require('./middleware/passport');
app.use(passport.initialize());
app.use(passport.authenticate('session'))

//Routing the requests:
app.use('/', indexRouter);      // Everything starting with '/' goes to the index route file
app.use('/users', usersRouter); // Everything starting with '/users' goes to the user route file

// If a URL doesn't match any route above, it's a 404.
app.use(function (req, res, next) {
  next(createError(404));
});
//Routing the requests:
app.use('/', indexRouter);      // Everything starting with '/' goes to the index route file
app.use('/users', usersRouter); // Everything starting with '/users' goes to the user route file

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;