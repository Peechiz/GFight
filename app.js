var express = require('express'),
    app = express(),
    path = require('path');
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    pg = require('pg');

require('locus');
require('dotenv').load();
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
app.use(cookieSession({
  name: 'session',
  keys: [process.env['SECRETKEY_1']]
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  dont(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:9001/auth/facebook/callback"
  },function(accessToken, refreshToken, profile, cb){
    User.findOrCreate({facebookId: profile.id}, function(err, user){
      return cb(err, user);
    })
  }
}))


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
