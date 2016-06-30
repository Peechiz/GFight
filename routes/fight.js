var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var game = require('../game/logic');


router.get('/', function(req, res){
  knex('users').then(function(result, err){
    res.render('fight/select', {user: result});
  })
})

router.post('/:user1/:user1_fighter/:user2/:user2_fighter', function(req, res){
  var userId1 = req.params.user1;
  var userId2 = req.params.user2;
  var userFighter1 = req.params.user1_fighter;
  var userFighter2 = req.params.user2_fighter;

  var outcome = game.fight(userId1,userFighter1,userId2,userFighter2);

  res.redirect('fight/win', {outcome:outcome});
})

router.post('/:id/buy', function(req, res){
  var userId = req.params.id;
  var purchase = game.buyFighter(userId);
  if(purchase){
    res.redirect('/users/profile');
  }
})




module.exports = router;
