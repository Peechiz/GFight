var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var Users = knex('users');

function loggedInUser(req, res, next){
  if(req.session.userId){
    next();
  }else{
    req.redirect('users/signin');
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

router.post('/', function(req, res){
  var user = req.body;
  Users.insert({
    full_name: user.full_name;
    username: user.username;
    avatar_url: user.avatar_url;
  }).then(function(result, err){
    res.redirect('/users')
  })
})

router.put('/:id', function(req, res){
  var userId = req.params.id;
  var user = req.body;
  if(user.password.length >= 8){
    var hash = bcrypt.hashSync(user.password, 10);
    Users.where('id', userId).update({
      full_name: user.full_name,
      username: user.username,
      avatar_url: user.avatar_url.
      password: hash
    }).then(function(result, err){
      res.redirect('/profile')
    });
  }else {
    res.redirect('/users')
  };
});

router.get('/:id', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', authId).first().then(function(adminUser, err){
    var adminUser = adminUser.admin;
    Users.where('id', userId).first().then(function(result, err){
      var user = results;
      if(userId === authId || adminUser){
        res.render('users/profile', {user: user});
      }else{
        res.redirect('users/signin');
      };
    });
  })
});

router.delete('/:id', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', userId).first().then(function(result, err){
    var user = results;
    if(userId === authId || user.admin){
      Users.where('id', userId).first().del().then(function(result, err){
        req.session=null;
        res.render('users/new');
      });
    }else{
      res.send('You are not authorized');
    };
  });
});

module.exports = router;
