var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var Users = knex('users');

function loggedInUser(req, res, next){
  if(req.session.userId){
    next();
  }else{
    req.redirect('/signin');
  }
}

router.get('/users', function(req, res){
  Users.then(function(result, err){
    res.render('/users/index', {users: result});
  });
});

router.get('/new', function(req, res){
  res.render('/users/new');
});

router.get('/users/:id/', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', userId).first().then(function(result, err){
    var user = results;
    if(userId === authId || user.admin){
      res.render('/users/:id', {user: user});
    }
  })
});

router.delete('/users/:id', loggedInUser, function(req, res){

})


module.exports = router;
