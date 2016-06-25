var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/users', function(req, res){
  knex('users').then(function(result, err){
    res.render('/users/index', {users: result});
  });
});
