var express = require('express'),
    app = express(),
    path = require('path');
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    pg = require('pg');

require('locus');

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


// routes
var auth = require('./routes/auth.js');
var users = require('./routes/users.js');
var weapons = require('./routes/weapons.js');

app.use('/auth', auth);
app.use('/users', users);
app.use('/weapons', weapons);



// start server
app.listen('9001',() => {
  console.log('The Server is OVER 9000!!!');
});
