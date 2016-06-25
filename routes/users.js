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
  knex('users').where('id', userId).then(function(result, err){
    res.render()
  });
});
