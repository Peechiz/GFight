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

router.get('/', function(req, res){
  Users.then(function(result, err){
    res.render('/users/index', {users: result});
  });
});

router.get('/new', function(req, res){
  res.render('users/new');
});

router.get('/:id/edit', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', userid).first().then(function(result, err){
    var user = result;
    res.render('users/edit', {user: user});
  });
});

router.put('/:id', function(req, res){

})

router.delete('/:id', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', userId).first().then(function(result, err){
    var user = results;
    if(userId === authId || user.admin){
      Users.where('id', userId).first().del().then(function(result, err){
        res.render('users');
      })
    }else{
      res.send('You are not authorized');
    }
  });
});

router.get('/:id', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', userId).first().then(function(result, err){
    var user = results;
    if(userId === authId || user.admin){
      res.render('users/profile', {user: user});
    }else{
      res.redirect('signin');
    }
  })
});

module.exports = router;
