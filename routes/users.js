var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/users', function(req, res){
  knex('users').then(function(result, err){
    res.render('/users/index', {users: result});
  });
});

router.get('/users/:id', function(req, res){
  var userId = req.params.id;
  var sessionId = req.sessions.userId;
  if(userId === sessionId){
    var user = req.body;
    knex('users').where('id', userId).update({
      full_name: user.full_name,
      username: user.username
    }).then(function(result, err){
      res.render('/users');
    });
  }
});


module.exports = router;
