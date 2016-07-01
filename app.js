var express = require('express'),
    app = express(),
    path = require('path');
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    pg = require('pg');

require('locus');
require('dotenv').load();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// config passport strat
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//      knex('users').where({ username: username }).first().then( user =>{
// 			// user = user.toJSON();
// 			var hash = user.password;
// 			bcrypt.compare(password, hash, function(err,result){
// 				console.log('result?',result);
// 				if (!user) {
// 					return done(null, false, { message: 'Incorrect username.' });
// 				}
// 				if (!result) {
// 					return done(null, false, { message: 'Incorrect password.' });
// 				}
// 				return done(null, user);
// 			});
// 		})
// }));

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
  keys: process.env['SECRETKEY_1']
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  dont(null, obj);
});

// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:9001/auth/facebook/callback"
//   },function(accessToken, refreshToken, profile, cb){
//     User.findOrCreate({facebookId: profile.id}, function(err, user){
//       return cb(err, user);
//     })
//   })
// }))

// routes
//var auth = require('./routes/auth.js');
var users = require('./routes/users.js');
var weapons = require('./routes/weapons.js');
var fight = require('./routes/fight.js');

//app.use('/auth', auth);
app.use('/users', users);
app.use('/weapons', weapons);
app.use('/fight', fight);




// start server
var port = process.env.PORT || 9001
app.listen(port,() => {
  console.log('The Server is ' + port);
});
