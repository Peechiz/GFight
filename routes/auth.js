var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/facebook', passport.authentication('facebook', {state: 'SOME STATE'}), function(req, res){

});

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/';)
});


module.exports = router;
